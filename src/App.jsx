import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import LandingPage from '@/pages/LandingPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminRoute from '@/components/AdminRoute';
import { Toaster } from '@/components/ui/toaster';
import {ScrollToTop} from '@/components/ui/ScrollToTop';

const App = () => {
  return (
    <Router>
<ScrollToTop/>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white text-black">
          <Navigation /> {/* Navegación siempre visible */}
          <main className="flex-grow w-full pt-8 shadow-lg">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/crear-cuenta" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Ruta protegida para usuarios autenticados */}
              <Route
                path="/perfil"
                element={   
                    <ProfilePage />
                }
              />

              {/* Ruta protegida solo para admins */}
              <Route
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />

              {/* Ruta catch-all para redireccionar o mostrar 404 (opcional) */}
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </main>
          <Footer /> {/* Footer siempre visible */}
        </div>
        <Toaster/>
      </AuthProvider>
   </Router>
  );
};

export default App;
