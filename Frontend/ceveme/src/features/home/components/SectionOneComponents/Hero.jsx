import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-manilla to-ivorydark flex flex-col justify-center items-center font-sans relative overflow-hidden">
      {/* Background shape */}
      <div
        className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[90%] md:w-7/10 h-8/10 bg-ivorydark rounded-full opacity-30"
        style={{ clipPath: "ellipse(50% 50% at 50% 50%)" }}
      ></div>
      <div className="relative z-10 text-center px-4 w-full max-w-full overflow-hidden">
        <p className="text-gray-600 mb-6">Czym jest CeVeMe?</p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal leading-tight max-w-4xl mx-auto break-words">
          Profesjonalne CV do każdej oferty <br className="hidden md:inline" />
          za pomocą AI
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-700 max-w-2xl mx-auto px-2">
          Celne dopasowanie do ATS oraz wymagań rekrutera. Indywidualne CV do
          ofert pracy w zaledwie kilka chwil
        </p>
        <Link to={"/auth/register"}>
          <button className="mt-8 md:mt-12 px-8 py-3 bg-black cursor-pointer text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
            Dołącz do nas
          </button>
        </Link>
        <p className="pt-2">
          Masz już konto?{" "}
          <Link to={"/auth/login"}>
            <button className="hover:text-amber-700 font-bold cursor-pointer">
              Zaloguj się
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Hero;
