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
    Sabemos que no todo el mundo puede permitirse comprar una camiseta. Por eso hemos buscado dar todas las opciones para todo el mundo que quiera colaborar, pueda hacerlo!!
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
    {/* Botón "Apóyame" */}
    <Link
      to="/donacion"
      className="bg-blue-600 text-white px-6 py-3 w-full max-w-xs rounded-lg shadow-md hover:bg-blue-700 transition"
    >
      Apóyame
    </Link>

    {/* Botón "Camisetas" */}
    <Link
      to="/camiseta"
      className="bg-gray-600 text-white px-6 py-3 w-full max-w-xs rounded-lg shadow-md hover:bg-gray-700 transition"
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
