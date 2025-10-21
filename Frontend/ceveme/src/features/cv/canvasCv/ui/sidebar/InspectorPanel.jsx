import React, { useEffect, useRef } from 'react';
import { FONT_STACKS } from './fonts';
import { ensureGoogleFont } from './googleFontsLoader';

/* Prosty helper do debounce, żeby nie odpalać wielu pobrań fontu
   przy szybkim przejechaniu myszką po liście. */
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

export default function InspectorPanel({ node, updateNode, removeNode }) {
  const originalFontRef = useRef(null);

  // debounce'owany loader podglądu
  const previewHover = useRef(null);
  if (!previewHover.current) {
    previewHover.current = debounce(async (stack, weight, italic, apply) => {
      const family = String(stack)
        .split(',')[0]
        ?.replace(/(^"|"$)/g, '')
        .trim();
      if (!family) return apply();
      try {
        await ensureGoogleFont(
          family,
          [typeof weight === 'number' ? weight : 400, 700],
          italic === 'italic'
        );
      } catch {}
      apply();
    }, 160);
  }

  // kasowanie elementu DEL/Backspace poza inputami
  useEffect(() => {
    const isEditableTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select')
        return true;
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

  // reset podglądu przy zmianie węzła
  useEffect(() => {
    originalFontRef.current = null;
  }, [node?.id]);

  if (!node) return <div className="text-slate-500">Brak zaznaczenia</div>;

  const f = node.frame || {};
  const ts = node.textStyle || {};
  const st = node.style || {};
  const num = (v) => (typeof v === 'number' ? v : 0);

  const inputBase =
    'w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40';
  const btnDanger =
    'w-full px-3 py-2 rounded-lg border border-red-500 bg-red-100 text-red-700 font-semibold';

  // Wyciągamy pierwszą rodzinę z font-family (do ładowania)
  const currentFamily = (ts.fontFamily || '')
    .split(',')[0]
    ?.replace(/(^"|"$)/g, '')
    .trim();
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

          {/* Popularne (tylko Google Fonts) */}
          <Row label="Google Fonts">
            <div
              className="rounded-lg border border-black/10 p-1 max-h-56 overflow-auto"
              onMouseLeave={() => {
                if (originalFontRef.current !== null) {
                  updateNode(node.id, {
                    textStyle: { fontFamily: originalFontRef.current },
                  });
                  originalFontRef.current = null;
                }
              }}
            >
              <ul className="grid grid-cols-1 gap-1">
                {FONT_STACKS.map(({ label, family, stack }) => (
                  <li key={label}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded hover:bg-blue-50 focus:bg-blue-50 focus:outline-none`}
                      style={{ fontFamily: stack }}
                      title={stack}
                      onMouseEnter={() => {
                        if (originalFontRef.current === null) {
                          originalFontRef.current = ts.fontFamily || '';
                        }
                        previewHover.current(
                          stack,
                          currentWeight,
                          currentItalic,
                          () =>
                            updateNode(node.id, {
                              textStyle: { fontFamily: stack },
                            })
                        );
                      }}
                      onClick={async () => {
                        try {
                          await ensureGoogleFont(
                            family,
                            [currentWeight, 700],
                            currentItalic === 'italic'
                          );
                        } catch {}
                        updateNode(node.id, {
                          textStyle: { fontFamily: stack },
                        });
                        originalFontRef.current = null;
                      }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Row>

          {/* Ręczne wpisanie (stack) */}
          <Row label="Czcionka">
            <input
              className={inputBase}
              value={ts.fontFamily || ''}
              onChange={(e) =>
                updateNode(node.id, {
                  textStyle: { fontFamily: e.target.value },
                })
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
                updateNode(node.id, {
                  textStyle: { fontSize: +e.target.value },
                })
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
                updateNode(node.id, {
                  textStyle: { fontWeight: +e.target.value },
                })
              }
            />
          </Row>

          <Row label="Kursywa">
            <select
              className={inputBase}
              value={ts.fontStyle || 'normal'}
              onChange={(e) =>
                updateNode(node.id, {
                  textStyle: { fontStyle: e.target.value },
                })
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
                updateNode(node.id, {
                  textStyle: { textAlign: e.target.value },
                })
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
                updateNode(node.id, {
                  textStyle: { lineHeight: +e.target.value },
                })
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
              onChange={(e) =>
                updateNode(node.id, { objectFit: e.target.value })
              }
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
                updateNode(node.id, {
                  style: { cornerRadius: +e.target.value },
                })
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
                    fill: {
                      ...(st.fill || {}),
                      color: e.target.value,
                      opacity: st.fill?.opacity ?? 1,
                    },
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
                updateNode(node.id, {
                  style: {
                    fill: { ...(st.fill || {}), opacity: +e.target.value },
                  },
                })
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
                updateNode(node.id, {
                  style: {
                    stroke: { ...(st.stroke || {}), width: +e.target.value },
                  },
                })
              }
            />
          </Row>
          <Row label="Promień (mm)">
            <input
              className={inputBase}
              type="number"
              value={st.cornerRadius || 0}
              onChange={(e) =>
                updateNode(node.id, {
                  style: { cornerRadius: +e.target.value },
                })
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
