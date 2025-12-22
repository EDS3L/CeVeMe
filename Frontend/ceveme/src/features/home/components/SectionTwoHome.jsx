import React from "react";
import SwiperTwo from "../components/SectionTwoComponents/SwiperTwo";

function SectionTwoHome() {
  return (
    <div className="min-h-screen w-full flex-2 bg-gradient-to-b from-ivorydark via-ivorymedium to-ivorylight overflow-hidden">
      <div className="flex flex-col justify-center items-center pt-12 px-4 text-center w-full max-w-full">
        <h3 className="font-normal text-3xl md:text-5xl break-words max-w-full">
          CeVeMe to coś więcej niż strona z ofertami pracy
        </h3>
        <p className="pt-2">Generujemy </p>
        <p>awfawfawf</p>
      </div>
      <div className="w-full overflow-hidden">
        <SwiperTwo />
      </div>
    </div>
  );
}
export default SectionTwoHome;
//
