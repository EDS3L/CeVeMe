import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import FieldChip from './FieldChip';

/**
 * DemoAnimation
 * - mierzony overlay pozwala wyliczyć pozycje źródło→cel
 * - sekwencja kroków: name → headline → summary
 */
export default function DemoAnimation() {
  const overlayRef = useRef(null);

  // źródła (formularz) i cele (CV)
  const srcNameRef = useRef(null);
  const srcHeadlineRef = useRef(null);
  const srcSummaryRef = useRef(null);

  const dstNameRef = useRef(null);
  const dstHeadlineRef = useRef(null);
  const dstSummaryRef = useRef(null);

  const [pos, setPos] = useState({
    name: { from: null, to: null },
    headline: { from: null, to: null },
    summary: { from: null, to: null },
  });

  const [step, setStep] = useState(0); // 0 idle, 1 name, 2 headline, 3 summary, 4 done
  const [playing, setPlaying] = useState(false);

  const measure = () => {
    const rel = (el) => {
      if (!el || !overlayRef.current) return null;
      const r = el.getBoundingClientRect();
      const c = overlayRef.current.getBoundingClientRect();
      return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
    };
    setPos({
      name: { from: rel(srcNameRef.current), to: rel(dstNameRef.current) },
      headline: {
        from: rel(srcHeadlineRef.current),
        to: rel(dstHeadlineRef.current),
      },
      summary: {
        from: rel(srcSummaryRef.current),
        to: rel(dstSummaryRef.current),
      },
    });
  };

  useLayoutEffect(() => {
    measure();
  }, []);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const play = async () => {
    if (playing) return;
    setPlaying(true);
    setStep(0);
    await tick(250);
    setStep(1); // name
    await tick(800);
    setStep(2); // headline
    await tick(800);
    setStep(3); // summary
    await tick(900);
    setStep(4); // done
    setPlaying(false);
  };

  const reset = () => {
    setStep(0);
  };

  function tick(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // helpery widoczności tekstu po „lądowaniu”
  const revealName = step >= 1;
  const revealHeadline = step >= 2;
  const revealSummary = step >= 3;

  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[var(--color-basewhite)] p-4 lg:p-6">
      {/* Toolbar animacji */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--color-manilla)]">
            Demo
          </span>
          <h3 className="font-semibold">Wypełnianie CV — animacja</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={play}
            disabled={playing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md
                       bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] font-semibold
                       shadow-sm hover:bg-[var(--color-kraft)] focus:outline-none
                       focus:ring-2 focus:ring-[var(--color-feedbackfocus)] disabled:opacity-50"
          >
            {playing ? 'Odtwarzanie…' : 'Zobacz w akcji'}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border
                       border-[rgba(0,0,0,0.08)] bg-[var(--color-ivorylight)] font-semibold
                       hover:bg-[var(--color-ivorymedium)]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scena animacji */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[360px] lg:min-h-[420px]">
        {/* Makieta formularza (źródło) */}
        <div className="rounded-lg border border-[rgba(0,0,0,0.06)] bg-[var(--color-ivorylight)] p-4">
          <div className="text-xs font-semibold tracking-wide uppercase text-[var(--color-clouddark)] mb-3">
            Formularz
          </div>
          <div
            ref={srcNameRef}
            className="h-9 rounded-md border border-[rgba(0,0,0,0.08)] bg-[var(--color-basewhite)] px-3 flex items-center mb-3"
          >
            <span className="text-sm text-[var(--color-clouddark)]">
              Imię i nazwisko
            </span>
          </div>
          <div
            ref={srcHeadlineRef}
            className="h-9 rounded-md border border-[rgba(0,0,0,0.08)] bg-[var(--color-basewhite)] px-3 flex items-center mb-3"
          >
            <span className="text-sm text-[var(--color-clouddark)]">
              Nagłówek
            </span>
          </div>
          <div
            ref={srcSummaryRef}
            className="h-[84px] rounded-md border border-[rgba(0,0,0,0.08)] bg-[var(--color-basewhite)] px-3 py-2"
          >
            <span className="text-sm text-[var(--color-clouddark)]">
              Podsumowanie
            </span>
          </div>

          <p className="text-xs text-[var(--color-clouddark)] mt-3">
            Kliknij „Zobacz w akcji”, aby zobaczyć jak pola wypełniają makietę
            CV po prawej.
          </p>
        </div>

        {/* Makieta A4 (cel) */}
        <div className="relative">
          <div
            className="mx-auto relative rounded-lg border border-[rgba(0,0,0,0.06)] bg-[var(--color-basewhite)] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
            style={{ width: 'min(100%, 540px)', aspectRatio: '210/297' }}
          >
            {/* header */}
            <div className="absolute left-6 right-6 top-6 pb-2 border-b border-[rgba(0,0,0,0.06)]">
              <div ref={dstNameRef} className="h-8">
                <span
                  className={`block text-xl font-extrabold text-[var(--color-slatedark)] transition-opacity duration-500 ${
                    revealName ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Jan Kowalski
                </span>
              </div>
              <div ref={dstHeadlineRef} className="h-5">
                <span
                  className={`block text-sm text-[var(--color-clouddark)] transition-opacity duration-500 ${
                    revealHeadline ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Frontend Engineer
                </span>
              </div>
            </div>

            {/* summary */}
            <div
              ref={dstSummaryRef}
              className="absolute left-6 right-6 top-[86px]"
            >
              <div
                className={`text-sm text-[var(--color-slatedark)] leading-relaxed transition-opacity duration-500 ${
                  revealSummary ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Buduję dopracowane UI z naciskiem na wydajność i dostępność. 5+
                lat w React/TypeScript.
              </div>
            </div>

            {/* sekcje layoutu (ozdobne placeholdery) */}
            <div className="absolute left-6 right-6 bottom-6 top-[150px]">
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-2 flex flex-col gap-3">
                  <div className="h-4 rounded bg-[var(--color-ivorymedium)]" />
                  <div className="h-4 w-4/5 rounded bg-[var(--color-ivorymedium)]" />
                  <div className="flex-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-4 rounded bg-[var(--color-ivorymedium)]" />
                  <div className="h-4 w-4/5 rounded bg-[var(--color-ivorymedium)]" />
                  <div className="flex-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAY — tutaj latają chipy */}
        <div ref={overlayRef} className="pointer-events-none absolute inset-0">
          {pos.name.from && pos.name.to && (
            <FieldChip
              label="Jan Kowalski"
              from={pos.name.from}
              to={pos.name.to}
              go={step >= 1}
              delay={50}
            />
          )}
          {pos.headline.from && pos.headline.to && (
            <FieldChip
              label="Frontend Engineer"
              from={pos.headline.from}
              to={pos.headline.to}
              go={step >= 2}
              delay={100}
            />
          )}
          {pos.summary.from && pos.summary.to && (
            <FieldChip
              label="Podsumowanie"
              from={pos.summary.from}
              to={pos.summary.to}
              go={step >= 3}
              delay={150}
            />
          )}
        </div>
      </div>
    </div>
  );
}
