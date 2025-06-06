import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Camisetas para los
          <span className="block bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            CrossFit Games
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
        >
          Ayúdame a poder cumplir un sueño sin venderme un riñón.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button 
            size="lg" 
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg"
            onClick={() => scrollToSection('camisetas')}
          >
            Reservar Mi Camiseta
            <ShoppingBag className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12"
        >
          <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-gray-400" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;