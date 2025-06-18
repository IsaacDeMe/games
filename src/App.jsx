
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import { Toaster } from '@/components/ui/toaster';
import CamisetasPage from '@/pages/camisetas';
import DonacionesPage from '@/pages/DonacionesPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/donacion" element={<DonacionesPage />} />
        <Route path="/camiseta" element={<CamisetasPage />} />


      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
