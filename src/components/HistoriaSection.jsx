import React from 'react';
import { motion } from 'framer-motion';

const HistoriaSection = () => {
  return (
    <section id="historia" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">Mi Historia</h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-6">
            <p>
              Hola soy Isaac Delfa Medina, tengo 15 años, y llevo 4 años practicando CrossFit. 
              A base de mucho esfuerzo he conseguido clasificarme por segunda vez a los CrossFit games.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="my-8 md:my-12"
            >
              <div className="shadow-2xl rounded-lg overflow-hidden max-w-2xl mx-auto">
                <img  
                  alt="Isaac Delfa practicando CrossFit"
                  className="w-full h-auto"
                  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/b8faa637ea0c51295aa210c7c73d6811.jpg" />
              </div>
            </motion.div>
            <p>
              Estoy muy ilusionado de la posibilidad de repetir esta gran experiencia, aunque preocupado, 
              ya que como muchos ya sabéis, las competiciones las pagamos los competidores, y competir en Games, 
              supone un gasto muy elevado tanto como de desplazamiento como de competición. Por este motivo 
              hemos hecho estas camisetas para recaudar fondos.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HistoriaSection;