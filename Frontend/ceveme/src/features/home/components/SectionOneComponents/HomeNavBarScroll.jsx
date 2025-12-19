import React, { useEffect, useState } from 'react';

function HomeNavBarScroll() {
  const [showNavigation, setShowNavigation] = useState(false);
  const [activeTab, setActiveTab] = useState('Info');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabs = [
    { name: 'Info', href: '/' },
    { name: 'Demo', href: '/' },
    { name: 'Contact', href: '/' },
  ];

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-lg shadow-lg h-16 flex justify-center items-center transform transition-transform duration-300 ${
          showNavigation
            ? isVisible
              ? 'translate-y-0'
              : '-translate-y-full'
            : '-translate-y-full'
        } `}
      >
        <div className="flex bg-kraft rounded-full p-1 border border-slatedark h-3/4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === tab.name
                  ? 'border border-bookcloth text-slatedark shadow-lg'
                  : 'text-clouddark hover:text-slatedark hover:bg-kraft'
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
