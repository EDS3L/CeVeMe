import React, { useEffect, useRef, useState } from 'react';
import { FONT_STACKS } from './fonts';
import { ensureGoogleFont } from './googleFontsLoader';
import { ensureGoogleFontPreview } from './googleFontsPreviewLoader';

function debounce(fn, ms = 180) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function Row({ label, children }) {
  return (
    <label className="grid grid-cols-[90px_1fr] gap-2 items-center mb-2">
      <span className="text-xs text-slate-500">{label}</span>
      <div>{children}</div>
    </label>
  );
}

// Krótki, realny sample PL/EN — pokryty subsetem z loadera preview
const PREVIEW_TEXT = 'Zażółć gęślą jaźń — 123';

function FontItem({ family, label, stack, currentWeight, currentItalic, onPick, rootEl }) {
  const [ready, setReady] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer;
    const loadPreview = debounce(async () => {
      try {
        // 1) Najpierw LEKKI subset do natychmiastowego, wiernego podglądu
        await ensureGoogleFontPreview(family, {
          weight: typeof currentWeight === 'number' ? currentWeight : 400,
          italic: currentItalic === 'italic',
          // ⬇️ bardzo ważne: etykieta + sample => glify na pewno są w subsecie
          text: `${label} ${PREVIEW_TEXT}`,
        });
        setReady(true);

        // 2) W tle PREFETCH pełnego 400 normal — żeby klik był natychmiastowy
        // (bez await — nie blokujemy UI; italic false, bo to najczęstszy przypadek)
        ensureGoogleFont(family, [400], false).catch(() => {});
      } catch {}
    }, 10);

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              loadPreview();
              observer.disconnect();
            }
          });
        },
        { root: rootEl || null, rootMargin: '120px 0px', threshold: 0.01 }
      );
      observer.observe(el);
      return () => observer && observer.disconnect();
    } else {
      // bez IO – ładuj od razu
      loadPreview();
      return () => {};
    }
  }, [family, currentWeight, currentItalic, label, rootEl]);

  // dodatkowo — na hover dociągnij warianty, które mogą być potrzebne po kliknięciu
  const prefetchOnHover = async () => {
    try {
      const wantItalic = currentItalic === 'italic';
      const wantWeights = [
        typeof currentWeight === 'number' ? currentWeight : 400,
        700,
      ];
      // Jeżeli 400 już jest (prefetch z IO), to dociągniemy szybko brakujące
      ensureGoogleFont(family, wantWeights, wantItalic).catch(() => {});
    } catch {}
  };

  const fallbackStack = stack.split(',').slice(1).join(',').trim() || 'inherit';

  return (
    <li>
      <button
        ref={ref}
        type="button"
        className="w-full text-left px-2 py-2 rounded hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
        onMouseEnter={prefetchOnHover}
        onFocus={prefetchOnHover}
        onClick={onPick}
        title={stack}
      >
        {/* Linia 1: etykieta (nie musi być w kroju; to label) */}
        <div className="text-[11px] leading-4 text-slate-500">{label}</div>
        {/* Linia 2: mini-sample w docelowym kroju — od razu po preview */}
        <div
          className="text-sm leading-tight"
          style={{ fontFamily: ready ? stack : fallbackStack }}
        >
          {PREVIEW_TEXT}
        </div>
      </button>
    </li>
  );
}

