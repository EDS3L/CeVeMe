import React, { useState, useEffect, useRef } from 'react';
import OrbitCard from './OrbitCard';

const letters = [
  { letter: 'C', color: '#F472B6' },
  { letter: 'E', color: '#FBBF24' },
  { letter: 'V', color: '#60A5FA' },
  { letter: 'E', color: '#F87171' },
  { letter: 'M', color: '#22D3EE' },
  { letter: 'E', color: '#A78BFA' },
];

const orbitingIconsData = [
  {
    id: 1,
    letter: letters[0].letter,
    letterColor: letters[0].color,
    initialAngle: 60,
    color: 'rgb(204, 120, 92)',
  },
  {
    id: 2,
    letter: letters[1].letter,
    letterColor: letters[1].color,
    initialAngle: 120,
    color: 'rgb(212, 162, 127)',
  },
  {
    id: 3,
    letter: letters[2].letter,
    letterColor: letters[2].color,
    initialAngle: 180,
    color: 'rgb(97, 170, 242)',
  },
  {
    id: 4,
    letter: letters[3].letter,
    letterColor: letters[3].color,
    initialAngle: 240,
    color: 'rgb(191, 77, 67)',
  },
  {
    id: 5,
    letter: letters[4].letter,
    letterColor: letters[4].color,
    initialAngle: 300,
    color: 'rgb(97, 170, 242)',
  },
  {
    id: 6,
    letter: letters[5].letter,
    letterColor: letters[5].color,
    initialAngle: 360,
    color: 'rgb(97, 170, 242)',
  },
];

const OrbitingIcon = ({
  iconData,
  ellipseRadii,
  isPaused,
  onMouseEnter,
  onMouseLeave,
  hoveredIconId,
}) => {
  const [angle, setAngle] = useState(iconData.initialAngle);
  const animationFrameId = useRef();

  useEffect(() => {
    if (!isPaused) {
      const animate = () => {
        setAngle((prevAngle) => (prevAngle + 0.05) % 360);
        animationFrameId.current = requestAnimationFrame(animate);
      };
      animationFrameId.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isPaused]);

  const x = ellipseRadii.x * Math.cos((angle * Math.PI) / 180);
  const y = ellipseRadii.y * Math.sin((angle * Math.PI) / 180);

  return (
    <div
      className="absolute flex flex-col items-center justify-center transition-transform duration-100 ease-linear group"
      onMouseEnter={() => onMouseEnter(iconData.id)}
      onMouseLeave={onMouseLeave}
      style={{
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <div
        className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center relative z-10"
        style={{
          boxShadow: `0 0 20px 5px ${iconData.color}`,
        }}
      >
        <span
          className="text-2xl md:text-3xl font-bold"
          style={{ color: iconData.letterColor }}
        >
          {iconData.letter}
        </span>
      </div>

      {hoveredIconId === iconData.id && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-full z-[100]">
          <OrbitCard
            title={`Litera ${iconData.letter}`}
            description={`Szczegóły dla litery ${iconData.letter}.`}
          />
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [ellipseRadii, setEllipseRadii] = useState({ x: 250, y: 125 });
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIconId, setHoveredIconId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEllipseRadii({
          x: window.innerWidth * 0.4,
          y: window.innerWidth * 0.2,
        });
      } else if (window.innerWidth < 1024) {
        setEllipseRadii({ x: 300, y: 150 });
      } else {
        setEllipseRadii({ x: 400, y: 200 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = (id) => {
    setIsPaused(true);
    setHoveredIconId(id);
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
    setHoveredIconId(null);
  };

  return (
    <div className="font-sans bg-white flex flex-col items-center justify-center w-screen h-screen">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${ellipseRadii.x * 2 + 100}px`,
          height: `${ellipseRadii.y * 2 + 250}px`,
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cloudmedium/50 rounded-[50%]"
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
            hoveredIconId={hoveredIconId}
          />
        ))}
      </div>
    </div>
  );
}
