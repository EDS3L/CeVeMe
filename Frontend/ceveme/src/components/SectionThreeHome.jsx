import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Link as LinkIcon, CheckCircle } from "lucide-react";

const SectionThreeHome = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-ivorylight to-cloudlight">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-ivorymedium)]/30 border border-[var(--color-ivorydark)]">
              <LinkIcon size={16} className="text-[var(--color-kraft)] mr-2" />
              <span className="text-sm font-semibold text-[var(--color-slatedark)]">
                Inteligentne linkowanie
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-slatedark)] leading-tight">
              U nas znajdziesz linki do{" "}
              <span className="text-[var(--color-kraft)]">
                najpopularniejszych
              </span>{" "}
              ofert pracy.
            </h2>

            <p className="text-lg text-[var(--color-clouddark)] leading-relaxed">
              Generuj linki bez problemu. Nasz system automatycznie wyszukuje i
              kategoryzuje oferty z wiodących portali, oszczędzając Twój czas.
            </p>

            <div className="space-y-4">
              {[
                "Automatyczna agregacja ofert",
                "Bezpośrednie linki do aplikacji",
                "Śledzenie statusu zgłoszeń",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle
                    className="text-[var(--color-kraft)]"
                    size={20}
                  />
                  <span className="text-[var(--color-slatedark)] font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/offers"
                className="inline-flex items-center px-8 py-4 bg-[var(--color-kraft)] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[var(--color-manilla)] transition-all duration-300 transform hover:-translate-y-1"
              >
                Przeglądaj oferty
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] rounded-2xl opacity-20 blur-xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-[var(--color-ivorydark)]">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Generator Linków v2.0
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Java Developer
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Aktywna
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        https://pracuj.pl/oferty/java-dev...
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Frontend React
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Aktywna
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        https://nofluffjobs.com/react...
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 opacity-60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          DevOps Engineer
                        </span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Przetwarzanie...
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <div className="h-1 w-12 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionThreeHome;
