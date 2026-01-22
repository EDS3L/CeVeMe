import React, { useState, useEffect, useRef } from "react";
import OrbitCard from "./OrbitCard";

export default function OrbitingIcon({
  iconData,
  ellipseRadii,
  isPaused,
  onMouseEnter,
  onMouseLeave,
  isOpen,
  onIconClick,
}) {
  const [angle, setAngle] = useState(iconData.initialAngle);
  const animationFrameId = useRef();
  const timeoutRef = useRef();
  const loopSpeed = 0.05;

  useEffect(() => {
    if (!isPaused) {
      const animate = () => {
        setAngle((prevAngle) => (prevAngle + loopSpeed) % 360);
        animationFrameId.current = requestAnimationFrame(animate);
      };
      animationFrameId.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    if (isOpen) {
      timeoutRef.current = setTimeout(() => {
        onIconClick(null);
      }, 4000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, onIconClick]);

  const x = ellipseRadii.x * Math.cos((angle * Math.PI) / 180);
  const y = ellipseRadii.y * Math.sin((angle * Math.PI) / 180);

  // czy ikona jest w górnej części orbity
  const isOnTop = y < 0;

  return (
    <div
      className="absolute flex flex-col items-center justify-center transition-transform duration-100 ease-linear group"
      style={{
        top: "50%",
        left: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      onMouseEnter={() => onMouseEnter(iconData.id)}
      onMouseLeave={onMouseLeave}
    >
      {isOpen ? (
        <div
          className={`absolute left-1/2 z-[100] -translate-x-1/2 
      ${isOnTop ? "bottom-full mb-2" : "top-full -mt-2"}`}
        >
          <OrbitCard description={iconData.description} />
        </div>
      ) : (
        <div
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-gradient-to-br from-white to-ivorylight border-2 border-kraft/20 rounded-full relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-kraft/30 hover:scale-125 hover:cursor-pointer hover:border-kraft/50 group"
          onClick={() => onIconClick(iconData.id)}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-kraft/0 to-kraft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span
            className={`text-xl sm:text-2xl md:text-4xl font-bold ${iconData.letterColor} relative z-10 group-hover:scale-110 transition-transform duration-300`}
          >
            {iconData.letter}
          </span>
        </div>
      )}
    </div>
  );
}
