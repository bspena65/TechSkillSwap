import React, { useState, useEffect, useRef } from 'react';
import Image from '../atoms/Image'; 
import Image1 from '../../assets/homeImage1.png';
import Image2 from '../../assets/programee.png';
// import Image3 from '../../assets/homeImage.png';
import Image4 from '../../assets/image.png';

const images = [Image1, Image2,Image4];

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // @ts-ignore
  const intervalRef = useRef<NodeJS.Timeout | null>(null); 

  // Función para iniciar el intervalo
  const startAutoPlay = () => {
    stopAutoPlay(); 
    intervalRef.current = setInterval(() => {
      handleNextClick();
    }, 3000);
  };

  // Función para detener el intervalo
  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Cambiar automáticamente de imagen cada 3 segundos
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay(); 
  }, [currentIndex]);

  // Cambiar a la siguiente imagen
  const handleNextClick = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Cambiar a una imagen específica cuando se haga clic en un indicador
  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
    startAutoPlay(); // Reiniciar el autoplay al cambiar de imagen manualmente
  };

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="rounded-lg shadow-lg max-h-[580px] w-full"

        />
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => handleIndicatorClick(index)} 
            className={`h-4 w-4 rounded-full mx-2 cursor-pointer transition-colors ${
              index === currentIndex ? 'bg-zinc-200' : 'bg-gray-400'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
