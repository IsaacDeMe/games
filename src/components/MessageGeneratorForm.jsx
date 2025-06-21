import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';

const galleryImages = [
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/205fd6e48db4cdffc704e6eb8e61bc2f.png',
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/64be2c31d725ca01a0494ce8587bddbd.jpg',
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/f40a46bb34dab59dbe71d5eeaaf661d6.jpg',
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/d626d5ed220fb8bbcda5b5c312d9da48.png',
];

const imageDetails = [
  { design: "Diseño formal", color: "Blanco" },
  { design: "Diseño formal", color: "Negro" },
  { design: "Oso", color: "Blanco" },
  { design: "Oso", color: "Negro" }
];

const ImageGallery = ({ currentImageIndex, setCurrentImageIndex }) => {
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  const nextImage = () => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg shadow-lg">
        <img
          src={galleryImages[currentImageIndex]}
          alt={`Camiseta ${imageDetails[currentImageIndex].design} - Color ${imageDetails[currentImageIndex].color}`}
          className="w-full h-auto object-contain bg-gray-100"
        />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" size="icon" onClick={prevImage} className="bg-black text-white">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button variant="outline" size="icon" onClick={nextImage} className="bg-black text-white">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

const MessageGeneratorForm = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(imageDetails[0].design);
  const [selectedColor, setSelectedColor] = useState(imageDetails[0].color);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setSelectedDesign(imageDetails[currentImageIndex].design);
    setSelectedColor(imageDetails[currentImageIndex].color);
  }, [currentImageIndex]);

  const handleAction = () => {
    if (!name || !selectedSize || !location) {
      toast({
        title: "Error",
        description: "Por favor, completa Nombre, Talla y De dónde eres.",
        variant: "destructive",
      });
      return;
    }

    const message = `Nombre: ${name}\nTalla: ${selectedSize}\nDiseño: ${selectedDesign}\nColor: ${selectedColor}\nDe donde soy: ${location}`;
    setGeneratedMessage(message);

    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: "Mensaje copiado",
        description: "Se ha copiado al portapapeles.",
      });
      window.open('https://chat.whatsapp.com/H4LktNrJ1em1wXutlVQNpq', '_blank');
    }).catch(() => {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el mensaje.",
        variant: "destructive",
      });
    });
  };

  return (
    <>
      <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
        <h3 className="text-2xl font-bold mb-6 text-center">Galería de Diseños</h3>
        <h3 className="text-2xl font-bold mb-6 text-center text-green-600">PVP 18€</h3>
        <ImageGallery currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
      </div>

      <div className="w-full lg:w-2/5 space-y-6">
        <h3 className="text-2xl font-bold">Formulario</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" />
          </div>

          <div>
            <Label htmlFor="size">Talla</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una talla" />
              </SelectTrigger>
              <SelectContent>
                {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"].map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Diseño Seleccionado</Label>
            <Input value={selectedDesign} readOnly className="bg-gray-100 cursor-not-allowed" />
          </div>

          <div>
            <Label>Color</Label>
            <Input value={selectedColor} readOnly className="bg-gray-100 cursor-not-allowed" />
          </div>

          <div>
            <Label>¿De dónde eres?</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: El Vendrell, Barcelona..." />
          </div>

          <Button 
            onClick={handleAction}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg flex items-center justify-center gap-2"
          >
            Copiar mensaje y entrar al grupo
            <Copy className="w-4 h-4" />
            <ExternalLink className="w-4 h-4" />
          </Button>

          <p className="text-sm text-gray-600 mt-2 text-center">
            Después de rellenar la info, entra al grupo y pega lo que se te copiará en el portapapeles.
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageGeneratorForm;
