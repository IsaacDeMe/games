import React, { useState } from 'react';

const DonacionesPage = () => {
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value).toFixed(2));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">Apóyame con una donación</h1>
        <p className="text-lg">
          Gracias por tu interés en apoyarme. ¡Cada céntimo cuenta!
        </p>
        <div className="mt-4">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Video de presentación"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex flex-col items-center space-y-4 mt-8">
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="3"
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
              className="w-full"
            />
            <span className="text-lg font-semibold">{amount}€</span>
          </div>
          <a
            href={`https://revolut.me/sergio91e/${amount}eur`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Donar {amount}€
          </a>
        </div>
        <div className="mt-6">
          <a
            href="https://revolut.me/sergio91e/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Introducir cantidad personalizada
          </a>
        </div>
      </div>
    </div>
  );
};

export default DonacionesPage;
