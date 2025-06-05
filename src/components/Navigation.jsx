import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const { user, loading } = useAuth();       // ← Aquí obtenemos user y loading
  const { currentUser, setShowAuth } = useAuth();
  const isLoggedIn = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const isAdmin = currentUser?.email === 'isaacdelfamedina@gmail.com';

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location, navigate]);

  const navItems = [
    { label: 'Mi Historia', section: 'historia' },
    { label: 'Camisetas', section: 'camisetas' },
    { label: 'Funcionamiento', section: 'funcionamiento' }
  ];

  // Aquí la función corregida para el icono User
  const handleProfileClick = () => {
    console.log("Estado autenticado:", isLoggedIn, "Usuario actual:", user);
    if (isLoggedIn) {
      navigate('/perfil'); // Redirige a la ruta de perfil
    } else {
      navigate('/login');  // Redirige a login si no está autenticado
    }
        setMobileMenuOpen(false);

  };



  const handleDashboardClick = () => {
    navigate('/admin-dashboard');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        event.target.closest('nav') === null &&
        !event.target.closest('button[aria-label="Toggle menu"]')
      ) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-[100] border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl md:block hidden">
            Isaac Delfa
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 z-[110]"
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button 
                key={item.section}
                onClick={() => scrollToSection(item.section)} 
                className="hover:text-gray-900 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && (
              <Button variant="ghost" onClick={handleDashboardClick} className="p-2">
                <LayoutDashboard className="w-7 h-7" />
              </Button>
            )}
            <Button variant="ghost" onClick={handleProfileClick} className="p-2" aria-label="Ir al perfil o login">
              <User className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl z-[105] md:hidden pt-16"
          >
            <div className="p-6 space-y-6 mt-5">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="block w-full text-left text-lg font-medium hover:text-gray-900 transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
