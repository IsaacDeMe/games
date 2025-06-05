// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const designImages = {
  'Diseño 1': [
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/9c39bd9c3d8857537d607297e8645a08.png',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/56541f1fab5601fe09b71a7eb0580b2a.png'
  ],
  'Diseño 2': [
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/0d0177ba98d1dbe65e47d20a1259ba43.png',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/f4c1b898109ff88ccb77f932577a4f9b.png'
  ]
};

const ImageGallery = ({ selectedDesign, onDesignChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImages = selectedDesign
    ? designImages[selectedDesign]
    : designImages['Diseño 1'];

  const prevImage = () => {
    const newIndex =
      currentIndex === 0 ? currentImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    if (newIndex === 0) {
      onDesignChange(
        selectedDesign === 'Diseño 1' ? 'Diseño 2' : 'Diseño 1'
      );
    }
  };

  const nextImage = () => {
    const newIndex =
      currentIndex === currentImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    if (newIndex === 0) {
      onDesignChange(
        selectedDesign === 'Diseño 1' ? 'Diseño 2' : 'Diseño 1'
      );
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg shadow-lg mx-auto">
        <img
          src={currentImages[currentIndex]}
          alt={`Camiseta ${selectedDesign} - Vista ${currentIndex + 1}`}
          className="w-[400px] mx-auto h-auto object-contain bg-gray-100"
        />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevImage}
          className="bg-black text-white hover:bg-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextImage}
          className="bg-black text-white hover:bg-gray-800"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

const ProductForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedDesign, setSelectedDesign] = useState('Diseño 1');
  const [selectedSize, setSelectedSize] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mejorar la detección de login
  useEffect(() => {
    setIsLoggedIn(!!user && !!user.email); // si hay usuario y email, está logueado
  }, [user]);

  const handleReservation = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      window.scrollTo(0, 0);
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Error",
        description: "Por favor selecciona una talla",
        variant: "destructive",
      });
      return;
    }

    if (!pickupPoint) {
      toast({
        title: "Error",
        description: "Por favor selecciona el punto de recogida",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      email_user: user.email,
      phone_user: user.phoneNumber || '',
      full_name_camisetas: user.fullName || user.email,
      design: selectedDesign,
      talla: selectedSize,
      punto_recojida: pickupPoint,
      estate: 'reserva provisional',
    };

    const { error } = await supabase
      .from('camisetas')
      .insert([payload]);

    if (error) {
      toast({
        title: "Error al Reservar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reserva Registrada",
      description: "Tu reserva ha sido creada correctamente.",
    });

    setSelectedSize('');
    setPickupPoint('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
        <h3 className="text-2xl font-bold mb-6 text-center">Galería de Diseños</h3>
        <ImageGallery
          selectedDesign={selectedDesign}
          onDesignChange={setSelectedDesign}
        />
      </div>

      <div className="w-full lg:w-2/5 space-y-6">
        <h3 className="text-2xl font-bold">Hacer Reserva</h3>

        <div className="space-y-6">
          <div>
            <Label className="block text-sm font-medium mb-2">Diseño</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedDesign === 'Diseño 1' ? "default" : "outline"}
                onClick={() => setSelectedDesign('Diseño 1')}
                className={`p-4 h-auto transition-all text-base ${
                  selectedDesign === 'Diseño 1'
                    ? 'bg-black text-white'
                    : 'border-gray-300 hover:border-black hover:bg-gray-50'
                }`}
              >
                Diseño 1
              </Button>
              <Button
                variant={selectedDesign === 'Diseño 2' ? "default" : "outline"}
                onClick={() => setSelectedDesign('Diseño 2')}
                className={`p-4 h-auto transition-all text-base ${
                  selectedDesign === 'Diseño 2'
                    ? 'bg-black text-white'
                    : 'border-gray-300 hover:border-black hover:bg-gray-50'
                }`}
              >
                Diseño 2
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="size" className="block text-sm font-medium mb-2">Talla</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Selecciona una talla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="XXL">XXL</SelectItem>
                <SelectItem value="3XL">3XL</SelectItem>
                <SelectItem value="4XL">4XL</SelectItem>
                <SelectItem value="5XL">5XL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pickupPoint" className="block text-sm font-medium mb-2">Punto de recogida</Label>
            <Select value={pickupPoint} onValueChange={setPickupPoint}>
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Selecciona un punto de recogida" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Crossfit Do-Box">Crossfit Do-Box</SelectItem>
                <SelectItem value="Crossfit Torredembarra">Crossfit Torredembarra</SelectItem>
                <SelectItem value="Wallapop">Wallapop</SelectItem>
              </SelectContent>
            </Select>
            {pickupPoint === 'Wallapop' && (
              <p className="mt-2 text-sm text-gray-600">
                Soy individual, nos pondremos en contacto contigo de inmediato para aclarar el producto de Wallapop.
              </p>
            )}
          </div>

          <Button
            onClick={handleReservation}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg flex items-center justify-center"
            size="lg"
          >
            {isLoggedIn ? 'Reservar Camiseta' : 'Iniciar Sesión para Reservar'}
            <ShoppingBag className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
