import React from 'react';
import { motion } from 'framer-motion';

const HistoriaSection = () => {
  return (
    <section id="historia" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900">
            Mi Historia
          </h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-6">
            <p className="text-center">
              Hola soy <span className="font-semibold">Isaac Delfa Medina</span>, tengo 15 años y llevo 4 años practicando <span className="font-semibold">CrossFit</span>. A base de mucho esfuerzo, he conseguido clasificarme por segunda vez a los <span className="font-semibold">CrossFit Games</span>.
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
                  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/b8faa637ea0c51295aa210c7c73d6811.jpg"
                />
              </div>
            </motion.div>
            <p className="text-center">
              Pero tristemente siempre entra un tercer factor, que es el <span className="font-semibold">económico</span>. Para mí es un sueño cumplido clasificar a Games, pero la realidad es que económicamente no puedo permitírmelo. Competiciones como esta las pagamos los propios competidores, y participar en los Games supone un gasto muy elevado tanto en desplazamiento como en competición.
            </p>
            <p className="text-center">
              Por este motivo hemos creado iniciativas como la <span className="font-semibold">venta de camisetas</span> , la <span className="font-semibold">competición benéfica</span> o la <span className="font-semibold">donación</span>. 
              Porqué confío en la fuerza de la comunidad, que siempre ha demostrado ser un pilar fundamental para los atletas como yo. ¡Gracias por tu apoyo!
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                      Colabora por esta causa, y ayúdame a ir a games
                    </h2>
                    <div className="text-lg text-gray-700 leading-relaxed space-y-6 text-center">
                   
                      <div className="flex justify-center space-x-4">
                        <Link to="/donacion"
                          
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

export default HistoriaSection;