export default function InspectorPanel({ node, updateNode, removeNode }) {
  const listRootRef = useRef(null);

  // kasowanie elementu DEL/Backspace poza inputami
  useEffect(() => {
    const isEditableTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if (el.isContentEditable) return true;
      if (el.closest?.('[contenteditable="true"]')) return true;
      if (el.getAttribute?.('role') === 'textbox') return true;
      return false;
    };

    const handleKeyDelete = (e) => {
      if (!node) return;
      if (e.key !== 'Backspace' && e.key !== 'Delete') return;
      const active = document.activeElement;
      if (isEditableTarget(active)) return;
      const sel = window.getSelection?.();
      if (sel && !sel.isCollapsed) return;
      e.preventDefault();
      removeNode(node.id);
    };

    window.addEventListener('keydown', handleKeyDelete);
    return () => window.removeEventListener('keydown', handleKeyDelete);
  }, [node, removeNode]);

  if (!node) return <div className="text-slate-500">Brak zaznaczenia</div>;

  const f = node.frame || {};
  const ts = node.textStyle || {};
  const st = node.style || {};
  const num = (v) => (typeof v === 'number' ? v : 0);

  const inputBase =
    'w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40';
  const btnDanger =
    'w-full px-3 py-2 rounded-lg border border-red-500 bg-red-100 text-red-700 font-semibold';

  const currentWeight = typeof ts.fontWeight === 'number' ? ts.fontWeight : 400;
  const currentItalic = ts.fontStyle === 'italic' ? 'italic' : 'normal';

  return (
    <div>
      <div className="font-bold mb-2">Właściwości</div>

      <Row label="X (mm)">
        <input
          className={inputBase}
          type="number"
          value={num(f.x)}
          onChange={(e) =>
            updateNode(node.id, { frame: { x: +e.target.value } })
          }
        />
      </Row>
      <Row label="Y (mm)">
        <input
          className={inputBase}
          type="number"
          value={num(f.y)}
          onChange={(e) =>
            updateNode(node.id, { frame: { y: +e.target.value } })
          }
        />
      </Row>
      <Row label="Szer. (mm)">
        <input
          className={inputBase}
          type="number"
          value={num(f.w)}
          onChange={(e) =>
            updateNode(node.id, { frame: { w: Math.max(5, +e.target.value) } })
          }
        />
      </Row>
      <Row label="Wys. (mm)">
        <input
          className={inputBase}
          type="number"
          value={num(f.h)}
          onChange={(e) =>
            updateNode(node.id, { frame: { h: Math.max(5, +e.target.value) } })
          }
        />
      </Row>
      <Row label="Rotacja (°)">
        <input
          className={inputBase}
          type="number"
          value={num(f.rotation || 0)}
          onChange={(e) =>
            updateNode(node.id, { frame: { rotation: +e.target.value } })
          }
        />
      </Row>

      {node.type === 'text' && (
        <>
          <hr className="my-3 border-black/10" />

          {/* Google Fonts — podgląd: subset + natychmiastowe sample, prefetch 400 normal */}
          <Row label="Google Fonts">
            <div
              ref={listRootRef}
              className="rounded-lg border border-black/10 p-1 max-h-56 overflow-auto"
            >
              <ul className="grid grid-cols-1 gap-1">
                {FONT_STACKS.map(({ label, family, stack }) => (
                  <FontItem
                    key={label}
                    label={label}
                    family={family}
                    stack={stack}
                    currentWeight={currentWeight}
                    currentItalic={currentItalic}
                    rootEl={listRootRef.current}
                    onPick={async () => {
                      try {
                        // Po kliknięciu mamy już 400 w cache; dociągnij brakujące warianty i dopiero ustaw rodzinę
                        await ensureGoogleFont(
                          family,
                          [currentWeight, 700],
                          currentItalic === 'italic'
                        );
                      } catch {}
                      updateNode(node.id, { textStyle: { fontFamily: stack } });
                    }}
                  />
                ))}
              </ul>
            </div>
          </Row>

          <Row label="Czcionka">
            <input
              className={inputBase}
              value={ts.fontFamily || ''}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { fontFamily: e.target.value } })
              }
              placeholder='np. "Inter", system-ui, -apple-system, sans-serif'
            />
          </Row>

          <Row label="Rozmiar (pt)">
            <input
              className={inputBase}
              type="number"
              value={num(ts.fontSize || 12)}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { fontSize: +e.target.value } })
              }
            />
          </Row>

          <Row label="Grubość">
            <input
              className={inputBase}
              type="range"
              min={100}
              max={900}
              step={100}
              value={typeof ts.fontWeight === 'number' ? ts.fontWeight : 400}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { fontWeight: +e.target.value } })
              }
            />
          </Row>

          <Row label="Kursywa">
            <select
              className={inputBase}
              value={ts.fontStyle || 'normal'}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { fontStyle: e.target.value } })
              }
            >
              <option value="normal">normal</option>
              <option value="italic">italic</option>
            </select>
          </Row>

          <Row label="Kolor">
            <input
              className={inputBase}
              type="color"
              value={ts.color || '#0f172a'}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { color: e.target.value } })
              }
            />
          </Row>

          <Row label="Wyrównanie">
            <select
              className={inputBase}
              value={ts.textAlign || 'left'}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { textAlign: e.target.value } })
              }
            >
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
              <option value="justify">justify</option>
            </select>
          </Row>

          <Row label="Interlinia">
            <input
              className={inputBase}
              type="number"
              step="0.05"
              value={ts.lineHeight || 1.3}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { lineHeight: +e.target.value } })
              }
            />
          </Row>

          <Row label="Link (URL)">
            <input
              className={inputBase}
              value={node.link || ''}
              onChange={(e) => updateNode(node.id, { link: e.target.value })}
              placeholder="https://..."
            />
          </Row>
        </>
      )}

      {node.type === 'image' && (
        <>
          <hr className="my-3 border-black/10" />
          <Row label="URL">
            <input
              className={inputBase}
              value={node.src || ''}
              onChange={(e) => updateNode(node.id, { src: e.target.value })}
            />
          </Row>
          <Row label="Dopasowanie">
            <select
              className={inputBase}
              value={node.objectFit || 'cover'}
              onChange={(e) => updateNode(node.id, { objectFit: e.target.value })}
            >
              <option>cover</option>
              <option>contain</option>
              <option>fill</option>
              <option>none</option>
              <option>scale-down</option>
            </select>
          </Row>
          <Row label="Zaokr. (mm)">
            <input
              className={inputBase}
              type="number"
              value={st.cornerRadius || 0}
              onChange={(e) =>
                updateNode(node.id, { style: { cornerRadius: +e.target.value } })
              }
            />
          </Row>
        </>
      )}

      {node.type === 'shape' && (
        <>
          <hr className="my-3 border-black/10" />
          <Row label="Wypełnienie">
            <input
              className={inputBase}
              type="color"
              value={st.fill?.color || '#e2e8f0'}
              onChange={(e) =>
                updateNode(node.id, {
                  style: {
                    fill: { ...(st.fill || {}), color: e.target.value, opacity: st.fill?.opacity ?? 1 },
                  },
                })
              }
            />
          </Row>
          <Row label="Krycie">
            <input
              className={inputBase}
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={st.fill?.opacity ?? 1}
              onChange={(e) =>
                updateNode(node.id, { style: { fill: { ...(st.fill || {}), opacity: +e.target.value } } })
              }
            />
          </Row>
          <Row label="Obrys kol.">
            <input
              className={inputBase}
              type="color"
              value={st.stroke?.color || '#94a3b8'}
              onChange={(e) =>
                updateNode(node.id, {
                  style: {
                    stroke: {
                      ...(st.stroke || {}),
                      color: e.target.value,
                      width: st.stroke?.width ?? 0.6,
                      dash: st.stroke?.dash || [],
                    },
                  },
                })
              }
            />
          </Row>
          <Row label="Obrys (mm)">
            <input
              className={inputBase}
              type="number"
              step="0.1"
              value={st.stroke?.width ?? 0.6}
              onChange={(e) =>
                updateNode(node.id, { style: { stroke: { ...(st.stroke || {}), width: +e.target.value } } })
              }
            />
          </Row>
          <Row label="Promień (mm)">
            <input
              className={inputBase}
              type="number"
              value={st.cornerRadius || 0}
              onChange={(e) =>
                updateNode(node.id, { style: { cornerRadius: +e.target.value } })
              }
            />
          </Row>
        </>
      )}

      <hr className="my-3 border-black/10" />
      <button onClick={() => removeNode(node.id)} className={btnDanger}>
        Usuń element
      </button>
    </div>
  );
}
