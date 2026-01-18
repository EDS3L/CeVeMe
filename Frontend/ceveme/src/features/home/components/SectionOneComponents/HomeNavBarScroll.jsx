import React, { useEffect, useState } from "react";

function HomeNavBarScroll() {
  const [showNavigation, setShowNavigation] = useState(false);
  const [activeTab, setActiveTab] = useState("Info");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabs = [
    { name: "Info", id: "info" },
    { name: "Demo", id: "demo" },
    { name: "Contact", id: "contact" },
  ];

  const scrollToSection = (sectionId, tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // 100px offset for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
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
              key={tab.name}
              onClick={() => scrollToSection(tab.id, tab.name)}
              className={`px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300 transform cursor-pointer ${
                activeTab === tab.name
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
