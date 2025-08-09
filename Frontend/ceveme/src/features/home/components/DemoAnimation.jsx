import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import DropChip from './DropChip';

export default function DemoAnimation() {
  // Sceny: 1=link, 2=analiza, 3=generowanie (drop), 4=gotowe
  const [scene, setScene] = useState(1);
  const [cycle, setCycle] = useState(0); // reset animacji per cykl
  const [running, setRunning] = useState(true);

  // Sterowanie dropami i odsłanianiem tekstu docelowego
  const [drop, setDrop] = useState({
    name: false,
    headline: false,
    summary: false,
  });
  const [reveal, setReveal] = useState({
    name: false,
    headline: false,
    summary: false,
  });

  // Pomiar pozycji docelowych
  const overlayRef = useRef(null);
  const dstNameRef = useRef(null);
  const dstHeadlineRef = useRef(null);
  const dstSummaryRef = useRef(null);
  const [to, setTo] = useState({ name: null, headline: null, summary: null });

  const timersRef = useRef([]);

  // ——— CZASY (łatwo regulować) ———
  const T = {
    link: 2200, // scena 1
    analyze: 5000, // scena 2
    generateStart: 400, // opóźnienie przed startem „dropów”
    dropGap: 800, // odstęp między dropami
    dropDuration: 1200, // czas pojedynczego dropa
    chipStay: 350, // ile chip zostaje po lądowaniu (potem znika)
    done: 5000, // scena 4
    between: 500, // krótki crossfade między scenami
  };

  const measureTargets = () => {
    const rel = (el) => {
      if (!el || !overlayRef.current) return null;
      const r = el.getBoundingClientRect();
      const c = overlayRef.current.getBoundingClientRect();
      return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
    };
    setTo({
      name: rel(dstNameRef.current),
      headline: rel(dstHeadlineRef.current),
      summary: rel(dstSummaryRef.current),
    });
  };

  useLayoutEffect(() => {
    measureTargets();
  }, []);
  useEffect(() => {
    const onResize = () => measureTargets();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    startLoop(); // autoplay
    return stopAll; // sprzątanie
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopAll() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }
  function later(ms, cb) {
    const t = setTimeout(cb, ms);
    timersRef.current.push(t);
    return t;
  }

  function startLoop() {
    stopAll();
    setScene(1);
    setDrop({ name: false, headline: false, summary: false });
    setReveal({ name: false, headline: false, summary: false });

    // SCENA 1 — LINK
    later(T.link, () => {
      setScene(2);
      measureTargets();
    });

    // SCENA 2 — ANALIZA
    later(T.link + T.between + T.analyze, () => {
      setScene(3);
      measureTargets();
    });

    // SCENA 3 — GENEROWANIE (dropy)
    const base = T.link + T.between + T.analyze + T.between + T.generateStart;

    // Name
    later(base + 0, () => setDrop((d) => ({ ...d, name: true })));
    later(base + T.dropDuration - 60, () =>
      setReveal((r) => ({ ...r, name: true }))
    );

    // Headline
    later(base + T.dropGap, () => setDrop((d) => ({ ...d, headline: true })));
    later(base + T.dropGap + T.dropDuration - 60, () =>
      setReveal((r) => ({ ...r, headline: true }))
    );

    // Summary
    later(base + 2 * T.dropGap, () =>
      setDrop((d) => ({ ...d, summary: true }))
    );
    later(base + 2 * T.dropGap + T.dropDuration - 60, () =>
      setReveal((r) => ({ ...r, summary: true }))
    );

    // SCENA 4 — GOTOWE
    const endGenerate = base + 2 * T.dropGap + T.dropDuration + T.chipStay;
    later(endGenerate + T.between, () => {
      setScene(4);
      // na wszelki wypadek odsłoń wszystko
      setReveal({ name: true, headline: true, summary: true });
    });

    // Restart pętli
    const total =
      T.link +
      T.between +
      T.analyze +
      T.between +
      T.generateStart +
      2 * T.dropGap +
      T.dropDuration +
      T.chipStay +
      T.between +
      T.done;

    later(total, () => {
      if (!running) return;
      // reset cyklu, żeby animacje w 100% się odświeżyły
      setCycle((c) => c + 1);
      setScene(1);
      setDrop({ name: false, headline: false, summary: false });
      setReveal({ name: false, headline: false, summary: false });
      measureTargets();
      startLoop();
    });
  }

  // Pauza/Wznowienie
  const toggleRun = () => {
    if (running) {
      setRunning(false);
      stopAll();
    } else {
      setRunning(true);
      setCycle((c) => c + 1);
      startLoop();
    }
  };

  const phaseLabel = {
    1: 'Wklejono link do oferty',
    2: 'AI analizuje wymagania…',
    3: 'AI generuje CV z Twoich danych…',
    4: 'Gotowe! Spersonalizowane CV',
  }[scene];

  return (
    <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[var(--color-basewhite)] p-5 lg:p-7">
      {/* Tytuł + Pauza/Wznów */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-[var(--color-manilla)]">
            Demo
          </span>
          <h3 className="text-xl lg:text-2xl font-bold">
            Generowanie CV — pokaz działania
          </h3>
        </div>
        <button
          onClick={toggleRun}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[rgba(0,0,0,0.1)] bg-[var(--color-ivorylight)] font-semibold hover:bg-[var(--color-ivorymedium)]"
          aria-pressed={running}
          title={running ? 'Pauza' : 'Wznów'}
        >
          {running ? '⏸ Pauza' : '▶ Wznów'}
        </button>
      </div>

      {/* Status */}
      <div className="mb-6">
        <div className="text-sm lg:text-base text-[var(--color-slatedark)] font-medium">
          {phaseLabel}
        </div>
        <ol className="mt-3 grid grid-cols-4 gap-2 text-xs lg:text-sm">
          <StepDot active={scene >= 1} label="Link" />
          <StepDot active={scene >= 2} label="Analiza" />
          <StepDot active={scene >= 3} label="Generowanie" />
          <StepDot active={scene >= 4} label="CV" />
        </ol>
      </div>

      {/* ——— SCENY (każda osobna, większe fonty) ——— */}
      <div className="relative">
        {/* Scena 1 — LINK */}
        <SceneFrame key={`s1-${cycle}`} visible={scene === 1} tone="light">
          <div className="grid grid-cols-1 lg:grid-cols-[560px_minmax(0,1fr)] gap-8 items-center min-h-[380px] lg:min-h-[440px]">
            <div className="rounded-xl border bg-[var(--color-basewhite)] p-6 shadow-sm">
              <div className="text-sm uppercase tracking-wide text-[var(--color-clouddark)] mb-2">
                Krok 1
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold mb-5">
                Wklejasz link do oferty
              </div>
              <div className="h-14 rounded-lg border px-4 flex items-center text-base lg:text-lg font-medium overflow-hidden">
                https://jobs.example.com/frontend-engineer
              </div>
              <div className="mt-4 text-sm text-[var(--color-clouddark)]">
                Aplikacja automatycznie przechwytuje link. Za chwilę analiza.
              </div>
            </div>
            <SceneHint>Przejście do analizy…</SceneHint>
          </div>
        </SceneFrame>

        {/* Scena 2 — ANALIZA */}
        <SceneFrame key={`s2-${cycle}`} visible={scene === 2} tone="brand">
          <div className="grid grid-cols-1 lg:grid-cols-[560px_minmax(0,1fr)] gap-8 items-center min-h-[380px] lg:min-h-[440px]">
            <div className="rounded-xl border bg-[var(--color-basewhite)] p-6 shadow-sm">
              <div className="text-sm uppercase tracking-wide text-[var(--color-clouddark)] mb-2">
                Krok 2
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold mb-5">
                AI analizuje wymagania
              </div>
              <div className="h-32 rounded-lg border p-4 relative overflow-hidden">
                <ScanLines />
                <div className="relative z-10 text-sm lg:text-base leading-relaxed">
                  • React, TypeScript, CSS-in-JS
                  <br />
                  • Dostępność (WCAG), testy jednostkowe
                  <br />• Doświadczenie: 4+ lata w FE
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-clouddark)]">
                <Spinner /> Analizuję opis stanowiska…
              </div>
            </div>
            <SceneHint>Dopasowanie do Twoich danych…</SceneHint>
          </div>
        </SceneFrame>

        {/* Scena 3 — GENEROWANIE (dropy) */}
        <SceneFrame key={`s3-${cycle}`} visible={scene === 3} tone="neutral">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px] lg:min-h-[480px]">
            {/* Formularz */}
            <div className="rounded-xl border bg-[var(--color-basewhite)] p-6">
              <div className="text-sm uppercase tracking-wide text-[var(--color-clouddark)] mb-2">
                Krok 3
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold mb-5">
                Tworzenie CV z Twoich danych
              </div>
              <FormField label="Imię i nazwisko" value="Jan Kowalski" large />
              <FormField label="Nagłówek" value="Frontend Engineer" />
              <FormField
                label="Podsumowanie"
                value="Buduję dopracowane UI z naciskiem na wydajność i dostępność. 5+ lat w React/TypeScript."
                multiline
              />
              <div className="mt-3 text-sm text-[var(--color-clouddark)]">
                Pola wpadają na swoje miejsce po prawej.
              </div>
            </div>

            {/* Makieta A4 (cel) */}
            <div className="relative">
              <div
                className="mx-auto relative rounded-xl border bg-[var(--color-basewhite)] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                style={{ width: 'min(100%, 580px)', aspectRatio: '210/297' }}
              >
                {/* header */}
                <div className="absolute left-6 right-6 top-6 pb-3 border-b border-[rgba(0,0,0,0.08)]">
                  <div ref={dstNameRef} className="h-9">
                    <span
                      className={`block text-2xl font-extrabold text-[var(--color-slatedark)] transition-opacity duration-300 ${
                        reveal.name ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      Jan Kowalski
                    </span>
                  </div>
                  <div ref={dstHeadlineRef} className="h-6">
                    <span
                      className={`block text-base text-[var(--color-clouddark)] transition-opacity duration-300 ${
                        reveal.headline ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      Frontend Engineer
                    </span>
                  </div>
                </div>

                {/* summary */}
                <div
                  ref={dstSummaryRef}
                  className="absolute left-6 right-6 top-[100px]"
                >
                  <div
                    className={`text-base text-[var(--color-slatedark)] leading-relaxed transition-opacity duration-300 ${
                      reveal.summary ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    Buduję dopracowane UI z naciskiem na wydajność i dostępność.
                    5+ lat w React/TypeScript.
                  </div>
                </div>

                {/* placeholdery */}
                <div className="absolute left-6 right-6 bottom-6 top-[172px]">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="col-span-2 flex flex-col gap-3">
                      <div className="h-5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="h-5 w-4/5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="flex-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="h-5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="h-5 w-4/5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="flex-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]" />
                    </div>
                  </div>
                </div>

                {/* OVERLAY — chipy ponad treścią; znikają po lądowaniu */}
                <div
                  ref={overlayRef}
                  className="pointer-events-none absolute inset-0 z-10"
                >
                  {to.name && (
                    <DropChip
                      key={`name-${cycle}`}
                      label="Jan Kowalski"
                      to={to.name}
                      go={drop.name}
                      delay={0}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                    />
                  )}
                  {to.headline && (
                    <DropChip
                      key={`headline-${cycle}`}
                      label="Frontend Engineer"
                      to={to.headline}
                      go={drop.headline}
                      delay={0}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                    />
                  )}
                  {to.summary && (
                    <DropChip
                      key={`summary-${cycle}`}
                      label="Podsumowanie"
                      to={to.summary}
                      go={drop.summary}
                      delay={0}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                      wide
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </SceneFrame>

        {/* Scena 4 — GOTOWE (czytelny finał) */}
        <SceneFrame key={`s4-${cycle}`} visible={scene === 4} tone="success">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_560px] gap-8 items-center min-h-[380px] lg:min-h-[440px]">
            <SceneHint>CV gotowe do pobrania</SceneHint>
            <div className="relative">
              <div
                className="mx-auto relative rounded-xl border bg-[var(--color-basewhite)] shadow-[0_30px_70px_rgba(0,0,0,0.18)] ring-2 ring-[var(--color-bookcloth)]"
                style={{ width: 'min(100%, 580px)', aspectRatio: '210/297' }}
              >
                {/* Nagłówek */}
                <div className="absolute left-6 right-6 top-6 pb-3 border-b border-[rgba(0,0,0,0.08)]">
                  <div className="h-9">
                    <span className="block text-2xl font-extrabold text-[var(--color-slatedark)]">
                      Jan Kowalski
                    </span>
                  </div>
                  <div className="h-6">
                    <span className="block text-base text-[var(--color-clouddark)]">
                      Frontend Engineer
                    </span>
                  </div>
                </div>
                {/* Podsumowanie */}
                <div className="absolute left-6 right-6 top-[100px] text-base leading-relaxed">
                  Buduję dopracowane UI z naciskiem na wydajność i dostępność.
                  5+ lat w React/TypeScript.
                </div>
                {/* Placeholdery */}
                <div className="absolute left-6 right-6 bottom-6 top-[172px]">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="col-span-2 flex flex-col gap-3">
                      <div className="h-5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="h-5 w-4/5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="flex-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="h-5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="h-5 w-4/5 rounded bg-[var(--color-ivorymedium)]" />
                      <div className="flex-1 rounded bg-[var(--color-ivorylight)] border border-[rgba(0,0,0,0.06)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SceneFrame>
      </div>

      {/* drobne animacje / style pomocnicze */}
      <style>{`
        .fade-enter { opacity: 0; transform: translateY(6px); }
        .fade-enter-active { opacity: 1; transform: translateY(0); transition: opacity 320ms ease, transform 320ms ease; }
        .fade-leave { opacity: 1; }
        .fade-leave-active { opacity: 0; transition: opacity 220ms ease; }
      `}</style>
    </div>
  );
}

/* ———————— Pomocnicze pod-komponenty ———————— */

function StepDot({ active, label }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          active ? 'bg-[var(--color-bookcloth)]' : 'bg-[rgba(0,0,0,0.15)]'
        }`}
      />
      <span className="text-[var(--color-clouddark)]">{label}</span>
    </li>
  );
}

// Scena z miękkim fade-in/out
function SceneFrame({ children, visible, tone = 'light' }) {
  const tones = {
    light: 'bg-[var(--color-ivorylight)]',
    neutral: 'bg-[var(--color-ivorymedium)]',
    brand: 'bg-[var(--color-manilla)]/50',
    success: 'bg-[var(--color-ivorylight)]',
  }[tone];

  return (
    <div className={`relative ${visible ? 'block' : 'hidden'}`}>
      <div
        className={`rounded-xl border border-[rgba(0,0,0,0.06)] p-5 lg:p-6 ${tones} fade-enter fade-enter-active`}
      >
        {children}
      </div>
    </div>
  );
}

function SceneHint({ children }) {
  return (
    <div className="text-base lg:text-lg text-[var(--color-slatedark)]/80">
      {children}
    </div>
  );
}

function FormField({ label, value, multiline = false, large = false }) {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase tracking-wide text-[var(--color-clouddark)] mb-1">
        {label}
      </div>
      <div
        className={`rounded-lg border bg-[var(--color-basewhite)] px-4 ${
          multiline ? 'py-3 h-28' : 'h-12'
        } flex items-center text-base lg:text-lg font-medium`}
      >
        {value}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="relative inline-flex h-4 w-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-bookcloth)] opacity-30" />
      <span className="relative inline-flex h-4 w-4 rounded-full bg-[var(--color-bookcloth)]" />
    </span>
  );
}

function ScanLines() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.06)_50%,rgba(0,0,0,0)_100%)] animate-[scan_1400ms_ease_infinite]"></div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
