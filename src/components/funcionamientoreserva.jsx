import React from 'react';
import { motion } from 'framer-motion';

const ReservaSection = () => {
  return (
    <section id="reserva" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">Funcionamiento de la Reserva</h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-6">
            <p>
              Aquí te explicamos cómo puedes reservar tu camiseta de forma sencilla y rápida. 
              El precio de cada camiseta es de <span className="font-bold text-green-600">18 euros</span>.
            </p>
            <ol className="list-decimal pl-8 space-y-4">
              <li>Escoge la imagen del diseño que te gusta y rellena la información requerida.</li>
              <li>Dale a "Generar Mensaje" y al botón de "Entrar al Grupo".</li>
              <li>Dentro del grupo, pega el mensaje generado y nosotros te añadiremos a la lista.</li>
              <li>
                Una vez hayas realizado el pago, avisa en el grupo, y cuando lo confirmemos, 
                te marcaremos como pagado.
              </li>
            </ol>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="my-8 md:my-12"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">Información de Pago</h3>
            <div className="text-lg text-gray-700 leading-relaxed space-y-6">
              <p>
                <strong>Para personas locales:</strong> Si vives en El Vendrell (43700) o pueblos cercanos 
                como Torredembarra o Calafell, realiza un Bizum por el coste total de 
                <span className="font-bold text-green-600"> 18 euros</span>.
              </p>
              <p>
                <strong>Para personas de fuera:</strong> Si estás en un box que promociona la camiseta, 
                escribe el nombre del box en el formulario para que podamos enviar todas las camisetas juntas 
                desde Wallapop. Esto hará que el envío sea más económico.
              </p>
              <p>
                Si eres una persona particular que ha visto el anuncio, escribe tu dirección en el formulario 
                y realiza un Bizum de <span className="font-bold text-green-600">17 euros</span>. Cuando tengamos las camisetas, 
                crearemos un producto en Wallapop de <span className="font-bold text-green-600">1 euro</span> para gestionar el envío.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservaSection;
