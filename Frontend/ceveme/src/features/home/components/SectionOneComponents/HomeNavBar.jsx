import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

function HomeNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const updateActiveSection = useCallback(() => {
    const sections = ["about", "features", "testimonials", "contact"];
    const scrollPosition = window.scrollY + 250; // offset dla navbar

    // Znajdź aktywną sekcję od dołu do góry
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element) {
        const offsetTop = element.offsetTop;
        if (scrollPosition >= offsetTop) {
          setActiveSection(sections[i]);
          return;
        }
      }
    }
    setActiveSection("");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Widoczność navbar
      if (currentScrollY > 600 && currentScrollY > lastScrollY + 10) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 10 || currentScrollY < 100) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Scroll spy
      updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveSection(); // inicjalna aktualizacja

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, updateActiveSection]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const getLinkClass = (sectionId) => {
    const isActive = activeSection === sectionId;
    return `relative transition-all duration-300 font-semibold cursor-pointer px-1 py-2 ${
      isActive
        ? "text-kraft after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-kraft after:rounded-full"
        : "text-slatedark/70 hover:text-kraft"
    }`;
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
              onClick={() => scrollToSection("about")}
              className={getLinkClass("about")}
            >
              O nas
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className={getLinkClass("features")}
            >
              Funkcje
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className={getLinkClass("testimonials")}
            >
              Opinie
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={getLinkClass("contact")}
            >
              Kontakt
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
