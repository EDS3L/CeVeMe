import React, { useState, useEffect } from 'react';

const OrbitCard = ({ title, description }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`max-w-xs bg-slatemedium rounded-lg shadow-lg overflow-hidden p-4 mt-2
        transition-all duration-300 ease-out
        ${
          isVisible ? 'opacity-100 translate-y-0 ' : 'opacity-0 translate-y-4'
        }`}
    >
      <h2 className="text-xl font-bold text-ivorylight mb-1">{title}</h2>
      <p className="text-cloudmedium text-sm mb-2">{description}</p>
    </div>
  );
};

export default OrbitCard;
