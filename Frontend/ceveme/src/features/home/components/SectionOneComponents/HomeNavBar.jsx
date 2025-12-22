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

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 bg-[var(--color-ivorylight)] shadow-lg h-16 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-full">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] flex items-center justify-center">
              <span className="text-[var(--color-basewhite)] font-bold text-lg">
                C
              </span>
            </div>
            <span className="text-2xl font-bold text-[var(--color-slatedark)]">
              CeVeMe
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/info"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold"
            >
              Info
            </Link>
            <Link
              to="/demo"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold"
            >
              Demo
            </Link>
            <Link
              to="/contact"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to={"/auth/login"}>
              <button className="border-2 border-[var(--color-bookcloth)] text-[var(--color-slatedark)] px-4 py-2 rounded-xl transition-colors duration-200 hover:bg-gray-200">
                Sign in
              </button>
            </Link>
            <Link to={"/auth/register"}>
              <button className="bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] px-4 py-2 rounded-xl hover:bg-[var(--color-kraft)] transition-colors duration-200">
                Sign up
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
                Sign in
              </button>
            </Link>
            <Link to={"/auth/register"}>
              <button className="bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] px-4 py-2 rounded-xl hover:bg-[var(--color-kraft)] transition-colors duration-200">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default HomeNavBar;
