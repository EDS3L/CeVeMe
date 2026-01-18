import React, { useState, useEffect } from "react";

export default function OrbitCard({ description }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`max-w-sm bg-gradient-to-br from-white to-ivorylight backdrop-blur-xl rounded-2xl shadow-2xl border border-kraft/20 p-6
        transition-all duration-300 ease-out transform
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
    >
      <p className="text-slatedark text-sm leading-relaxed whitespace-normal break-words font-medium">
        {description}
      </p>
    </div>
  );
}
