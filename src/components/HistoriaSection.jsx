import React from 'react';
import { motion } from 'framer-motion';

const HistoriaSection = () => {
  return (
    <section id="historia" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:order-1 order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Mi Historia</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hola soy Isaac Delfa Medina, tengo 15 años, y llevo 4 años practicando CrossFit. 
              A base de mucho esfuerzo he conseguido clasificarme por segunda vez a los CrossFit games.
              <br /><br />
              Estoy muy ilusionado de la posibilidad de repetir esta gran experiencia, aunque preocupado, 
              ya que como muchos ya sabéis, las competiciones las pagamos los competidores, y competir en Games, 
              supone un gasto muy elevado tanto como de desplazamiento como de competición. Por este motivo 
              hemos hecho estas camisetas para recaudar fondos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -5 }}
            whileInView={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative md:order-2 order-1"
          >
            <div className="transform rotate-3 shadow-2xl">
              <img  
                alt="Isaac Delfa practicando CrossFit"
                className="w-full h-auto rounded-lg"
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/b8faa637ea0c51295aa210c7c73d6811.jpg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HistoriaSection;