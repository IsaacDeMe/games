// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Si viene ?redirect=/algo, lo usamos; si no, /perfil
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/perfil';

  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "¡Bienvenido de nuevo! Redirigiendo...",
      });
      // El useEffect se encargará de la redirección
    } catch (error) {
      let errorMessage = "Credenciales incorrectas o error desconocido. Inténtalo de nuevo.";
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Tu correo aún no ha sido verificado. Revisa tu bandeja de entrada.";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast({
        title: "Error al Iniciar Sesión",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Correo Requerido",
        description: "Por favor ingresa tu correo para restablecer contraseña.",
        variant: "destructive",
      });
      return;
    }
    setIsFormLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-contrasena`,
      });
      if (error) throw error;
      toast({
        title: "Correo Enviado",
        description: "Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el correo de restablecimiento.",
        variant: "destructive",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  if (authLoading) {
    return <div className="text-center py-20">Cargando...</div>;
  }
  if (!authLoading && user) {
    return <div className="text-center py-20">Redirigiendo a tu perfil...</div>;
  }
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-12 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border border-gray-300 text-gray-900 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-600">
              Accede a tu cuenta para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="emailLogin" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <Input
                  id="emailLogin"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  className="bg-white border border-gray-300 rounded-lg text-black focus:ring-primary focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isFormLoading || authLoading} 
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <label htmlFor="passwordLogin" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs text-primary hover:underline px-0 h-auto py-0"
                    onClick={handleForgotPassword}
                    disabled={isFormLoading || authLoading}  
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                <Input
                  id="passwordLogin"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-white border border-gray-300 rounded-lg text-black focus:ring-primary focus:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isFormLoading || authLoading}  
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground futuristic-glow py-3 text-base"
                disabled={isFormLoading || authLoading}  
              >
                {isFormLoading || authLoading ? 'Procesando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/crear-cuenta" className="font-medium text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
