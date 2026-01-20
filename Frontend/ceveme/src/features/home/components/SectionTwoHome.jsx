import React from "react";
import SwiperTwo from "../components/SectionTwoComponents/SwiperTwo";
import { Brain, Target, Download, Sparkles } from "lucide-react";

function SectionTwoHome() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Inteligentna Analiza AI",
      description:
        "Nasza zaawansowana sztuczna inteligencja analizuje każdą ofertę pracy i dopasowuje Twoje doświadczenie do wymagań rekrutera.",
      color: "from-kraft to-bookcloth",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Dopasowanie do ATS",
      description:
        "Generujemy CV optymalizowane pod systemy ATS, zwiększając Twoje szanse na przejście pierwszej selekcji o 95%.",
      color: "from-bookcloth to-kraft",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Eksport w sekundach",
      description:
        "Pobierz gotowe CV w formacie PDF lub DOCX, gotowe do wysłania. Profesjonalny wygląd gwarantowany.",
      color: "from-kraft to-manilla",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Nieograniczone Warianty",
      description:
        "Twórz nielimitowaną liczbę wersji CV dostosowanych do różnych ofert i branż. Jedna aplikacja, nieskooczone możliwości.",
      color: "from-manilla to-kraft",
    },
  ];

  return (
    <div
      id="about"
      className="min-h-screen w-full bg-gradient-to-b from-ivorylight via-ivorymedium to-ivorydark overflow-hidden py-16"
    >
      <div className="flex flex-col justify-center items-center px-4 text-center w-full max-w-full mb-12">
        {/* Section Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-kraft/10 backdrop-blur-sm rounded-full border border-kraft/20">
          <Sparkles className="w-4 h-4 text-kraft" />
          <span className="text-sm font-semibold text-slatedark">
            Co oferujemy
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl break-words max-w-4xl mb-4">
          <span className="bg-gradient-to-r from-slatedark to-kraft bg-clip-text text-transparent">
            CeVeMe to coś więcej
          </span>
          <br />
          <span className="text-slatedark">niż strona z ofertami pracy</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-clouddark max-w-3xl mt-4">
          Kompleksowe narzędzie do zarządzania karierą zawodową z inteligentnym
          generatorem CV
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-kraft/10 hover:shadow-2xl hover:border-kraft/30 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              ></div>

              {/* Icon */}
              <div
                className={`relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-slatedark mb-3">
                  {feature.title}
                </h3>
                <p className="text-clouddark leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swiper Section */}
      <div className="w-full overflow-hidden">
        <SwiperTwo />
      </div>
    </div>
  );
}
export default SectionTwoHome;
