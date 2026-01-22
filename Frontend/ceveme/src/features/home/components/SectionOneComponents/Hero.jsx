import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, FileText, Zap, TrendingUp } from "lucide-react";

function Hero() {
  return (
    <div className="min-h-screen pt-28 sm:pt-20 bg-gradient-to-br from-manilla via-ivorydark to-kraft flex flex-col justify-center items-center font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-kraft rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-bookcloth rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-manilla rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <FileText className="text-kraft/30 w-16 h-16" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed">
          <Sparkles className="text-bookcloth/30 w-12 h-12" />
        </div>
        <div className="absolute bottom-1/3 left-1/5 animate-float">
          <Zap className="text-kraft/30 w-14 h-14" />
        </div>
        <div className="absolute top-1/2 right-1/5 animate-float-delayed">
          <TrendingUp className="text-bookcloth/30 w-10 h-10" />
        </div>
      </div>

      <div className="relative z-10 text-center px-4 w-full max-w-full overflow-hidden">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 mt-4 sm:mt-0 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-kraft/20">
          <Sparkles className="w-4 h-4 text-kraft" />
          <span className="text-sm font-semibold text-slatedark">
            Inteligentny Generator CV z AI
          </span>
        </div>

        {/* Main Heading with Gradient */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto break-words">
          <span className="bg-gradient-to-r from-slatedark via-bookcloth to-kraft bg-clip-text text-transparent">
            Profesjonalne CV
          </span>
          <br />
          <span className="text-slatedark">do każdej oferty</span>
          <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-kraft to-bookcloth bg-clip-text text-transparent">
            za pomocą AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-slatemedium max-w-3xl mx-auto px-2 leading-relaxed">
          ✨ Celne dopasowanie do{" "}
          <span className="font-semibold text-kraft">ATS</span> oraz wymagań
          rekrutera
          <br />
          🚀 Indywidualne CV do ofert pracy w{" "}
          <span className="font-semibold text-kraft">zaledwie kilka chwil</span>
        </p>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-center">
          <div className="px-4">
            <div className="text-3xl font-bold text-kraft">10k+</div>
            <div className="text-sm text-clouddark">Wygenerowanych CV</div>
          </div>
          <div className="px-4">
            <div className="text-3xl font-bold text-kraft">95%</div>
            <div className="text-sm text-clouddark">Zgodność z ATS</div>
          </div>
          <div className="px-4">
            <div className="text-3xl font-bold text-kraft">2 min</div>
            <div className="text-sm text-clouddark">Średni czas generacji</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to={"/auth/register"}>
            <button className="group relative px-8 py-4 bg-gradient-to-r from-kraft to-bookcloth cursor-pointer text-white rounded-full text-lg font-bold shadow-2xl hover:shadow-kraft/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <span className="relative z-10 flex items-center gap-2">
                Rozpocznij za darmo
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-bookcloth to-kraft opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
          <Link to={"/auth/login"}>
            <button className="px-8 py-4 bg-white/90 backdrop-blur-sm cursor-pointer text-slatedark rounded-full text-lg font-semibold border-2 border-kraft/30 hover:border-kraft hover:bg-white transition-all duration-300 transform hover:scale-105">
              Zaloguj się
            </button>
          </Link>
        </div>

        {/* Trust Badge */}
        <p className="mt-8 text-sm text-clouddark">
          🔒 Bezpieczne • Bez karty kredytowej • Zawsze aktualne
        </p>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#f0f0eb"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default Hero;
