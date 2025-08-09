import { useEffect, useLayoutEffect, useRef, useState } from 'react';

function measurePxPerMm() {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.height = '100mm';
  probe.style.width = '100mm';
  probe.style.padding = '0';
  probe.style.border = '0';
  document.body.appendChild(probe);
  const rect = probe.getBoundingClientRect();
  document.body.removeChild(probe);
  return (rect.height + rect.width) / 2 / 100 || 3.7795;
}

/**
 * Dokładne dopasowanie do strony A4:
 * - Szukamy współczynnika f, ustawiamy el.style.width = (widthMm * f) i transform: scale(1/f),
 * - tak aby po skali finalny rozmiar był EXACT 210×297 mm (bez „białych pasów”).
 * - Bezpieczne dla fontów/obrazków; reaguje na zmiany rozmiaru treści.
 *
 * Zwraca: { scale, tx, ty, recomputeNow } — tx/ty = 0 (nie potrzebujemy przesunięć).
 */
export function useSinglePageScale(
  ref,
  {
    widthMm = 210,
    heightMm = 297,
    minF = 1, // minimalny mnożnik szerokości przed skalą
    maxF = 4, // maksymalny mnożnik (gdyby treść była bardzo długa)
    iterations = 14, // dokładność dopasowania
  } = {}
) {
  const [state, setState] = useState({ scale: 1, tx: 0, ty: 0 });
  const pxPerMmRef = useRef(3.7795);
  const roRef = useRef(null);

  const measureFinalHeightPx = (el, f) => {
    const prevTransform = el.style.transform;
    const prevWidth = el.style.width;

    // ustaw szerokość przed pomiarem (reflow)
    el.style.transform = 'none';
    el.style.width = `${widthMm * f}mm`;

    // wysokość w px przy tej szerokości (przed skalą)
    const hPx = el.scrollHeight;

    // przy skali 1/f finalny H = hPx / f
    const finalHPx = hPx / f;

    // przywróć poprzednie (niekonieczne, ale czytelniejsze)
    el.style.transform = prevTransform;
    // szerokość zostawimy i tak nadpisując na końcu dla wybranego f,
    // ale przy pomiarach przywróćmy, żeby uniknąć flikeru
    el.style.width = prevWidth;

    return finalHPx;
  };

  const computeExact = () => {
    const el = ref.current;
    if (!el) return;

    const pxPerMm = pxPerMmRef.current;
    const targetWpx = widthMm * pxPerMm;
    const targetHpx = heightMm * pxPerMm;

    // 1) znajdź górne ograniczenie f tak, aby finalna wysokość <= target
    let low = minF;
    let high = Math.max(minF, 1);
    let finalH = measureFinalHeightPx(el, high);

    let guard = 0;
    while (finalH > targetHpx && high < maxF && guard < 20) {
      low = high;
      high *= 1.35; // rośnij wykładniczo
      finalH = measureFinalHeightPx(el, high);
      guard++;
    }
    if (high > maxF) high = maxF;

    // 2) binary search po f
    for (let i = 0; i < iterations; i++) {
      const mid = (low + high) / 2;
      const h = measureFinalHeightPx(el, mid);
      if (h > targetHpx) {
        low = mid; // za wysokie – zwiększ f
      } else {
        high = mid; // mieści się – próbuj ciaśniej
      }
    }
    const f = high;
    const scale = 1 / f;

    // ustaw finalnie szerokość i skalę
    el.style.width = `${widthMm * f}mm`;
    el.style.transform = `scale(${scale})`; // ustaw od razu, aby podgląd był aktualny
    el.style.transformOrigin = 'top left';

    // brak przesunięć – wypełniamy całą stronę
    setState({ scale, tx: 0, ty: 0 });
  };

  useLayoutEffect(() => {
    pxPerMmRef.current = measurePxPerMm();
    const ready = document?.fonts?.ready;
    if (ready && typeof ready.then === 'function') {
      ready.then(() => computeExact()).catch(() => computeExact());
    } else {
      computeExact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (roRef.current) roRef.current.disconnect();
    roRef.current = new ResizeObserver(() => {
      requestAnimationFrame(computeExact);
    });
    roRef.current.observe(el);
    return () => roRef.current && roRef.current.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return { ...state, recomputeNow: computeExact };
}
