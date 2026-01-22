import React, { useState, useEffect } from "react";
import OrbitingIcon from "./OrbitingIcon";

// Dane dla liter
const orbitingIconsData = [
  {
    id: 1,
    letter: "C",
    letterColor: "text-pink-400",
    initialAngle: 60,
    description: "Celne dopasowanie CV do każdej oferty pracy",
  },
  {
    id: 2,
    letter: "e",
    letterColor: "text-amber-400",
    initialAngle: 120,
    description:
      "Efektywne wykorzystanie słów kluczowych zwiększających widoczność kandydata",
  },
  {
    id: 3,
    letter: "V",
    letterColor: "text-blue-400",
    initialAngle: 180,
    description:
      "Value – dodawanie realnej wartości Twojej aplikacji w oczach rekrutera",
  },
  {
    id: 4,
    letter: "e",
    letterColor: "text-red-400",
    initialAngle: 240,
    description: "Eliminacja błędów i niedopasowań w dokumentach aplikacyjnych",
  },
  {
    id: 5,
    letter: "M",
    letterColor: "text-cyan-400",
    initialAngle: 300,
    description:
      "Maksymalizacja szans na zaproszenie na rozmowę kwalifikacyjną",
  },
  {
    id: 6,
    letter: "e",
    letterColor: "text-violet-400",
    initialAngle: 360,
    description: "Ekspresowe tworzenie spersonalizowanych CV w kilka minut",
  },
];

export default function App() {
  const [ellipseRadii, setEllipseRadii] = useState({ x: 400, y: 200 });
  const [isPaused, setIsPaused] = useState(false);
  const [openCardId, setOpenCardId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Małe telefony - znacznie zmniejszone
        setEllipseRadii({
          x: Math.min(window.innerWidth * 0.35, 140),
          y: Math.min(window.innerWidth * 0.175, 70),
        });
      } else if (window.innerWidth < 768) {
        // Średnie telefony
        setEllipseRadii({
          x: Math.min(window.innerWidth * 0.38, 180),
          y: Math.min(window.innerWidth * 0.19, 90),
        });
      } else if (window.innerWidth < 1024) {
        // Tablety
        setEllipseRadii({ x: 300, y: 150 });
      } else {
        // Desktop
        setEllipseRadii({ x: 400, y: 200 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Jeśli kliknięta ikona jest już otwarta, zamknij ją
  const handleIconClick = (id) => {
    if (openCardId === id) {
      setOpenCardId(null);
    } else {
      setOpenCardId(id);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center w-full min-h-[500px] sm:min-h-[600px] md:h-screen py-8">
      <div
        className="relative flex items-center justify-center mx-auto"
        style={{
          width: `${Math.min(ellipseRadii.x * 2 + 100, window.innerWidth - 40)}px`,
          height: `${ellipseRadii.y * 2 + 250}px`,
          maxWidth: "100%",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-kraft/30 rounded-[50%] shadow-lg shadow-kraft/10"
          style={{
            width: `${ellipseRadii.x * 2}px`,
            height: `${ellipseRadii.y * 2}px`,
          }}
        ></div>

        {orbitingIconsData.map((iconData) => (
          <OrbitingIcon
            key={iconData.id}
            iconData={iconData}
            ellipseRadii={ellipseRadii}
            isPaused={isPaused}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isOpen={openCardId === iconData.id}
            onIconClick={handleIconClick}
          />
        ))}
      </div>
    </div>
  );
}
