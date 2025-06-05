import React from 'react';
import { motion } from 'framer-motion';

const HistoriaSection = () => {
  return (
    <section id="historia" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 items-center">

          {/* Título con animación desde abajo */}
         <motion.h2
          initial={{ opacity: 0, y:50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-7xl font-bold mb-6"
        >
            Mi Historia
          </motion.h2>

          {/* Primer párrafo */}
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Hola, soy Isaac Delfa Medina, tengo 15 años, y llevo 4 años practicando CrossFit. 
            A base de mucho esfuerzo he conseguido clasificarme por segunda vez a los CrossFit Games.
          </motion.p>

          {/* Imagen en medio */}
          <motion.div
            className="transform rotate-3 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <img  
              alt="Isaac Delfa practicando CrossFit"
              className="w-full h-auto rounded-lg"
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/b8faa637ea0c51295aa210c7c73d6811.jpg" 
            />
          </motion.div>

          {/* Segundo párrafo */}
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Estoy muy ilusionado de la posibilidad de repetir esta gran experiencia, aunque preocupado, 
            ya que como muchos ya sabéis, las competiciones las pagamos los competidores, y competir en Games 
            supone un gasto muy elevado tanto de desplazamiento como de competición. Por este motivo 
            hemos hecho estas camisetas para recaudar fondos.
          </motion.p>

        </div>
      </div>
    </section>
  );
};

export default HistoriaSection;