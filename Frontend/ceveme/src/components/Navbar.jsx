import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ChevronDown,
  Settings,
  Heart,
  LogOut,
  Menu as MenuIcon,
} from 'lucide-react';

function Navbar({ showShadow }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const isLogged = document.cookie.includes('jwt=');

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
      <nav
        className={` ${
          showShadow
            ? 'sticky top-0 shadow-lg  bg-ivorylight'
            : 'relative bg-gradient-to-b from-cloudlight to-ivorylight'
        }
    w-full z-[10000] h-16
  `}
      >
        <div className="flex items-center cursor-pointer justify-between px-6 md:px-12 h-full">
          <Link
            //wyświetla w zależności od logowania page
            to={isLogged ? '/offers' : '/'}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] flex items-center justify-center">
              <span className="text-[var(--color-basewhite)] font-bold text-lg">
                C
              </span>
            </div>
            <span className="text-2xl font-bold text-[var(--color-slatedark)]">
              CeVeMe
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/cv"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold"
            >
              CV
            </Link>
            <Link
              to="/offers"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold"
            >
              Oferty
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
                onClick={() => setIsUserDropdownOpen((v) => !v)}
                className="flex items-center gap-2 text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200"
                aria-haspopup="menu"
                aria-expanded={isUserDropdownOpen}
                aria-controls="user-menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] flex items-center justify-center">
                  <span className="text-[var(--color-basewhite)] font-bold text-sm">
                    U
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`transition-transform duration-200 ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isUserDropdownOpen && (
                <div
                  id="user-menu"
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-52 bg-[var(--color-basewhite)] rounded-lg shadow-lg border border-[var(--color-ivorydark)] py-2 z-[11000]"
                >
                  <Link
                    to="/settings"
                    role="menuitem"
                    className="flex items-center px-4 py-2 text-[var(--color-slatedark)] hover:bg-[var(--color-ivorymedium)]/60 transition-colors duration-200"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Settings size={20} strokeWidth={2} className="mr-3" />
                    Ustawienia
                  </Link>
                  <Link
                    to="/user"
                    role="menuitem"
                    className="flex items-center px-4 py-2 text-[var(--color-slatedark)] hover:bg-[var(--color-ivorymedium)]/60 transition-colors duration-200"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <User size={20} strokeWidth={2} className="mr-3" />
                    Profil
                  </Link>
                  <Link
                    to="/favorites"
                    role="menuitem"
                    className="flex items-center px-4 py-2 text-[var(--color-slatedark)] hover:bg-[var(--color-ivorymedium)]/60 transition-colors duration-200"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Heart size={20} strokeWidth={2} className="mr-3" />
                    Ulubione
                  </Link>
                  <hr className="my-2 border-[var(--color-ivorydark)]" />
                  <button
                    role="menuitem"
                    className="flex items-center w-full px-4 py-2 text-[var(--color-kraft)] hover:bg-[var(--color-manilla)]/40 transition-colors duration-200"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      document.cookie =
                        'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      localStorage.clear();
                      window.location.href = '/';
                    }}
                  >
                    <LogOut size={20} strokeWidth={2} className="mr-3" />
                    Wyloguj
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="text-[var(--color-slatedark)] hover:text-[var(--color-slatelight)] transition-colors duration-200"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <MenuIcon size={24} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed top-16 left-0 w-full bg-[var(--color-ivorylight)] shadow-lg z-[11000] md:hidden"
        >
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/info"
              className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              CV
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
            <hr className="border-[var(--color-ivorydark)]" />
            <Link
              to="/settings"
              className="flex items-center text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings size={20} strokeWidth={2} className="mr-3" />
              Ustawienia
            </Link>
            <Link
              to="/favorites"
              className="flex items-center text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart size={20} strokeWidth={2} className="mr-3" />
              Ulubione
            </Link>
            <button
              className="flex items-center text-[var(--color-kraft)] hover:text-red-600 transition-colors duration-200 py-2"
              onClick={() => {
                setIsMenuOpen(false);
                // TODO: wylogowanie
                console.log('Wylogowywanie...');
              }}
            >
              <LogOut size={20} strokeWidth={2} className="mr-3" />
              Wyloguj
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
