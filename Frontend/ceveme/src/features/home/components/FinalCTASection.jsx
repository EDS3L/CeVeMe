import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Zap, TrendingUp, Shield, Clock, Award } from "lucide-react";

const FinalCTASection = () => {
  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: "Generowanie CV w 2 minuty" },
    { icon: <Shield className="w-5 h-5" />, text: "95% zgodność z ATS" },
    { icon: <Clock className="w-5 h-5" />, text: "Dostęp 24/7" },
    { icon: <Award className="w-5 h-5" />, text: "Profesjonalne szablony" },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-ivorymedium via-kraft to-bookcloth relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Rozpocznij już dziś
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Gotowy na pracę marzeń?
            <br />
            <span className="bg-gradient-to-r from-white to-ivorylight bg-clip-text text-transparent">
              Zarejestruj się za darmo
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Dołącz do tysięcy profesjonalistów i twórz perfekcyjne CV dopasowane
            do każdej oferty pracy w kilka minut
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-white">{benefit.icon}</div>
                <span className="text-white/90 text-sm text-center">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/auth/register">
              <button className="group relative px-10 py-5 bg-white cursor-pointer text-slatedark rounded-full text-lg font-bold shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Rozpocznij za darmo
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
            </Link>
            <Link to="/auth/login">
              <button className="px-10 py-5 bg-transparent cursor-pointer text-white rounded-full text-lg font-semibold border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Mam już konto
              </button>
            </Link>
          </div>

          {/* Trust Message */}
          <p className="text-white/70 text-sm">
            🔒 Bezpieczne • Bez karty kredytowej • Anuluj w każdej chwili
          </p>

          {/* Social Proof */}
          <div className="mt-12 pt-12 border-t border-white/20">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  10,000+
                </div>
                <div className="text-white/70 text-sm">
                  Aktywnych użytkowników
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  50,000+
                </div>
                <div className="text-white/70 text-sm">Wygenerowanych CV</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-white/70 text-sm">Średnia ocena</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
