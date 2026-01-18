import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomeNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > window.innerHeight && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < window.innerHeight) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // 100px offset for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl shadow-lg border-b border-white/20 h-20 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-full">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kraft to-bookcloth flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slatedark to-kraft bg-clip-text text-transparent">
              CeVeMe
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("info")}
              className="text-slatedark/80 hover:text-kraft transition-colors duration-200 font-semibold hover:scale-105 transform cursor-pointer"
            >
              Info
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-slatedark/80 hover:text-kraft transition-colors duration-200 font-semibold hover:scale-105 transform cursor-pointer"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-slatedark/80 hover:text-kraft transition-colors duration-200 font-semibold hover:scale-105 transform cursor-pointer"
            >
              Contact
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to={"/auth/login"}>
              <button className="border-2 border-kraft/40 text-slatedark px-6 py-2.5 rounded-xl transition-all duration-300 hover:border-kraft hover:bg-kraft/10 font-semibold hover:scale-105 transform">
                Zaloguj
              </button>
            </Link>
            <Link to={"/auth/register"}>
              <button className="bg-gradient-to-r from-kraft to-bookcloth text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 transform">
                Zarejestruj
              </button>
            </Link>
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[var(--color-slatedark)] hover:text-[var(--color-slatelight)] transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[var(--color-ivorylight)] shadow-lg z-50">
          <div className="flex items-center py-4 justify-around">
            <Link to={"/auth/login"}>
              <button className="border-2 border-[var(--color-bookcloth)] text-[var(--color-slatedark)] px-4 py-2 rounded-xl transition-colors duration-200">
                Zaloguj
              </button>
            </Link>
            <Link to={"/auth/register"}>
              <button className="bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] px-4 py-2 rounded-xl hover:bg-[var(--color-kraft)] transition-colors duration-200">
                Zarejestruj
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default HomeNavBar;
