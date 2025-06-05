import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import HistoriaSection from '@/components/HistoriaSection';
import CamisetasSection from '@/components/CamisetasSection';
import FuncionamientoSection from '@/components/FuncionamientoSection';
import Footer from '@/components/Footer';

const LandingPage = () => {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hola soy ... tengo una duda de ...");
    window.open(`https://wa.me/34642571133?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pb-8 text-gray-900">

      <HeroSection />
      <HistoriaSection />
      <CamisetasSection />
      <FuncionamientoSection />
 

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-colors"
      >
       
      </motion.button>
    </div>
  );
};

export default LandingPage;