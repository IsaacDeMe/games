import React from 'react';
import { motion } from 'framer-motion';

const FuncionamientoSection = () => {
  const steps = [
    {
      number: 1,
      title: "Reserva",
      description: "Reserva tu camiseta iniciando sesión y proporcionando toda la información necesaria."
    },
    {
      number: 2,
      title: "Notificación",
      description: "Te avisaremos por correo/mensaje cuando se pueda empezar a pagar por Bizum."
    },
    {
      number: 3,
      title: "Pago",
      description: "Una vez pagado, tu reserva pasará de \"provisional\" a \"pagada\" en tu perfil."
    },
    {
      number: 4,
      title: "Entrega",
      description: "Recoge en El Vendrell (43700) o envío por Wallapop al mejor precio."
    }
  ];

  return (
    <section id="funcionamiento" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Funcionamiento de la Reserva</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 bg-gray-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-center">Información Importante</h3>
          <p className="text-gray-700 text-center max-w-4xl mx-auto">
            Todo el tema del pago se hablará por WhatsApp. La web es para una gestión más fácil de los datos. 
            Puedes venir a buscar tu camiseta al Vendrell (43700) hablando con nosotros sobre el punto de quedada, 
            o crear un producto de Wallapop para que te salga el envío lo más barato posible.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FuncionamientoSection;