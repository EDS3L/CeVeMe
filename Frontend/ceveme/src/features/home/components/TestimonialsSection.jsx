import React from "react";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Anna Kowalska",
      role: "Frontend Developer",
      company: "TechCorp",
      image: "👩‍💻",
      rating: 5,
      text: "Dzięki CeVeMe znalazłam pracę marzeń w zaledwie 2 tygodnie! AI doskonale dopasowało moje CV do każdej oferty. To rewolucyjne narzędzie!",
      color: "from-kraft to-bookcloth",
    },
    {
      name: "Marek Nowak",
      role: "Java Developer",
      company: "SoftwareHouse",
      image: "👨‍💼",
      rating: 5,
      text: "Aplikacja zaoszczędziła mi dziesiątki godzin. Zamiast ręcznie dostosowywać CV, teraz mogę skupić się na przygotowaniu do rozmów. Genialny pomysł!",
      color: "from-bookcloth to-manilla",
    },
    {
      name: "Karolina Wiśniewska",
      role: "UX Designer",
      company: "DesignStudio",
      image: "👩‍🎨",
      rating: 5,
      text: "Estetyczne szablony i perfekcyjne dopasowanie do ATS. Otrzymałam 3 razy więcej odpowiedzi od rekruterów niż wcześniej. Polecam każdemu!",
      color: "from-manilla to-kraft",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-ivorylight via-cloudlight to-ivorymedium relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-kraft/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-bookcloth/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-kraft/10 rounded-full border border-kraft/20">
            <Star className="w-4 h-4 text-kraft fill-kraft" />
            <span className="text-sm font-semibold text-slatedark">
              Opinie użytkowników
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slatedark mb-4">
            <span className="bg-gradient-to-r from-slatedark to-kraft bg-clip-text text-transparent">
              Ponad 10,000
            </span>
            <br />
            zadowolonych użytkowników
          </h2>

          <p className="text-lg md:text-xl text-clouddark max-w-2xl mx-auto">
            Dołącz do tysięcy profesjonalistów, którzy już znaleźli pracę marzeń
            dzięki CeVeMe
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-kraft/10 hover:shadow-2xl hover:border-kraft/30 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              ></div>

              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-kraft" />
              </div>

              {/* Content */}
              <div className="relative">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-kraft fill-kraft" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-clouddark leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-kraft to-bookcloth flex items-center justify-center text-3xl shadow-md">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-slatedark">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-clouddark">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-kraft/10">
            <div className="text-3xl font-bold text-kraft mb-2">4.9/5</div>
            <div className="text-sm text-clouddark">Średnia ocena</div>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-kraft/10">
            <div className="text-3xl font-bold text-kraft mb-2">10k+</div>
            <div className="text-sm text-clouddark">Aktywnych użytkowników</div>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-kraft/10">
            <div className="text-3xl font-bold text-kraft mb-2">50k+</div>
            <div className="text-sm text-clouddark">Wygenerowanych CV</div>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-kraft/10">
            <div className="text-3xl font-bold text-kraft mb-2">95%</div>
            <div className="text-sm text-clouddark">Zadowolonych klientów</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
