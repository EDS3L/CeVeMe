import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Link as LinkIcon, CheckCircle } from "lucide-react";

const SectionThreeHome = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-ivorydark via-ivorylight to-cloudlight relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-kraft/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-bookcloth/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-kraft/20 shadow-md">
              <LinkIcon size={16} className="text-kraft mr-2" />
              <span className="text-sm font-semibold text-slatedark">
                Inteligentne linkowanie
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slatedark leading-tight">
              U nas znajdziesz linki do{" "}
              <span className="bg-gradient-to-r from-kraft to-bookcloth bg-clip-text text-transparent">
                najpopularniejszych
              </span>{" "}
              ofert pracy.
            </h2>

            <p className="text-lg text-clouddark leading-relaxed">
              Generuj linki bez problemu. Nasz system automatycznie wyszukuje i
              kategoryzuje oferty z wiodących portali, oszczędzając Twój czas.
            </p>

            <div className="space-y-4">
              {[
                "Automatyczna agregacja ofert",
                "Bezpośrednie linki do aplikacji",
                "Śledzenie statusu zgłoszeń",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="bg-gradient-to-br from-kraft to-bookcloth rounded-full p-1 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <span className="text-slatedark font-medium group-hover:text-kraft transition-colors duration-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/offers"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-kraft to-bookcloth text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-bookcloth hover:to-kraft transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                Przeglądaj oferty
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-kraft to-bookcloth rounded-2xl opacity-30 blur-2xl animate-pulse"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-kraft/10 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-400 hover:scale-125 transition-transform cursor-pointer"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 hover:scale-125 transition-transform cursor-pointer"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 hover:scale-125 transition-transform cursor-pointer"></div>
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">
                      Generator Linków v2.0
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-kraft/10 hover:border-kraft/30 transition-all duration-300 hover:shadow-md cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Java Developer
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          Aktywna
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        https://pracuj.pl/oferty/java-dev...
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-kraft/10 hover:border-kraft/30 transition-all duration-300 hover:shadow-md cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Frontend React
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          Aktywna
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        https://nofluffjobs.com/react...
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-kraft/10 opacity-60 cursor-wait">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          DevOps Engineer
                        </span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-semibold">
                          Przetwarzanie...
                        </span>
                      </div>
                      <div className="h-2 bg-gradient-to-r from-kraft/20 to-bookcloth/20 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <div className="h-1.5 w-16 bg-gradient-to-r from-kraft to-bookcloth rounded-full"></div>
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
