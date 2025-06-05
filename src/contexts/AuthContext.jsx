// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);
const ADMIN_EMAIL = 'isaacdelfamedina@gmail.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // { id, email, role, fullName, profileImageUrl, phoneNumber }
  const [loading, setLoading] = useState(true);

  // Control para evitar setState después de desmontar
  let isMounted = true;
  useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  // 1) Extraer datos del perfil (incluye phone_number)
  const fetchUserProfile = async (authUser) => {
    console.log('fetchUserProfile: Extrayendo user_metadata para ID →', authUser?.id);
    if (!authUser) {
      console.warn('fetchUserProfile: No se recibió authUser');
      return null;
    }
    try {
      const metadata = authUser.user_metadata || {};
      const fullName       = metadata.full_name   || authUser.email.split('@')[0] || 'Usuario';
      const profileImageUrl = metadata.avatar_url  || '';
      const phoneNumber     = metadata.phone_number || '';  // <-- recuperamos phone_number
      return {
        id: authUser.id,
        email: authUser.email,
        role: authUser.email === ADMIN_EMAIL ? 'admin' : authUser.role || 'user',
        fullName,
        profileImageUrl,
        phoneNumber,
      };
    } catch (e) {
      console.error('fetchUserProfile: Excepción al leer user_metadata →', e);
      return {
        id: authUser.id,
        email: authUser.email,
        role: authUser.email === ADMIN_EMAIL ? 'admin' : authUser.role || 'user',
        fullName: authUser.email.split('@')[0] || 'Usuario',
        profileImageUrl: '',
        phoneNumber: '',
      };
    }
  };

  // 2) Hook de inicialización: obtiene la sesión actual y se suscribe a cambios
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('initializeAuth: Iniciando validación de sesión');
      if (!isMounted) return;
      setLoading(true);

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        console.log('initializeAuth: Sesión obtenida →', session);

        if (!isMounted) return;

        if (sessionError) {
          console.error('initializeAuth: Error al obtener sesión →', sessionError);
          if (isMounted) setUser(null);
        } else if (session?.user) {
          console.log('initializeAuth: Usuario autenticado →', session.user);
          const fullUserData = await fetchUserProfile(session.user);
          console.log('initializeAuth: fetchUserProfile devolvió →', fullUserData);
          if (isMounted) setUser(fullUserData);
        } else {
          if (isMounted) setUser(null);
        }
      } catch (err) {
        console.error('initializeAuth: Excepción durante init →', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('initializeAuth: Validación terminada (loading=false)');
        }
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('onAuthStateChange: Evento detectado →', _event);
        if (!isMounted) return;

        setLoading(true);
        if (session?.user) {
          console.log('onAuthStateChange: fetchUserProfile para →', session.user);
          const fullUserData = await fetchUserProfile(session.user);
          console.log('onAuthStateChange: fetchUserProfile devolvió →', fullUserData);
          if (isMounted) setUser(fullUserData);
        } else {
          if (isMounted) setUser(null);
        }
        if (isMounted) {
          setLoading(false);
          console.log('onAuthStateChange: loading = false');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
      console.log('initializeAuth: Cleanup ejecutado');
    };
  }, []);

  // 3) Función login (email + contraseña)
  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('login: Intentando iniciar sesión para →', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // El listener onAuthStateChange actualizará user y loading
      return data.user;
    } catch (error) {
      console.error('login: Error iniciando sesión →', error);
      if (isMounted) {
        setUser(null);
        setLoading(false);
      }
      throw error;
    }
  };

  // 4) Función signup (registro) con nombre completo, avatar y teléfono en user_metadata
  const signup = async (email, password, fullName, avatarUrl, phoneNumber) => {
    setLoading(true);
    try {
      console.log('signup: Intentando registrar para →', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            avatar_url: avatarUrl,
            phone_number: phoneNumber,   // <-- incluimos phone_number aquí
          },
        },
      });
      if (error) throw error;
      // El nuevo usuario queda con user_metadata = { full_name, avatar_url, phone_number }
      if (isMounted) setLoading(false);
      return data.user;
    } catch (error) {
      console.error('signup: Error al registrarse →', error);
      if (isMounted) {
        setUser(null);
        setLoading(false);
      }
       if (error.message.includes("over_email_send_rate_limit")) {
      throw new Error(
        "Has solicitado demasiados registros en poco tiempo. Por favor, espera un momento antes de intentar nuevamente."
      );
    }
      throw error;
    }
  };

  // 5) Función logout
  const logout = async () => {
    if (isMounted) setLoading(true);
    try {
      console.log('logout: Cerrando sesión');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // onAuthStateChange pondrá user = null y loading = false
    } catch (error) {
      console.error('logout: Error cerrando sesión →', error);
      const sessionUser = supabase.auth.user();
      if (sessionUser && isMounted) {
        const stillLoggedInUser = await fetchUserProfile(sessionUser);
        setUser(stillLoggedInUser);
      } else if (isMounted) {
        setUser(null);
      }
      if (isMounted) setLoading(false);
      throw error;
    }
  };

  // 6) Función para actualizar nombre, avatar y teléfono (user_metadata)
  const updateUserProfile = async (newFullName, newAvatarUrl, newPhoneNumber) => {
    const currentAuthSessionUser = supabase.auth.user();
    if (!currentAuthSessionUser) {
      throw new Error('Usuario no autenticado.');
    }

    if (isMounted) setLoading(true);
    try {
      console.log('updateUserProfile: Actualizando user_metadata');
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: newFullName,
          avatar_url: newAvatarUrl,
          phone_number: newPhoneNumber, // <-- aquí también lo incluimos
        },
      });
      if (error) throw error;

      // Data.user ya tiene metadata actualizada
      // Volvemos a “fetchear” para refrescar el contexto
      const refreshedUser = await fetchUserProfile(data.user);
      if (isMounted && refreshedUser) setUser(refreshedUser);
      return refreshedUser;
    } catch (error) {
      console.error(
        'updateUserProfile: Error actualizando metadata →',
        error
      );
      const rollbackUser = await fetchUserProfile(currentAuthSessionUser);
      if (isMounted) setUser(rollbackUser);
      throw error;
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  // 7) Valor que exponemos a la app
  const value = {
    user,         // ahora contiene user.phoneNumber
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'useAuth debe usarse dentro de un AuthProvider'
    );
  }
  return context;
};
