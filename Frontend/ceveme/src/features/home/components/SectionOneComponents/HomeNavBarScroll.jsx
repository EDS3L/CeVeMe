import React, { useEffect, useState } from "react";

function HomeNavBarScroll() {
  const [showNavigation, setShowNavigation] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabs = [
    { name: "O nas", id: "about" },
    { name: "Funkcje", id: "features" },
    { name: "Opinie", id: "testimonials" },
    { name: "Kontakt", id: "contact" },
  ];

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Scroll spy - aktualizuj aktywną zakładkę na podstawie pozycji scroll
  const updateActiveSection = () => {
    const sections = tabs
      .map((tab) => ({
        id: tab.id,
        element: document.getElementById(tab.id),
      }))
      .filter((s) => s.element);

    const scrollPos = window.scrollY + 150;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.element.offsetTop <= scrollPos) {
        setActiveTab(section.id);
        break;
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setShowNavigation(currentScrollY > window.innerHeight);

      if (currentScrollY < window.innerHeight && currentScrollY < lastScrollY) {
        setIsVisible(false);
      } else if (
        currentScrollY >= window.innerHeight ||
        currentScrollY > lastScrollY
      ) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl shadow-lg border-b border-white/20 h-20 flex justify-center items-center transform transition-transform duration-300 ${
          showNavigation
            ? isVisible
              ? "translate-y-0"
              : "-translate-y-full"
            : "-translate-y-full"
        } `}
      >
        <div className="flex bg-white/20 backdrop-blur-md rounded-full p-1.5 border border-kraft/30 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300 transform cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-kraft to-bookcloth text-white shadow-lg scale-105"
                  : "text-slatedark/70 hover:text-kraft hover:bg-white/30 hover:scale-105"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export default HomeNavBarScroll;
