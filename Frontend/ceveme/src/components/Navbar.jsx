import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  ChevronDown,
  Settings,
  Heart,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import UseAuth from "../features/auth/hooks/UseAuth";
import { useAuthContext } from "../features/auth/context/useAuthContext";

function Navbar({ showShadow }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const nav = useNavigate();

  const auth = new UseAuth();
  const { user, logout } = useAuthContext();
  const isLogged = !!user;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={` ${
          showShadow
            ? "sticky top-0 shadow-lg  bg-ivorylight"
            : "relative bg-gradient-to-b from-cloudlight to-ivorylight"
        }
    w-full z-[10000] h-16
  `}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-full">
          <Link
            to={isLogged ? "/offers" : "/"}
            className="flex items-center space-x-3 cursor-pointer"
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
            {isLogged && (
              <>
                <Link
                  to="/cv2"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold"
                >
                  Kreator cv
                </Link>
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
                  to="/history"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold"
                >
                  Historia aplikacji
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center  space-x-4">
            {isLogged ? (
              <div className="relative user-dropdown ">
                <button
                  onClick={() => setIsUserDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200 cursor-pointer"
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
                      isUserDropdownOpen ? "rotate-180" : ""
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
                    <hr className="my-2 border-[var(--color-ivorydark)]" />
                    <button
                      role="menuitem"
                      className="flex items-center w-full px-4 py-2 text-[var(--color-kraft)] hover:bg-[var(--color-manilla)]/40 transition-colors duration-200"
                      onClick={() => {
                        auth.logout(nav);
                        logout();
                      }}
                    >
                      <LogOut size={20} strokeWidth={2} className="mr-3" />
                      Wyloguj
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] font-bold transition-colors duration-200"
                >
                  Zaloguj
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 bg-[var(--color-kraft)] text-[var(--color-basewhite)] rounded-lg hover:bg-[var(--color-manilla)] transition-colors duration-200 font-bold"
                >
                  Zarejestruj
                </Link>
              </div>
            )}
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
            {isLogged ? (
              <>
                <Link
                  to="/offers"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Oferty pracy
                </Link>
                <Link
                  to="/history"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Historia aplikacji
                </Link>
                <Link
                  to="/cv2"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nowy kreator CV
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
                  to="/user"
                  className="flex items-center text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} strokeWidth={2} className="mr-3" />
                  Profil
                </Link>
                <button
                  className="flex items-center text-[var(--color-kraft)] hover:text-red-600 transition-colors duration-200 py-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    auth.logout(nav);
                    logout();
                  }}
                >
                  <LogOut size={20} strokeWidth={2} className="mr-3" />
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors duration-200 font-bold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Strona główna
                </Link>
                <hr className="border-[var(--color-ivorydark)]" />
                <Link
                  to="/auth/login"
                  className="flex items-center text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200 py-2 font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Zaloguj
                </Link>
                <Link
                  to="/auth/register"
                  className="flex items-center text-[var(--color-kraft)] hover:text-[var(--color-manilla)] transition-colors duration-200 py-2 font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Zarejestruj
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
