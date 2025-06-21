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
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">📝 Funcionamiento de la Reserva</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-800">
            <div className="p-6 border rounded-lg bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">1️⃣ Escoge tus preferencias</h3>
              <p>Selecciona diseño, color, talla y tu localidad</p>
            </div>
            <div className="p-6 border rounded-lg bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">2️⃣ Entra al grupo</h3>
              <p>📋 Se copiará tu mensaje automáticamente</p>
            </div>
            <div className="p-6 border rounded-lg bg-white shadow">
              <h3 className="text-xl font-semibold mb-2"> 3️⃣ Pega y envía</h3>
              <p>✉️ Pega el mensaje en el grupo y envíalo te añadimos a la lista</p>
            </div>
          </div>

          <div className="text-center mt-10 space-y-4">
            <p className="text-sm text-gray-600 mt-2">
              Al pagar, pon en la nota: <strong>tu nombre completo y número de teléfono</strong> con el que hiciste la reserva.
            </p>
            <p className="text-sm text-gray-700 mt-4">
              ⬇️ Lee el funcionamiento completo más abajo para saber cuánto pagar y cómo se gestiona el envío.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="my-12"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">💳 Información de Pago</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div className="p-6 border rounded-lg bg-white shadow text-center">
                <h4 className="text-lg font-bold mb-4">📍 Soy de El Vendrell o cerca</h4>
                <p className="mb-4">
                  💯 Abonarás el <strong>100%</strong> del coste ahora. Te dejaremos la camiseta en el box o hablaremos contigo para entregártela.
                </p>
                <p className="mb-4">💶 Debes pagar <strong>18€</strong> con el siguiente botón:</p>
                <a
                  href="https://revolut.me/sergioi91e/18eur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg shadow"
                >
                  Pagar 18€ (local)
                </a>
              </div>
              <div className="p-6 border rounded-lg bg-white shadow text-center">
                <h4 className="text-lg font-bold mb-4">🚚 Soy de fuera</h4>
                <p className="mb-4">
                  💸 Abonas casi todo ahora. Cuando tengamos tu camiseta te contactaremos para hacer el envío. Más info abajo.
                </p>
                <p className="mb-4">💶 Debes pagar <strong>16€</strong> con el siguiente botón:</p>
                <a
                  href="https://revolut.me/sergioi91e/16eur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow"
                >
                  Pagar 16€ (envío)
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 border rounded-lg bg-white shadow text-gray-700">
              <h4 className="text-lg font-bold mb-2">📦 Envío para personas de fuera</h4>
              <p>
                Cuando tengamos tu camiseta, te avisaremos personalmente. Te enviaremos un enlace a un producto de <strong>Wallapop (2€)</strong> para gestionar el envío.
              </p>
              <p className="mt-2">
                Si varias personas de tu box hacen pedido, pon el nombre del box como dirección de envío para un envío conjunto más económico.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservaSection;
