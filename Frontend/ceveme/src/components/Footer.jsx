import React from "react";
import { Link } from "react-router-dom";
import { Github, Mail, FileText, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-ivorylight)] border-t border-[var(--color-ivorydark)] pt-12 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] flex items-center justify-center">
                <span className="text-[var(--color-basewhite)] font-bold text-sm">
                  C
                </span>
              </div>
              <span className="text-xl font-bold text-[var(--color-slatedark)]">
                CeVeMe
              </span>
            </div>
            <p className="text-[var(--color-clouddark)] text-sm leading-relaxed">
              Twój asystent w poszukiwaniu pracy. Twórz CV, śledź aplikacje i
              znajduj oferty w jednym miejscu.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-slatedark)] mb-4">
              Produkt
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/offers"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  Oferty pracy
                </Link>
              </li>
              <li>
                <Link
                  to="/cv"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  Kreator CV
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  Historia aplikacji
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-slatedark)] mb-4">
              Firma
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  O nas
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-slatedark)] mb-4">
              Prawne
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="flex items-center text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  <Shield size={14} className="mr-2" /> Polityka Prywatności
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center text-[var(--color-clouddark)] hover:text-[var(--color-kraft)] text-sm transition-colors"
                >
                  <FileText size={14} className="mr-2" /> Regulamin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-[var(--color-ivorydark)] my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-[var(--color-clouddark)] text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CeVeMe. Wszelkie prawa
            zastrzeżone.
          </p>

          <div className="flex space-x-4">
            <a
              href="https://github.com/EDS3L/CeVeMe"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[var(--color-ivorymedium)] flex items-center justify-center text-[var(--color-slatedark)] hover:bg-[var(--color-kraft)] hover:text-white transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href="mailto:contact@ceveme.pl"
              className="w-10 h-10 rounded-full bg-[var(--color-ivorymedium)] flex items-center justify-center text-[var(--color-slatedark)] hover:bg-[var(--color-kraft)] hover:text-white transition-all duration-300"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
