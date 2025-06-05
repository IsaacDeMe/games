import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import HistoriaSection from '@/components/HistoriaSection';
import CamisetasSection from '@/components/CamisetasSection';
import FuncionamientoSection from '@/components/FuncionamientoSection';
import Footer from '@/components/Footer';

const LandingPage = () => {
  

  return (
    <div className="min-h-screen bg-white pb-8 text-gray-900">

      <HeroSection />
      <HistoriaSection />
      <CamisetasSection />
      <FuncionamientoSection />
 
    </div>
  );
};

export default LandingPage;