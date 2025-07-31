import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Zamknij dropdown gdy klikniesz gdzie indziej
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[var(--color-ivorylight)] shadow-lg h-16">
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
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] flex items-center justify-center">
                  <span className="text-[var(--color-basewhite)] font-bold text-sm">
                    U
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-basewhite)] rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-[var(--color-slatedark)] hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Ustawienia
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center px-4 py-2 text-[var(--color-slatedark)] hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Ulubione
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    className="flex items-center w-full px-4 py-2 text-[var(--color-kraft)] hover:bg-red-50 transition-colors duration-200"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      // Tutaj dodaj logikę wylogowania
                      console.log('Wylogowywanie...');
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Wyloguj
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[var(--color-ivorylight)] shadow-lg z-50 md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/info"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Info
            </Link>
            <Link
              to="/demo"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              to="/contact"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <hr className="border-gray-300" />
            <Link
              to="/settings"
              className="flex items-center text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Ustawienia
            </Link>
            <Link
              to="/favorites"
              className="flex items-center text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Ulubione
            </Link>
            <button
              className="flex items-center text-[var(--color-kraft)] hover:text-red-600 transition-colors duration-200 py-2"
              onClick={() => {
                setIsMenuOpen(false);
                // Tutaj dodaj logikę wylogowania
                console.log('Wylogowywanie...');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Wyloguj
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
