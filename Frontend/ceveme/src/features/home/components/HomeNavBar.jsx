import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomeNavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={
        ('fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-soft'
          : 'bg-transparent')
      }
    >
      <div className="flex items-center justify-between h-16 bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center"></div>
          <span className="text-2xl font-bold  text-bookcloth">CeVeMe</span>
          <span className="p-2 text-lg text-slatemedium">Info</span>
          <span className="p-2 text-lg text-slatemedium">Demo</span>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button className="border-2 border-bookcloth p-2 rounded-2xl">
            Sign in
          </button>
          <button className="bg-bookcloth text-white p-2 rounded-2xl">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}

export default HomeNavBar;
