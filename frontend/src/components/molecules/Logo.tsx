import React from "react";
import Image from "../atoms/Image";
import LogoMain from "../../assets/LogoPng.png";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 md:pl-[245px] pl-auto">
      <Image src={LogoMain} alt="TechSkillSwap Logo" className="h-24 w-24" />
    </div>
  );
};

export default Logo;
