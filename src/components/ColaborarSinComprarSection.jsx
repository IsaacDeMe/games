import React from 'react';
import { motion } from 'framer-motion';

const ColaborarSinComprarSection = () => {
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
            Colaborar sin Comprar Camiseta
          </h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-6 text-center">
            <p>
              Sabemos que no todo el mundo puede permitirse una camiseta, pero si aún quieres ayudar, 
              hemos creado un GoFundMe para que puedas realizar un donativo de la cantidad que desees. 
              Cualquier aporte será de gran ayuda y lo agradecemos de corazón.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://gofund.me/91ae41ec"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Donar en GoFundMe
              </a>
              <a
                href="https://isaacthrowdown.me"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Más Información del Evento
              </a>
            </div>
            <p>
              Además, si estás cerca de Tarragona, el 9 de agosto te invitamos al Do-Box Fitness Club, donde podrás 
              competir en equipos de tres o simplemente disfrutar del ambiente y la competición. ¡Habrá un sorteo y 
              muchas sorpresas para todos los asistentes!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ColaborarSinComprarSection;
