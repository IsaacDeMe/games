import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const targetId = sectionId === 'guia-tallas' ? 'guia-tallas-tabla' : sectionId;
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: targetId } });
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        navigate(location.pathname, { replace: true, state: {} }); 
      }, 100);
    }
  }, [location, navigate]);

  const navItems = [
    { label: 'Mi Historia', section: 'historia' },
    { label: 'Funcionamiento de la Reserva', section: 'reserva' } ,// Nuevo elemento
    { label: 'Camisetas', section: 'camisetas' },
    { label: 'Guía de Tallas', section: 'guia-tallas' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && event.target.closest('nav') === null) {
        if (!event.target.closest('button[aria-label="Toggle menu"]')) {
          setMobileMenuOpen(false);
        }
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
          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 z-[110]"
            >
              {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
          
          <Link to="/" className="font-bold text-xl md:order-none order-1">
            Isaac Delfa
          </Link>

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
          
          <div className="md:hidden w-8"> {/* Placeholder para equilibrar el espacio en móvil */}</div>
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
