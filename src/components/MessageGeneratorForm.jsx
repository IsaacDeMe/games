import React, { useState, useEffect } from 'react';
import { Send, ChevronLeft, ChevronRight, ExternalLink, Copy } from 'lucide-react';
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
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/b10d0ca07d623e508ac41440292fcba4.png',
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/e52a0d99982c89b4fd38f1a3a0493f84.png',
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/600a85d2ea91b416610f2b85351ea5d4.png',
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/95184e37ed36a78a6055b8862d028ce3.png'
];

const imageDetails = [
  { design: "Diseño formal", color: "Blanco" },
  { design: "Diseño formal", color: "Negro" },
  { design: "Oso", color: "Blanco" },
  { design: "Oso", color: "Negro" }
];

const ImageGallery = ({ currentImageIndex, setCurrentImageIndex }) => {
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

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
        <Button
          variant="outline"
          size="icon"
          onClick={prevImage}
          className="bg-black text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextImage}
          className="bg-black text-white"
        >
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

  const handleGenerateMessage = () => {
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
    toast({
      title: "Mensaje Generado",
      description: "¡Ahora puedes copiar el mensaje y unirte al grupo!",
    });
  };

  const copyToClipboardAndOpenGroup = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage).then(() => {
        toast({
          title: "Copiado",
          description: "Mensaje copiado al portapapeles.",
        });
        window.open('https://chat.whatsapp.com/H4LktNrJ1em1wXutlVQNpq', '_blank');
      }).catch(err => {
        toast({
          title: "Error al copiar",
          description: "No se pudo copiar el mensaje. Por favor, cópialo manualmente.",
          variant: "destructive",
        });
        window.open('https://chat.whatsapp.com/H4LktNrJ1em1wXutlVQNpq', '_blank');
      });
    } else {
       toast({
          title: "Error",
          description: "Primero genera un mensaje.",
          variant: "destructive",
        });
    }
  };

  return (
    <>
      <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
        <h3 className="text-2xl font-bold mb-6 text-center">Galería de Diseños</h3>
        <ImageGallery currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
      </div>
      
      <div className="w-full lg:w-2/5 space-y-6">
        <h3 className="text-2xl font-bold">Mensaje para el grupo</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full p-3 h-10"
            />
          </div>

          <div>
            <Label htmlFor="size" className="block text-sm font-medium mb-1">Talla</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
             <SelectTrigger className="w-90 p-2 h-auto text-sm border rounded-md">

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
            <Label htmlFor="design" className="block text-sm font-medium mb-1">Diseño Seleccionado</Label>
            <Input
              id="design"
              type="text"
              value={selectedDesign}
              readOnly
              className="w-full p-3 bg-gray-100 cursor-not-allowed h-10"
            />
            <p className="text-xs text-gray-500 mt-1">(Pasa la imagen hasta el diseño que te gusta)</p>
          </div>

          <div>
            <Label htmlFor="color" className="block text-sm font-medium mb-1">Color de la camiseta</Label>
            <Input
              id="color"
              type="text"
              value={selectedColor}
              readOnly
              className="w-full p-3 bg-gray-100 cursor-not-allowed h-10"
            />
             <p className="text-xs text-gray-500 mt-1">(Pasa la imagen hasta el diseño que te gusta)</p>
          </div>
          
          <div>
            <Label htmlFor="location" className="block text-sm font-medium mb-1">¿Eres de aquí o de fuera? ¿De dónde?</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: El Vendrell, Barcelona, etc."
              className="w-full p-3 h-10"
            />
          </div>

          <Button 
            onClick={handleGenerateMessage}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg h-11"
            size="lg"
          >
            Generar Mensaje
            <Send className="ml-2 w-5 h-5" />
          </Button>

          {generatedMessage && (
            <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="text-md font-semibold mb-2">Mensaje Generado:</h4>
              <Textarea
                value={generatedMessage}
                readOnly
                rows={5}
                className="w-full p-2 border-gray-300 rounded-md focus:ring-0 focus:border-gray-300"
              />
            </div>
          )}
          
          <Button 
            onClick={copyToClipboardAndOpenGroup}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-5 text-lg h-13"
            size="lg"
            disabled={!generatedMessage}
          >
            Entrar al Grupo y Copiar Mensaje
            <Copy className="ml-2 w-4 h-4" />
            <ExternalLink className="ml-1 w-4 h-4" />
          </Button>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Genera el mensaje para enviarlo al grupo. Después dale a "Entrar al Grupo y Copiar Mensaje", pega el mensaje y envíalo. Nosotros te añadiremos a la lista. Después, cuando hayas realizado el Bizum al 642571133, avisa por el grupo y te pondremos el icono de pagado.
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageGeneratorForm;