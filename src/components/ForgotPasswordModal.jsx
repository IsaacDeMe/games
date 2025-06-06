import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient'; // We need supabase directly for OTP flow

const ForgotPasswordModal = () => {
  const { showForgotPassword, setShowForgotPassword, setShowAuth, sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP and new password

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    // Supabase's default resetPasswordForEmail sends a link, not an OTP for immediate use in modal.
    // For this custom OTP flow, we'd need a serverless function to generate and send OTP, then verify.
    // We'll use the standard Supabase flow for now (sends link).
    // If you want true OTP in modal, that's a more complex setup.
    const success = await sendPasswordResetEmail(email);
    if (success) {
      toast({ title: "Correo enviado", description: "Revisa tu bandeja de entrada (y spam) para el enlace de reestablecimiento." });
      // We don't go to step 2 with the default Supabase flow, as user clicks a link.
      // Closing modal and informing user.
      setShowForgotPassword(false);
    }
  };
  
  // The OTP and new password part would be more complex with Supabase default flow.
  // User clicks a link which often includes a token.
  // This modal component could be simplified to just collect email.
  // Or, if you have a custom OTP backend:
  const handleVerifyOtpAndResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    // This is where you'd call your custom OTP verification + password reset function.
    // For Supabase, if the user is setting a new password after clicking a link,
    // they're usually on a page where Supabase.auth.updateUser({ password: newPassword }) can be called.
    // This modal isn't typically part of that flow *after* clicking the link.
    // Let's assume for now this is a simplified view and `resetPasswordWithToken` would be used.
    // However, we don't have a "token" from an OTP in this Supabase flow.

    // Simulating a successful reset for UI purposes, this needs real logic for OTP.
    // With Supabase, after clicking the email link, the user is usually on a new page/session
    // where they enter the new password and supabase.auth.updateUser() is called.
    // A modal with OTP is not the standard Supabase recovery flow.
    // We will use `supabase.auth.updateUser` if the user is already authenticated
    // via the reset token in the URL which Supabase handles by setting a session.

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Error", description: "Sesión inválida o expirada. Por favor, solicita un nuevo enlace de reestablecimiento.", variant: "destructive"});
      setStep(1); // Go back to email step
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "Contraseña Actualizada", description: "Tu contraseña ha sido reestablecida exitosamente." });
        setShowForgotPassword(false);
        setEmail(''); setOtp(''); setNewPassword(''); setConfirmNewPassword('');
        setStep(1);
    }
  };


  const handleClose = () => {
    setShowForgotPassword(false);
    setEmail(''); setOtp(''); setNewPassword(''); setConfirmNewPassword('');
    setStep(1);
  };

  const openLoginModal = () => {
    handleClose();
    setShowAuth(true);
  }

  return (
    <AnimatePresence>
      {showForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                {step === 1 ? "Recuperar Contraseña" : "Reestablecer Contraseña"}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {step === 1 && (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email">Email de tu cuenta</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Te enviaremos un enlace para reestablecer tu contraseña.</p>
                </div>
                <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base">
                  Enviar Enlace
                </Button>
              </form>
            )}
            
            {/* Step 2 would be part of the page user lands on after clicking email link with Supabase default flow */}
            {/* This modal would typically not handle step 2 directly with Supabase standard reset. */}
            {/* For a custom OTP flow, step 2 would be: */}
            {step === 2 && (
                <form onSubmit={handleVerifyOtpAndResetPassword} className="space-y-4">
                    <div>
                        <Label htmlFor="otp-code">Código OTP</Label>
                        <Input id="otp-code" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Código de 5 dígitos" />
                        <p className="text-xs text-gray-500 mt-1">Introduce el código que te hemos enviado a {email}.</p>
                    </div>
                    <div>
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <div>
                        <Label htmlFor="confirm-new-password">Confirmar Nueva Contraseña</Label>
                        <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base">
                        Reestablecer Contraseña
                    </Button>
                </form>
            )}


            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={openLoginModal}
                className="text-sm"
              >
                Volver a Iniciar Sesión
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;