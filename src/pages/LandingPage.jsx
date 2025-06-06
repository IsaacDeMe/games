import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import HistoriaSection from '@/components/HistoriaSection';
import CamisetasSection from '@/components/CamisetasSection';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <HeroSection />
      <HistoriaSection />
      <CamisetasSection />
      <Footer />
      <Toaster />
    </div>
  );
};

export default LandingPage;