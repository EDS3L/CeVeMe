// DemoAnimation.jsx — Ulepszona wersja z profesjonalnymi animacjami
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function DemoAnimation() {
  const [scene, setScene] = useState(1);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);

  const [drop, setDrop] = useState({
    name: false,
    headline: false,
    summary: false,
    skills: false,
    experience: false,
  });
  const [reveal, setReveal] = useState({
    name: false,
    headline: false,
    summary: false,
    skills: false,
    experience: false,
  });

  const overlayRef = useRef(null);
  const dstNameRef = useRef(null);
  const dstHeadlineRef = useRef(null);
  const dstSummaryRef = useRef(null);
  const dstSkillsRef = useRef(null);
  const dstExperienceRef = useRef(null);
  const [to, setTo] = useState({
    name: null,
    headline: null,
    summary: null,
    skills: null,
    experience: null,
  });

  const timersRef = useRef([]);
  const progressRef = useRef(null);

  const T = {
    link: 3000,
    analyze: 5500,
    generateStart: 600,
    dropGap: 900,
    dropDuration: 1800,
    chipStay: 500,
    revealLag: 200,
    done: 5000,
    between: 800,
  };

  const totalTime =
    T.link +
    T.between +
    T.analyze +
    T.between +
    T.generateStart +
    4 * T.dropGap +
    T.dropDuration +
    T.chipStay +
    T.revealLag +
    T.between +
    T.done;

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
      skills: rel(dstSkillsRef.current),
      experience: rel(dstExperienceRef.current),
    });
  };

  useLayoutEffect(() => {
    measureTargets();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => measureTargets());
    }
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    const ro = new ResizeObserver(() => measureTargets());
    ro.observe(overlayRef.current);
    [
      dstNameRef,
      dstHeadlineRef,
      dstSummaryRef,
      dstSkillsRef,
      dstExperienceRef,
    ].forEach((ref) => {
      if (ref.current) ro.observe(ref.current);
    });
    const onResize = () => measureTargets();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    startLoop();
    return stopAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress animation
  useEffect(() => {
    if (!running) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalTime) * 100, 100);
      setProgress(newProgress);
      if (elapsed < totalTime && running) {
        progressRef.current = requestAnimationFrame(animate);
      }
    };
    progressRef.current = requestAnimationFrame(animate);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [running, cycle, totalTime]);

  function stopAll() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
  }

  function later(ms, cb) {
    const t = setTimeout(cb, ms);
    timersRef.current.push(t);
    return t;
  }

  function startLoop() {
    stopAll();
    setScene(1);
    setProgress(0);
    setDrop({
      name: false,
      headline: false,
      summary: false,
      skills: false,
      experience: false,
    });
    setReveal({
      name: false,
      headline: false,
      summary: false,
      skills: false,
      experience: false,
    });

    later(T.link, () => {
      setScene(2);
      measureTargets();
    });

    later(T.link + T.between + T.analyze, () => {
      setScene(3);
      measureTargets();
    });

    const base = T.link + T.between + T.analyze + T.between + T.generateStart;

    // Animacje dropów
    const dropSequence = [
      "name",
      "headline",
      "summary",
      "skills",
      "experience",
    ];
    dropSequence.forEach((field, i) => {
      later(base + i * T.dropGap, () =>
        setDrop((d) => ({ ...d, [field]: true })),
      );
      later(
        base + i * T.dropGap + T.dropDuration + T.chipStay + T.revealLag,
        () => setReveal((r) => ({ ...r, [field]: true })),
      );
    });

    const endGenerate =
      base +
      (dropSequence.length - 1) * T.dropGap +
      T.dropDuration +
      T.chipStay +
      T.revealLag;

    later(endGenerate + T.between, () => {
      setScene(4);
      setReveal({
        name: true,
        headline: true,
        summary: true,
        skills: true,
        experience: true,
      });
    });

    later(totalTime, () => {
      if (!running) return;
      setCycle((c) => c + 1);
      setScene(1);
      setDrop({
        name: false,
        headline: false,
        summary: false,
        skills: false,
        experience: false,
      });
      setReveal({
        name: false,
        headline: false,
        summary: false,
        skills: false,
        experience: false,
      });
      measureTargets();
      startLoop();
    });
  }

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
    1: "Wklejono link do oferty",
    2: "AI analizuje wymagania…",
    3: "AI generuje CV z Twoich danych…",
    4: "Gotowe! Spersonalizowane CV",
  }[scene];

  return (
    <div className="rounded-3xl border border-kraft/20 bg-gradient-to-br from-basewhite via-ivorylight to-basewhite p-6 lg:p-8 shadow-2xl overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-kraft/40 to-bookcloth/40 blur-3xl"
          style={{
            top: "-200px",
            right: "-200px",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-manilla/30 to-kraft/30 blur-3xl"
          style={{
            bottom: "-100px",
            left: "-100px",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex items-center text-xs uppercase tracking-widest px-3 py-1.5 rounded-full bg-gradient-to-r from-kraft to-bookcloth text-white font-bold shadow-lg">
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-kraft to-bookcloth animate-pulse opacity-50" />
            <span className="relative">Demo</span>
          </span>
          <h3 className="text-xl lg:text-2xl font-extrabold text-slatedark">
            Generowanie CV — pokaz działania
          </h3>
        </div>
        <button
          onClick={toggleRun}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-kraft/30 bg-white/80 backdrop-blur-sm font-bold text-slatedark hover:border-kraft hover:bg-kraft/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          aria-pressed={running}
        >
          <span
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              running ? "bg-feedbackerror animate-pulse" : "bg-feedbacksuccess"
            }`}
          />
          {running ? "Pauza" : "Wznów"}
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mb-6">
        <div className="h-2 rounded-full bg-clouddark/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-kraft via-bookcloth to-kraft transition-all duration-100 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="relative z-10 mb-8">
        <div className="text-base lg:text-lg text-slatedark font-semibold flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-kraft to-bookcloth text-white text-sm font-bold shadow-lg"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          >
            {scene}
          </span>
          <span className="animate-fadeIn">{phaseLabel}</span>
        </div>
        <ol className="mt-5 grid grid-cols-4 gap-3">
          <StepIndicator
            active={scene >= 1}
            current={scene === 1}
            label="Link"
            icon="🔗"
          />
          <StepIndicator
            active={scene >= 2}
            current={scene === 2}
            label="Analiza"
            icon="🔍"
          />
          <StepIndicator
            active={scene >= 3}
            current={scene === 3}
            label="Generowanie"
            icon="⚡"
          />
          <StepIndicator
            active={scene >= 4}
            current={scene === 4}
            label="CV"
            icon="📄"
          />
        </ol>
      </div>

      {/* Scenes */}
      <div className="relative z-10 min-h-[600px] sm:min-h-[650px] md:min-h-[700px] lg:min-h-[600px]">
        {/* Scene 1 — LINK */}
        <SceneFrame visible={scene === 1} tone="light">
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 xl:gap-8 items-center h-full">
            <div className="rounded-2xl border-2 border-kraft/20 bg-white/90 backdrop-blur-sm p-4 sm:p-5 lg:p-6 shadow-xl flex-1 w-full">
              <StepBadge step={1} />
              <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-slatedark mb-3 sm:mb-4 lg:mb-6">
                Wklejasz link do oferty
              </h4>
              <div className="relative group">
                <div className="h-12 lg:h-14 rounded-xl border-2 border-kraft/30 bg-ivorylight/50 px-4 flex items-center text-sm lg:text-base font-medium overflow-hidden group-hover:border-kraft transition-colors duration-300">
                  <span className="text-kraft mr-2 lg:mr-3">🔗</span>
                  <span className="text-slatedark/80 truncate text-xs lg:text-sm">
                    https://jobs.example.com/frontend-engineer
                  </span>
                  <span className="ml-auto">
                    <TypingCursor />
                  </span>
                </div>
                <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-b from-kraft/10 to-transparent rounded-b-xl blur-sm" />
              </div>
              <p className="mt-4 lg:mt-6 text-clouddark flex items-center gap-2 text-sm">
                <LoadingDots />
                <span>Przechwytywanie linku...</span>
              </p>
            </div>
            <div className="hidden xl:block flex-shrink-0">
              <SceneHint icon="➡️">Przejście do analizy…</SceneHint>
            </div>
          </div>
        </SceneFrame>

        {/* Scene 2 — ANALIZA */}
        <SceneFrame visible={scene === 2} tone="brand">
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 xl:gap-8 items-center h-full">
            <div className="rounded-2xl border-2 border-bookcloth/30 bg-white/90 backdrop-blur-sm p-4 sm:p-5 lg:p-6 shadow-xl flex-1 w-full">
              <StepBadge step={2} />
              <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-slatedark mb-3 sm:mb-4 lg:mb-6">
                AI analizuje wymagania
              </h4>
              <div className="relative rounded-xl border-2 border-kraft/20 bg-manilla/20 p-4 overflow-hidden">
                <ScanEffect />
                <div className="relative z-10 space-y-2 lg:space-y-3 text-sm lg:text-base">
                  <RequirementItem delay={0}>
                    React, TypeScript, CSS-in-JS
                  </RequirementItem>
                  <RequirementItem delay={0.3}>
                    Dostępność (WCAG), testy jednostkowe
                  </RequirementItem>
                  <RequirementItem delay={0.6}>
                    Doświadczenie: 4+ lata w FE
                  </RequirementItem>
                  <RequirementItem delay={0.9}>
                    Praca z REST API i GraphQL
                  </RequirementItem>
                </div>
              </div>
              <p className="mt-4 lg:mt-6 text-clouddark flex items-center gap-3 text-sm">
                <PulsingDot />
                <span>Analizuję opis stanowiska…</span>
              </p>
            </div>
            <div className="hidden xl:block flex-shrink-0">
              <SceneHint icon="🎯">Dopasowanie do Twoich danych…</SceneHint>
            </div>
          </div>
        </SceneFrame>

        {/* Scene 3 — GENEROWANIE */}
        <SceneFrame visible={scene === 3} tone="neutral">
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 xl:gap-8 h-full">
            {/* Form */}
            <div className="rounded-2xl border-2 border-kraft/20 bg-white/90 backdrop-blur-sm p-4 sm:p-5 lg:p-6 shadow-xl flex-shrink-0 w-full xl:w-[340px]">
              <StepBadge step={3} />
              <h4 className="text-base sm:text-lg lg:text-xl font-black text-slatedark mb-3 sm:mb-4">
                Tworzenie CV z Twoich danych
              </h4>
              <div className="space-y-4">
                <AnimatedFormField
                  label="Imię i nazwisko"
                  value="Jan Kowalski"
                  active={drop.name}
                  done={reveal.name}
                />
                <AnimatedFormField
                  label="Nagłówek"
                  value="Frontend Engineer"
                  active={drop.headline}
                  done={reveal.headline}
                />
                <AnimatedFormField
                  label="Podsumowanie"
                  value="Buduję dopracowane UI z naciskiem na wydajność i dostępność."
                  active={drop.summary}
                  done={reveal.summary}
                  multiline
                />
                <AnimatedFormField
                  label="Umiejętności"
                  value="React • TypeScript • Node.js"
                  active={drop.skills}
                  done={reveal.skills}
                />
              </div>
              <p className="mt-4 text-sm text-clouddark flex items-center gap-2">
                <span className="text-lg">✨</span>
                Pola wpadają na swoje miejsce
              </p>
            </div>

            {/* CV Preview */}
            <div className="relative flex items-center justify-center flex-1">
              <div
                className="relative rounded-2xl border-2 border-kraft/30 bg-white shadow-2xl overflow-hidden w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] xl:max-w-[380px]"
                style={{ aspectRatio: "210/297" }}
              >
                {/* CV Header */}
                <div className="absolute left-4 right-4 top-4 pb-2 border-b-2 border-kraft/20">
                  <div ref={dstNameRef} className="min-h-[24px] mb-1">
                    <span
                      className={`block font-black text-base xl:text-lg text-slatedark transition-all duration-500 ${
                        reveal.name
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                    >
                      Jan Kowalski
                    </span>
                  </div>
                  <div ref={dstHeadlineRef} className="min-h-[18px]">
                    <span
                      className={`block text-xs xl:text-sm text-bookcloth font-semibold transition-all duration-500 ${
                        reveal.headline
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                    >
                      Frontend Engineer
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div
                  ref={dstSummaryRef}
                  className="absolute left-4 right-4"
                  style={{ top: "18%" }}
                >
                  <div
                    className={`text-[10px] xl:text-xs text-slatedark/80 leading-relaxed transition-all duration-500 ${
                      reveal.summary
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    Buduję dopracowane UI z naciskiem na wydajność i dostępność.
                  </div>
                </div>

                {/* Skills */}
                <div
                  ref={dstSkillsRef}
                  className="absolute left-4 right-4"
                  style={{ top: "28%" }}
                >
                  <div
                    className={`transition-all duration-500 ${
                      reveal.skills
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    <div className="text-[8px] xl:text-[10px] uppercase tracking-wider text-clouddark mb-1 font-bold">
                      Umiejętności
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["React", "TypeScript", "Node.js", "CSS"].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-1.5 py-0.5 text-[8px] xl:text-[10px] rounded-full bg-kraft/10 text-slatedark font-medium"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div
                  ref={dstExperienceRef}
                  className="absolute left-4 right-4"
                  style={{ top: "40%" }}
                >
                  <div
                    className={`transition-all duration-500 ${
                      reveal.experience
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    <div className="text-[8px] xl:text-[10px] uppercase tracking-wider text-clouddark mb-1 font-bold">
                      Doświadczenie
                    </div>
                    <div className="text-[10px] xl:text-xs text-slatedark font-semibold">
                      Senior Frontend Dev
                    </div>
                    <div className="text-[8px] xl:text-[10px] text-clouddark">
                      TechCorp • 2020-obecnie
                    </div>
                  </div>
                </div>

                {/* Placeholders */}
                <div
                  className="absolute left-4 right-4 bottom-4"
                  style={{ top: "55%" }}
                >
                  <div className="flex flex-col gap-1.5 h-full">
                    <div className="h-2 xl:h-3 rounded bg-ivorymedium/50 w-3/4" />
                    <div className="h-2 xl:h-3 rounded bg-ivorymedium/50 w-1/2" />
                    <div className="h-2 xl:h-3 rounded bg-ivorymedium/50 w-2/3" />
                    <div className="flex-1 rounded-lg bg-ivorylight/50 border border-kraft/10 mt-1" />
                  </div>
                </div>

                {/* Drop overlay */}
                <div
                  ref={overlayRef}
                  className="pointer-events-none absolute inset-0 z-20"
                >
                  {to.name && (
                    <DropChip
                      key={`name-${cycle}`}
                      label="Jan Kowalski"
                      to={to.name}
                      go={drop.name}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                      icon="👤"
                    />
                  )}
                  {to.headline && (
                    <DropChip
                      key={`headline-${cycle}`}
                      label="Frontend Engineer"
                      to={to.headline}
                      go={drop.headline}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                      icon="💼"
                    />
                  )}
                  {to.summary && (
                    <DropChip
                      key={`summary-${cycle}`}
                      label="Podsumowanie"
                      to={to.summary}
                      go={drop.summary}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                      icon="📝"
                      wide
                    />
                  )}
                  {to.skills && (
                    <DropChip
                      key={`skills-${cycle}`}
                      label="Umiejętności"
                      to={to.skills}
                      go={drop.skills}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                      icon="⚡"
                    />
                  )}
                  {to.experience && (
                    <DropChip
                      key={`experience-${cycle}`}
                      label="Doświadczenie"
                      to={to.experience}
                      go={drop.experience}
                      duration={T.dropDuration}
                      stay={T.chipStay}
                      icon="📊"
                    />
                  )}
                </div>

                {/* Glow effect during generation */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                    scene === 3 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-kraft/10 via-transparent to-transparent" />
                </div>
              </div>

              {/* Shadow underneath */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/10 rounded-full blur-xl" />
            </div>
          </div>
        </SceneFrame>

        {/* Scene 4 — GOTOWE */}
        <SceneFrame visible={scene === 4} tone="success">
          <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 xl:gap-8 items-center h-full">
            <div className="text-center xl:text-left flex-shrink-0 w-full xl:w-[280px]">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-feedbacksuccess to-kraft text-white text-xl sm:text-2xl xl:text-4xl mb-2 sm:mb-3 xl:mb-6 shadow-2xl animate-bounce">
                ✓
              </div>
              <h4 className="text-base sm:text-lg xl:text-2xl font-black text-slatedark mb-1 sm:mb-2">
                CV gotowe!
              </h4>
              <p className="text-clouddark mb-2 sm:mb-3 xl:mb-6 text-xs sm:text-sm">
                Twoje spersonalizowane CV jest gotowe do pobrania.
              </p>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 xl:px-6 xl:py-3 rounded-xl bg-gradient-to-r from-kraft to-bookcloth text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm">
                <span>📥</span>
                Pobierz PDF
              </button>
            </div>

            {/* Final CV */}
            <div className="relative flex items-center justify-center flex-1">
              <div
                className="relative rounded-2xl border-2 border-feedbacksuccess/50 bg-white shadow-2xl overflow-hidden ring-4 ring-feedbacksuccess/20 w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] xl:max-w-[350px]"
                style={{
                  aspectRatio: "210/297",
                  animation: "successGlow 2s ease-in-out infinite",
                }}
              >
                {/* Complete CV content */}
                <div className="absolute left-4 right-4 top-4 pb-2 border-b-2 border-kraft/20">
                  <div className="font-black text-base xl:text-lg text-slatedark">
                    Jan Kowalski
                  </div>
                  <div className="text-xs xl:text-sm text-bookcloth font-semibold">
                    Frontend Engineer
                  </div>
                </div>
                <div
                  className="absolute left-4 right-4 text-[10px] xl:text-xs text-slatedark/80 leading-relaxed"
                  style={{ top: "18%" }}
                >
                  Buduję dopracowane UI z naciskiem na wydajność i dostępność.
                </div>
                <div className="absolute left-4 right-4" style={{ top: "28%" }}>
                  <div className="text-[8px] xl:text-[10px] uppercase tracking-wider text-clouddark mb-1 font-bold">
                    Umiejętności
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["React", "TypeScript", "Node.js", "CSS"].map((skill) => (
                      <span
                        key={skill}
                        className="px-1.5 py-0.5 text-[8px] xl:text-[10px] rounded-full bg-kraft/10 text-slatedark font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute left-4 right-4" style={{ top: "40%" }}>
                  <div className="text-[8px] xl:text-[10px] uppercase tracking-wider text-clouddark mb-1 font-bold">
                    Doświadczenie
                  </div>
                  <div className="text-[10px] xl:text-xs text-slatedark font-semibold">
                    Senior Frontend Dev
                  </div>
                  <div className="text-[8px] xl:text-[10px] text-clouddark">
                    TechCorp • 2020-obecnie
                  </div>
                </div>
                <div
                  className="absolute left-4 right-4 bottom-4"
                  style={{ top: "55%" }}
                >
                  <div className="flex flex-col gap-1.5 h-full">
                    <div className="h-2 xl:h-3 rounded bg-ivorymedium/50 w-3/4" />
                    <div className="h-2 xl:h-3 rounded bg-ivorymedium/50 w-1/2" />
                    <div className="h-2 xl:h-3 rounded bg-ivorymedium/50 w-2/3" />
                    <div className="flex-1 rounded-lg bg-ivorylight/50 border border-kraft/10 mt-1" />
                  </div>
                </div>

                {/* Success checkmark overlay */}
                <div className="absolute top-2 right-2 xl:top-3 xl:right-3 w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-feedbacksuccess flex items-center justify-center text-white text-sm xl:text-lg shadow-lg">
                  ✓
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/10 rounded-full blur-xl" />
            </div>
          </div>
        </SceneFrame>
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes successGlow {
          0%, 100% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 4px rgba(34, 197, 94, 0.1); }
          50% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px 8px rgba(34, 197, 94, 0.2); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
}

/* ———— Sub-components ———— */

function StepIndicator({ active, current, label, icon }) {
  return (
    <li
      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-500 ${
        current
          ? "bg-gradient-to-br from-kraft/20 to-bookcloth/20 scale-105 shadow-lg"
          : active
            ? "bg-kraft/5"
            : "bg-transparent"
      }`}
    >
      <span
        className={`text-2xl transition-all duration-300 ${
          current ? "animate-bounce" : ""
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-xs font-bold transition-colors duration-300 ${
          active ? "text-slatedark" : "text-clouddark/50"
        }`}
      >
        {label}
      </span>
      <span
        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
          current
            ? "bg-bookcloth scale-150"
            : active
              ? "bg-kraft"
              : "bg-clouddark/20"
        }`}
      />
    </li>
  );
}

function SceneFrame({ children, visible, tone = "light" }) {
  const tones = {
    light: "bg-ivorylight/50",
    neutral: "bg-ivorymedium/30",
    brand: "bg-gradient-to-br from-manilla/30 to-kraft/10",
    success: "bg-gradient-to-br from-feedbacksuccess/5 to-ivorylight/50",
  }[tone];

  return (
    <div
      className={`absolute inset-0 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0 z-10"
          : "opacity-0 translate-y-4 pointer-events-none z-0"
      }`}
    >
      <div className={`rounded-2xl border border-kraft/10 p-4 sm:p-6 lg:p-8 h-full ${tones}`}>
        {children}
      </div>
    </div>
  );
}

function SceneHint({ children, icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <span className="text-4xl mb-4 animate-pulse">{icon}</span>
      <span className="text-lg text-slatedark/70 font-medium">{children}</span>
    </div>
  );
}

function StepBadge({ step }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-kraft to-bookcloth text-white text-sm font-bold shadow-md">
        {step}
      </span>
      <span className="text-xs uppercase tracking-wider text-clouddark font-semibold">
        Krok {step}
      </span>
    </div>
  );
}

function AnimatedFormField({ label, value, active, done, multiline = false }) {
  return (
    <div
      className={`transition-all duration-500 ${
        active && !done
          ? "ring-2 ring-kraft/50 rounded-xl"
          : done
            ? "opacity-50"
            : ""
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-clouddark mb-1 font-semibold">
        {label}
      </div>
      <div
        className={`rounded-xl border-2 transition-colors duration-300 bg-white px-4 ${
          multiline ? "py-3 min-h-[80px]" : "h-12"
        } flex items-center text-sm font-medium ${
          active && !done ? "border-kraft bg-kraft/5" : "border-kraft/20"
        }`}
      >
        <span
          className={`transition-opacity duration-300 ${done ? "text-slatedark/50" : "text-slatedark"}`}
        >
          {value}
        </span>
        {active && !done && (
          <span className="ml-auto">
            <PulsingDot />
          </span>
        )}
        {done && <span className="ml-auto text-feedbacksuccess">✓</span>}
      </div>
    </div>
  );
}

function RequirementItem({ children, delay = 0 }) {
  return (
    <div
      className="flex items-start gap-3 animate-fadeIn"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-kraft mt-0.5">•</span>
      <span className="text-sm text-slatedark">{children}</span>
    </div>
  );
}

function TypingCursor() {
  return <span className="inline-block w-0.5 h-5 bg-kraft animate-pulse" />;
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-kraft animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function PulsingDot() {
  return (
    <span className="relative inline-flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kraft opacity-40" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-r from-kraft to-bookcloth" />
    </span>
  );
}

function ScanEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-x-0 h-12 bg-gradient-to-b from-kraft/20 via-kraft/10 to-transparent"
        style={{ animation: "scanMove 2s ease-in-out infinite" }}
      />
      <style>{`
        @keyframes scanMove {
          0%, 100% { top: -48px; }
          50% { top: calc(100% + 48px); }
        }
      `}</style>
    </div>
  );
}

/* ———— DropChip Component ———— */
function DropChip({
  label,
  to = { x: 0, y: 0, w: 160, h: 40 },
  go = false,
  duration = 1800,
  stay = 500,
  wide = false,
  icon = "📌",
}) {
  const chipWidth = wide ? Math.max(to.w, 180) : Math.max(to.w, 140);

  const style = {
    left: to.x,
    top: to.y,
    width: chipWidth,
    "--drop-distance": "120px",
    animation: go
      ? `chipDrop ${duration}ms cubic-bezier(.34,1.56,.64,1) forwards,
         chipGlow ${duration * 0.4}ms ${duration * 0.5}ms ease-out forwards,
         chipHold ${stay}ms ${duration}ms linear forwards,
         chipFade 400ms ${duration + stay}ms ease-out forwards`
      : "none",
  };

  return (
    <div
      className="absolute z-30 rounded-xl border-2 border-kraft/40 bg-gradient-to-br from-white via-ivorylight to-white text-slatedark shadow-2xl px-4 h-10 flex items-center gap-2 text-sm font-bold select-none backdrop-blur-sm"
      style={style}
    >
      <span className="text-base">{icon}</span>
      <span className="truncate">{label}</span>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {go && (
          <>
            <span className="absolute w-1 h-1 bg-kraft rounded-full animate-particle1" />
            <span className="absolute w-1 h-1 bg-bookcloth rounded-full animate-particle2" />
            <span className="absolute w-1.5 h-1.5 bg-manilla rounded-full animate-particle3" />
          </>
        )}
      </div>

      <style>{`
        @keyframes chipDrop {
          0% { 
            transform: translateY(calc(-1 * var(--drop-distance))) scale(0.8) rotate(-5deg); 
            opacity: 0; 
            filter: blur(4px);
          }
          40% { 
            transform: translateY(10px) scale(1.08) rotate(2deg); 
            opacity: 1; 
            filter: blur(0);
          }
          60% { transform: translateY(-8px) scale(0.96) rotate(-1deg); }
          80% { transform: translateY(4px) scale(1.02) rotate(0.5deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes chipGlow {
          0% { box-shadow: 0 10px 40px rgba(166, 124, 82, 0.2); }
          50% { box-shadow: 0 10px 40px rgba(166, 124, 82, 0.4), 0 0 60px rgba(166, 124, 82, 0.3); }
          100% { box-shadow: 0 10px 40px rgba(166, 124, 82, 0.2); }
        }
        @keyframes chipHold {
          from { opacity: 1; }
          to { opacity: 1; }
        }
        @keyframes chipFade {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9) translateY(-8px); filter: blur(2px); }
        }
        @keyframes particle1 {
          0% { top: 50%; left: 20%; opacity: 1; }
          100% { top: -20px; left: 0%; opacity: 0; transform: scale(0); }
        }
        @keyframes particle2 {
          0% { top: 50%; left: 50%; opacity: 1; }
          100% { top: -30px; left: 70%; opacity: 0; transform: scale(0); }
        }
        @keyframes particle3 {
          0% { top: 50%; left: 80%; opacity: 1; }
          100% { top: -25px; left: 100%; opacity: 0; transform: scale(0); }
        }
        .animate-particle1 { animation: particle1 0.8s ease-out forwards; }
        .animate-particle2 { animation: particle2 0.9s ease-out 0.1s forwards; }
        .animate-particle3 { animation: particle3 0.7s ease-out 0.05s forwards; }
      `}</style>
    </div>
  );
}
