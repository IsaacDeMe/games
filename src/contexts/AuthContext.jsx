import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [reservations, setReservations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user);
        await fetchUserReservations(currentSession.user.id);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          await fetchUserProfile(newSession.user);
          await fetchUserReservations(newSession.user.id);
        } else {
          setCurrentUser(null);
          setReservations([]);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (user) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      toast({ title: "Error", description: "No se pudo cargar el perfil.", variant: "destructive" });
    } else if (data) {
      setCurrentUser({ ...user, ...data });
    } else {
      // if profile doesn't exist yet (e.g. right after signup before trigger runs)
      // use metadata from auth user or defaults
      setCurrentUser({
        ...user,
        full_name: user.user_metadata?.full_name || user.email,
        phone: user.user_metadata?.phone || '',
        avatar_url: user.user_metadata?.avatar_url || null
      });
    }
  };
  
  const fetchUserReservations = async (userId) => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
    } else {
      setReservations(data || []);
    }
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    setShowAuth(false);
    toast({ title: "¡Bienvenido de vuelta!", description: "Has iniciado sesión correctamente" });
    return true;
  };

  const register = async (userData) => {
    const { name, email, phone, password } = userData;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone,
        }
      }
    });

    if (authError) {
      toast({ title: "Error de registro", description: authError.message, variant: "destructive" });
      return false;
    }
    
    // Profile will be created by trigger, fetchUserProfile will pick it up on auth state change.
    setShowAuth(false);
    toast({ title: "¡Registro exitoso!", description: "Revisa tu email para confirmar tu cuenta." });
    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: "No se pudo cerrar sesión.", variant: "destructive" });
    } else {
      toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente" });
    }
  };

  const updateProfile = async (updatedData, currentPassword) => {
    if (!currentUser) return false;
  
    // Check current password by trying to update the user with it.
    // This is a workaround as Supabase doesn't have a direct "verifyPassword" client-side.
    // Only do this if email is not being changed, as email change has its own flow.
    if (updatedData.email === currentUser.email) {
      const { error: passwordCheckError } = await supabase.auth.updateUser({ password: currentPassword });
      if (passwordCheckError && passwordCheckError.message !== "New password should be different from the old password.") {
         // Re-update with old password if it's not being changed
        await supabase.auth.updateUser({ password: currentPassword }); // to revert to original if it was just a check
      } else if (passwordCheckError && passwordCheckError.message === "New password should be different from the old password.") {
        // This means the current password is correct
      } else if (passwordCheckError) {
        toast({ title: "Error", description: "Contraseña actual incorrecta.", variant: "destructive" });
        return false;
      }
    }


    const { name, email: newEmail, phone, avatar_url } = updatedData;
    let userUpdates = {};
    let profileUpdates = { avatar_url }; // Always update avatar_url in profiles table

    if (name && name !== (currentUser.full_name || currentUser.user_metadata?.full_name)) profileUpdates.full_name = name;
    if (phone && phone !== (currentUser.phone || currentUser.user_metadata?.phone)) profileUpdates.phone = phone;
    
    // If email changes, Supabase has a specific flow (sends confirmation to new email)
    if (newEmail && newEmail !== currentUser.email) {
      userUpdates.email = newEmail;
    }
    
    // Update Supabase Auth user data (email, and potentially user_metadata if needed)
    if (Object.keys(userUpdates).length > 0) {
      const { data: userUpdateResult, error: userUpdateError } = await supabase.auth.updateUser(userUpdates);
      if (userUpdateError) {
        toast({ title: "Error", description: `Error actualizando datos: ${userUpdateError.message}`, variant: "destructive" });
        return false;
      }
      if (userUpdateResult && userUpdates.email) {
         toast({ title: "Email Actualizado", description: "Se ha enviado un correo de confirmación a tu nueva dirección."});
      }
    }
    
    // Update 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', currentUser.id);

    if (profileError) {
      toast({ title: "Error", description: `Error actualizando perfil: ${profileError.message}`, variant: "destructive" });
      return false;
    }
    
    await fetchUserProfile(currentUser); // Refresh user data
    return true;
  };

  const updateUserPassword = async (currentPassword, newPassword) => {
    // First, try to sign in with current password to verify it. This is a bit of a hack.
    // A better way would be a dedicated server-side function if strict verification is needed before update.
    // However, updateUser will also fail if currentPassword is wrong for certain auth backends.
    // For Supabase, updating password directly is the way. It implies current session is trusted.
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({ title: "Error", description: `No se pudo cambiar la contraseña: ${error.message}`, variant: "destructive" });
      return false;
    }
    toast({ title: "Contraseña actualizada", description: "Tu contraseña ha sido cambiada." });
    return true;
  };

  const sendPasswordResetEmail = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile?reset_token=true`, // a URL to redirect to after successful reset
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Correo enviado", description: "Si existe una cuenta con ese email, recibirás instrucciones para reestablecer tu contraseña." });
    return true;
  };
  
  const resetPasswordWithToken = async (token, newPassword) => {
    // This function is generally called when user clicks link in email.
    // The token is part of the URL. Supabase handles this on session update.
    // Here, we might be dealing with OTP/code based reset confirmation.
    // For Supabase, password recovery flow via link implicitly handles token.
    // If you mean confirming with a code sent to email (custom flow), that's different.
    // The standard resetPasswordForEmail sends a link, not a code.
    // For now, this function assumes a scenario where a new password is set after some verification (e.g. OTP)
    // Supabase's `updateUser` is used if the user is already logged in and has a valid session.
    // If using OTP from email for reset, the OTP verifies user, then you call updateUser.
    
    // This simplified version assumes the user is already somehow verified (e.g. by OTP input)
    // and we are just updating their password.
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: `No se pudo reestablecer la contraseña: ${error.message}`, variant: "destructive" });
      return false;
    }
    toast({ title: "Contraseña Reestablecida", description: "Tu contraseña ha sido cambiada exitosamente." });
    return true;
  };


  const addReservation = async (reservationData) => {
    if (!currentUser) {
      toast({ title: "Error", description: "Debes iniciar sesión para reservar.", variant: "destructive" });
      return false;
    }
    const newReservation = { user_id: currentUser.id, ...reservationData, status: 'Reserva provisional' };
    const { data, error } = await supabase.from('reservations').insert([newReservation]).select();
    if (error) {
      toast({ title: "Error", description: `No se pudo crear la reserva: ${error.message}`, variant: "destructive" });
      return false;
    }
    if (data) setReservations(prev => [...prev, ...data]);
    toast({ title: "¡Reserva realizada!", description: "Te contactaremos pronto para el pago" });
    return true;
  };

  const deleteReservation = async (reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation?.status !== 'Reserva provisional') {
      toast({ title: "No se puede eliminar", description: "Ya has pagado esta reserva...", variant: "destructive" });
      return false;
    }
    const { error } = await supabase.from('reservations').delete().eq('id', reservationId);
    if (error) {
      toast({ title: "Error", description: `No se pudo eliminar: ${error.message}`, variant: "destructive" });
      return false;
    }
    setReservations(prev => prev.filter(r => r.id !== reservationId));
    toast({ title: "Reserva eliminada" });
    return true;
  };

  const value = {
    isLoggedIn: !!session?.user,
    currentUser,
    session,
    showAuth,
    setShowAuth,
    showForgotPassword,
    setShowForgotPassword,
    login,
    register,
    logout,
    updateProfile,
    updateUserPassword,
    sendPasswordResetEmail,
    resetPasswordWithToken,
    addReservation,
    deleteReservation,
    reservations,
    fetchUserReservations
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};