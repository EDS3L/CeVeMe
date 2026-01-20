import React from "react";
import DemoAnimation from "./DemoAnimation";

export default function DemoSection() {
  return (
    <section
      id="features"
      className="w-full bg-gradient-to-b from-cloudlight to-ivorylight py-16 text-slatedark"
      aria-labelledby="lp-demo-heading"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Animacja po LEWEJ, opis po PRAWEJ */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-start">
          <div className="space-y-6">
            <DemoAnimation />
          </div>

          <aside className="rounded-xl border border-kraft/10 bg-white/60 backdrop-blur-sm p-6 lg:sticky lg:top-8 h-fit shadow-lg">
            <header>
              <h2
                id="lp-demo-heading"
                className="text-3xl/tight font-extrabold tracking-tight"
              >
                Jak to działa
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-clouddark">
                Aplikacja działa w pętli — po zakończeniu jednego procesu
                automatycznie zaczyna kolejny. Zawsze możesz wcisnąć „Pauza".
              </p>
            </header>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-kraft to-bookcloth text-white font-bold shadow-md">
                  1
                </span>
                <div>
                  <strong>Wklejasz link lub wybierasz ofertę pracy.</strong>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-kraft to-bookcloth text-white font-bold shadow-md">
                  2
                </span>
                <div>
                  <strong>AI analizuje ofertę</strong> i łączy ją z Twoimi
                  danymi.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-kraft to-bookcloth text-white font-bold shadow-md">
                  3
                </span>
                <div>
                  <strong>Powstaje spersonalizowane CV,</strong> a pola
                  „wpadają" na swoje miejsce.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-kraft to-bookcloth text-white font-bold shadow-md">
                  4
                </span>
                <div>
                  <strong>Pętla trwa dalej</strong> — zmień ofertę lub dane i
                  generuj kolejne CV.
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
