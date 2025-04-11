import React from "react";

import Footer from "../organisms/Footer";
import HeaderHome from "../organisms/HeaderHome";
import ImageCarousel from "../organisms/ImageCarousel";

const HomeTemplate: React.FC = () => {
  return (
    <div className=" animate__animated animate__fadeIn animate__faster">
      <HeaderHome />
      <main className="">
        <ImageCarousel />
      </main>
      <Footer />
    </div>
  );
};

export default HomeTemplate;
