// src/pages/SignUpPage.jsx
import React, { useState , useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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

const SignUpPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');      // ← Estado para teléfono
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validaciones de contraseña, teléfono, etc.
  if (password !== confirmPassword) {
    toast({
      title: "Error de Contraseña",
      description: "Las contraseñas no coinciden.",
      variant: "destructive",
    });
    return;
  }
  if (password.length < 6) {
      toast({
        title: "Contraseña Débil",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

  setIsLoading(true);
  try {
    await signup(email, password, fullName, "", phoneNumber);
    toast({
      title: "Cuenta Creada Exitosamente",
      description:
        "Se ha enviado un correo de verificación. Revisa tu bandeja (y spam) y luego inicia sesión.",
      duration: 8000,
    });

    // Redirige tras un pequeño delay para que el usuario lea el toast
    setTimeout(() => navigate('/login'), 1000);
  } catch (error) {
    let errorMessage = "No se pudo crear la cuenta. Inténtalo de nuevo.";
    if (error.message.includes("User already registered")) {
      errorMessage = "Ese correo ya está registrado.";
    } else if (
      error.message.includes("Password should be at least 6 characters")
    ) {
      errorMessage = "La contraseña debe tener al menos 6 caracteres.";
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.message.includes("over_email_send_rate_limit")){
      errorMessage = "Debes de esparar un minuto antes de volver a intentar registrarte"
    } else{
    toast({
      title: "Error al Crear Cuenta",
      description: errorMessage,
      variant: "destructive",
      duration: 8000,
    });
    }
    
  } finally {
    setIsLoading(false);
  }



    setIsLoading(true);
    try {
      // Pasamos avatarUrl="" porque no subimos avatar por ahora
      await signup(email, password, fullName, "", phoneNumber);
      toast({
        title: "Cuenta Creada Exitosamente",
        description: "Se ha enviado un correo de verificación. Revisa tu bandeja (y spam) y luego inicia sesión.",
        duration: 8000,
      });
      // Redirigimos tras 5 segundos
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      let errorMessage = "No se pudo crear la cuenta. Inténtalo de nuevo.";
      if (error.message.includes("User already registered")) {
        errorMessage = "Ese correo ya está registrado.";
      } else if (
        error.message.includes("Password should be at least 6 characters")
      ) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Error al Crear Cuenta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border border-gray-300 text-black shadow-lg rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">Crear una Cuenta</CardTitle>
            <CardDescription className="text-gray-600">
              Únete para acceder a todas las funcionalidades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre Completo */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Ej: Isaac Delfa Medina"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border border-gray-300 rounded-lg text-black focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Ej: usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border border-gray-300 rounded-lg text-black focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Número de Teléfono */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Teléfono
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  required
                  placeholder="Ej: +34642571133"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border border-gray-300 rounded-lg text-black focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña (mín. 6 caracteres)
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="•••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border border-gray-300 rounded-lg text-black focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="•••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border border-gray-300 rounded-lg text-black focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Botón de Envío */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base rounded-lg shadow-md"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
                onClick={() => window.scrollTo(0, 0)}
              >
                Inicia Sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
