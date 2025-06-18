import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '@/components/Footer';

const DonacionesPage = () => {
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');

  const handleAmountChange = (e) => {
    if (!customAmount) {
      setAmount(Number(e.target.value).toFixed(2));
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const getFinalAmount = () => {
    return customAmount ? customAmount : amount;
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Video Section */}
          <div>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/watch?v=g-0hx_2UU4k"
              title="Video de presentación y agradecimientos"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Donation Section */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              Hola, me llamo <strong>Isaac</strong>, y quiero decirte que para mí contar con tu ayuda es crucial, y de verdad que te lo voy a agradecer. Cualquier donación es suficiente para ayudarme. 
              <br />
              <strong>No te pido que me dones ni un euro.</strong> La unión hace la fuerza, y con la ayuda de muchos, podré alcanzar mi meta. Muchas gracias de corazón.
            </p>

            {/* Range and Input */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.01"
                  value={customAmount ? 0 : amount}
                  onChange={handleAmountChange}
                  disabled={!!customAmount}
                  className="w-full accent-green-500"
                />
                <span className="text-lg font-semibold text-green-600">{customAmount || amount}€</span>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Cantidad personalizada (€)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button
                  onClick={() => setCustomAmount('')}
                  className="text-sm text-red-500 underline"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Donation Buttons */}
            <div className="space-y-4">
              <a
                href={`https://revolut.me/sergioi91e/${getFinalAmount()}eur`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition text-center"
              >
                Donar {getFinalAmount()}€
              </a>
              <a
                href="https://revolut.me/sergioi91e/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700 block text-center"
              >
                Introducir cantidad directamente en Revolut
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DonacionesPage;
