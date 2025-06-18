import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

const Colaborar = () => {
  return (
    <section id="colaborar" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Colabora por esta causa, y ayúdame a ir a games
          </h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-6 text-center">
            <p>
              Sabemos que no todo el mundo, vive cerca para venir a competir, o puede permitirse comprar una camiseta. Por eso hemos buscado dar todas las opciones para todo el mundo que quiera colaborar, pueda hacerlo!!
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/donaciones"
                
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Apóyame
              </Link>
              <a
                href="https://wod4dreams.es"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Más Información del Evento
              </a>
                 <Link to="/camiseta"
                href="https://wod4dreams.es"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Camisetas
              </Link>
            </div>
         
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Colaborar;
