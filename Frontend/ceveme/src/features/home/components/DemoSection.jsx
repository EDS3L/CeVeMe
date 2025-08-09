import React from 'react';
import DemoAnimation from './DemoAnimation';

export default function DemoSection() {
  return (
    <section
      className="w-full bg-[var(--color-ivorylight)] text-[var(--color-slatedark)]"
      aria-labelledby="lp-demo-heading"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[460px_minmax(0,1fr)] gap-10 items-start">
          {/* LEWY — opis jak działa */}
          <aside className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[var(--color-ivorymedium)] p-6 lg:sticky lg:top-8 h-fit">
            <header>
              <h2
                id="lp-demo-heading"
                className="text-3xl/tight font-extrabold tracking-tight"
              >
                Zobacz, jak{' '}
                <span className="text-[var(--color-bookcloth)]">
                  Twoje dane
                </span>{' '}
                stają się eleganckim{' '}
                <span className="text-[var(--color-bookcloth)]">CV</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-clouddark)]">
                Nasz edytor przekształca wprowadzone pola w czytelny,
                profesjonalny dokument. Animacja obok pokazuje, jak informacje
                „wpadają” we właściwe miejsca na kartce A4, a całość jest zawsze
                idealnie dopasowana do jednej strony PDF.
              </p>
            </header>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-manilla)] font-bold">
                  1
                </span>
                <div>
                  <strong>Wpisujesz dane</strong> — imię i nazwisko, nagłówek,
                  podsumowanie, doświadczenie.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-manilla)] font-bold">
                  2
                </span>
                <div>
                  <strong>Wybierasz szablon</strong> — ATS, Hybrid lub Project.
                  Każdy jest ATS-safe.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-manilla)] font-bold">
                  3
                </span>
                <div>
                  <strong>Eksportujesz PDF</strong> — jedna strona A4,
                  perfekcyjnie zeskalowana do druku.
                </div>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]">
                Reverse-chronological
              </span>
              <span className="inline-flex items-center text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]">
                STAR/CAR bullets
              </span>
              <span className="inline-flex items-center text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]">
                ATS-safe
              </span>
            </div>
          </aside>

          {/* PRAWY — sztuczna animacja */}
          <div className="space-y-6">
            <DemoAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
