import React from 'react';
import SocialMediaLinks from '../molecules/SocialMediaLinks';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1f2126] text-white pt-8 pb-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Primera fila: dos enlaces */}
          <div className="flex flex-col gap-6">
            <p className="font-bold text-[16px] font-mulish hover:text-gray-300 cursor-pointer">
              Sobre nosotros
            </p>
            <p className="font-bold text-[16px] font-mulish hover:text-gray-300 cursor-pointer">
              Soporte
            </p>
          </div>

          {/* Segunda fila: dos enlaces */}
          <div className="flex flex-col gap-6">
            <p className="font-bold text-[16px] font-mulish hover:text-gray-300 cursor-pointer">
              Contacta con nosotros
            </p>
            <p className="font-bold text-[16px] font-mulish hover:text-gray-300 cursor-pointer">
              Novedades
            </p>
          </div>

          {/* Tercera fila: dos enlaces */}
          <div className="flex flex-col gap-6">
            <p className="font-bold text-[16px] font-mulish hover:text-gray-300 cursor-pointer">
              Privacidad y condiciones
            </p>
            <p className="font-bold text-[16px] font-mulish hover:text-gray-300 cursor-pointer">
              Política de privacidad
            </p>
          </div>

          {/* Redes sociales */}
          <div className="flex flex-col items-center gap-6">
            <p className="text-white text-[16px] font-bold uppercase">Redes Sociales</p>
            <SocialMediaLinks />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-end mt-4 px-5 text-gray-500">
        <p>TechSkillSwap © 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
