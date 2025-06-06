import React from 'react';
import { motion } from 'framer-motion';
import MessageGeneratorForm from '@/components/MessageGeneratorForm';

const SizeChart = () => {
  const sizes = [
    { eu: 'XS', ancho: '46 cm', largo: '68 cm' },
    { eu: 'S', ancho: '48 cm', largo: '70 cm' },
    { eu: 'M', ancho: '51 cm', largo: '72 cm' },
    { eu: 'L', ancho: '54 cm', largo: '74 cm' },
    { eu: 'XL', ancho: '57 cm', largo: '76 cm' },
    { eu: 'XXL', ancho: '60 cm', largo: '78 cm' },
    { eu: '3XL', ancho: '64 cm', largo: '80 cm' },
    { eu: '4XL', ancho: '68 cm', largo: '72 cm' },
    { eu: '5XL', ancho: '72 cm', largo: '84 cm' },
  ];

  return (
    <div id="guia-tallas-tabla" className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <img  
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/dbcc4724401e1d9715191c39098ce200.png" 
          alt="Diagrama de medidas de camiseta" 
          className="w-full md:w-[35%] object-contain"
        />
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-1.5 font-semibold text-gray-700">EU</th>
                <th className="p-1.5 font-semibold text-gray-700">Ancho (A)</th>
                <th className="p-1.5 font-semibold text-gray-700">Largo (B)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size.eu} className="border-b border-gray-100">
                  <td className="p-1.5 font-medium">{size.eu}</td>
                  <td className="p-1.5">{size.ancho}</td>
                  <td className="p-1.5">{size.largo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">* Las medidas son aproximadas y pueden variar ligeramente.</p>
    </div>
  );
};

const CamisetasSection = () => {
  return (
    <section id="camisetas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Mis Camisetas</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige tu diseño favorito y genera el mensaje para unirte al pedido.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <MessageGeneratorForm />
          </div>
        </motion.div>

        <motion.div
          id="guia-tallas"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <SizeChart />
        </motion.div>
      </div>
    </section>
  );
};

export default CamisetasSection;