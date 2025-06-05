import React from 'react';
import { Instagram, MessageCircle, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold mb-4 block">Navegación</span>
            <div className="space-y-2">
              <button onClick={() => scrollToSection('historia')} className="block hover:text-gray-300 transition-colors">
                Mi Historia
              </button>
              <button onClick={() => scrollToSection('camisetas')} className="block hover:text-gray-300 transition-colors">
                Camisetas
              </button>
              <button onClick={() => scrollToSection('funcionamiento')} className="block hover:text-gray-300 transition-colors">
                Funcionamiento
              </button>
            </div>
          </div>

          <div>
            <span className="text-xl font-bold mb-4 block">Redes Sociales</span>
            <div className="space-y-2">
              <a 
                href="https://instagram.com/isaaacdelfa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-gray-300 transition-colors"
              >
                <Instagram className="w-5 h-5 mr-2" />
                @isaaacdelfa
              </a>
              <a 
                href="https://tiktok.com/@isaacdelfamedina" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-gray-300 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                @isaacdelfamedina
              </a>
            </div>
          </div>

          <div>
            <span className="text-xl font-bold mb-4 block">Contacto</span>
            <div className="space-y-2">
              <a 
                href="mailto:isaacdelfamedina@gmail.com"
                className="flex items-center hover:text-gray-300 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                isaacdelfamedina@gmail.com
              </a>
              <a 
                href="tel:+34642571133"
                className="flex items-center hover:text-gray-300 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                642 571 133
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Cualquier duda no dudes de escribirme por redes o por teléfono
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Isaac Delfa Medina. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;