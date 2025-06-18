import React from 'react';
import Navigation from '@/components/Navigation';
import CamisetasSection from '@/components/CamisetasSection';
import Footer from '@/components/Footer';
import ReservaSection from '@/components/funcionamientoreserva';

import { Toaster } from "@/components/ui/toaster";

const CamisetasPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
        <ReservaSection />
      <CamisetasSection />
      <Footer />
      <Toaster />
    </div>
  );
};

export default CamisetasPage;
