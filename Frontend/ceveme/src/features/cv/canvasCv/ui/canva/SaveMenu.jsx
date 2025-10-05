import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

function UsePortal() {
  // bezpieczny root do portali
  const root = useMemo(() => {
    let el = document.getElementById('__cv-portal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = '__cv-portal-root';
      document.body.appendChild(el);
    }
    return el;
  }, []);
  return root;
}

export default function SaveMenu({
  disabled = false,
  onGeneratePdf,
  onGenerateAndSave,
  onPrint,
  buttonLabel = 'Zapisz',
}) {
  const portalRoot = UsePortal();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 0,
  });

  // wylicz pozycję panelu względem przycisku — zawsze PONIŻEJ i PRAWO-wyrównany
  const recalc = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setPos({
      top: r.top + window.scrollY,
      left: r.left + window.scrollX,
      bottom: r.bottom + window.scrollY,
      right: r.right + window.scrollX,
      height: r.height,
    });
  };

  useLayoutEffect(() => {
    if (open) recalc();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      // zamknij, jeśli klik poza
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onWin = () => recalc();

    // nasłuchy na całe okno, także scroll w zagnieżdżeniach
    window.addEventListener('mousedown', onDown, true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);

    return () => {
      window.removeEventListener('mousedown', onDown, true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
  }, [open]);

  // Pojedyncza pozycja z tooltipem (chmurką)
  const Item = ({ label, hint, onClick }) => (
    <button
      className="relative group w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
      onClick={() => {
        setOpen(false);
        onClick && onClick();
      }}
    >
      {label}
      {/* chmurka */}
      <span
        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity
                   whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded shadow z-[1000002]"
        role="tooltip"
      >
        {hint}
      </span>
    </button>
  );

  return (
    <>
      <button
        ref={btnRef}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold border border-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
        aria-expanded={open ? 'true' : 'false'}
        aria-haspopup="menu"
      >
        {buttonLabel}
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[1000001]"
            style={{
              top: pos.bottom + 8,
              left: pos.right,
              transform: 'translateX(-100%)',
            }}
          >
            <div className="w-56 rounded-lg border border-black/10 bg-white shadow-xl overflow-hidden">
              <Item
                label="Generuj PDF"
                hint="Wygeneruje plik PDF i pobierze go na dysk."
                onClick={onGeneratePdf}
              />
              <div className="h-px bg-black/10" />
              <Item
                label="Generuj i zapisz"
                hint="Wygeneruje PDF, wyśle go na serwer i doda do historii."
                onClick={onGenerateAndSave}
              />
              <div className="h-px bg-black/10" />
              <Item
                label="Drukuj"
                hint="Otworzy PDF w nowym oknie — możesz go natychmiast wydrukować."
                onClick={onPrint}
              />
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
}
