/*import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const AuthModal = () => {
  const { showAuth, setShowAuth, login, register, setShowForgotPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData);
    }
    if (success) {
      setFormData({ name: '', email: '', phone: '', password: '' });
      // setShowAuth(false) is handled by login/register functions on success
    }
  };

  const handleClose = () => {
    setShowAuth(false);
    setFormData({ name: '', email: '', phone: '', password: '' });
  };

  const openForgotPasswordModal = () => {
    setShowAuth(false);
    setShowForgotPassword(true);
  }

  return (
    <AnimatePresence>
      {showAuth && (
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
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="auth-name">Nombre Completo</Label>
                  <Input
                    id="auth-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Tu nombre"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="tu@email.com"
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="auth-phone">Teléfono</Label>
                  <Input
                    id="auth-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Tu número de teléfono"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="auth-password">Contraseña</Label>
                <Input
                  id="auth-password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <Button variant="link" type="button" onClick={openForgotPasswordModal} className="text-sm p-0 h-auto">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base">
                {isLogin ? 'Acceder' : 'Registrarme'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;*/