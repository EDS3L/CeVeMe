import React, { useEffect, useRef } from 'react'; // <--- 1. Dodano useRef
import { FONT_STACKS } from './fonts';

function Row({ label, children }) {
  return (
    <label className="grid grid-cols-[90px_1fr] gap-2 items-center mb-2">
      <span className="text-xs text-slate-500">{label}</span>
      <div>{children}</div>
    </label>
  );
}

export default function InspectorPanel({ node, updateNode, removeNode }) {
  // <--- 2. Stworzenie refa
  const originalFontRef = useRef(null);

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

  // <--- 3. Efekt czyszczący ref przy zmianie węzła
  useEffect(() => {
    // Resetuj stan podglądu czcionki, jeśli zmieni się węzeł
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

          {/* Popularne fonty: LISTA z hover-apply (bez osobnego podglądu) */}
          <Row label="Popularne">
            {/* <--- 6. Dodano onMouseLeave do kontenera */}
            <div
              className="rounded-lg border border-black/10 p-1 max-h-56 overflow-auto"
              onMouseLeave={() => {
                // Jeśli ref nie jest pusty (był podgląd, ale nie było kliknięcia)
                if (originalFontRef.current !== null) {
                  // Przywróć oryginalną czcionkę
                  updateNode(node.id, {
                    textStyle: { fontFamily: originalFontRef.current },
                  });
                  originalFontRef.current = null; // Wyczyść ref
                }
              }}
            >
              <ul className="grid grid-cols-1 gap-1">
                {FONT_STACKS.map(({ label, stack }) => (
                  <li key={label}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                        (ts.label || '').toLowerCase() === stack.toLowerCase()
                          ? 'bg-blue-100'
                          : ''
                      }`}
                      style={{
                        // etykieta może być w swojej rodzinie – to nie jest osobny „podgląd”, tylko wygląd opcji
                        fontFamily: stack,
                      }}
                      title={stack}
                      // <--- 4. Zmodyfikowano onMouseEnter
                      onMouseEnter={() => {
                        // Zapisz oryginalną czcionkę tylko przy pierwszym najechaniu
                        if (originalFontRef.current === null) {
                          originalFontRef.current = ts.fontFamily || '';
                        }
                        // Zastosuj podgląd
                        updateNode(node.id, {
                          textStyle: { fontFamily: stack },
                        });
                      }}
                      // <--- 5. Zmodyfikowano onClick
                      onClick={() => {
                        // Zastosuj zmianę
                        updateNode(node.id, {
                          textStyle: { fontFamily: stack },
                        });
                        // "Zatwierdź" zmianę, czyszcząc ref
                        // (zapobiega to przywróceniu przez onMouseLeave)
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

          {/* Ręczne wpisanie stacku (opcjonalne) */}
          <Row label="Czcionka">
            <input
              className={inputBase}
              value={ts.fontFamily || ''}
              onChange={(e) =>
                updateNode(node.id, {
                  textStyle: { originalFontRef: e.target.value },
                })
              }
              placeholder="np. Arial, Helvetica, sans-serif"
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
          <Row label="Grubość Tekstu">
            <input
              className={inputBase}
              type="range"
              min={300}
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
              value={ts.align || 'left'}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { align: e.target.value } })
              }
            >
              <option>left</option>
              <option>center</option>
              <option>right</option>
              <option>justify</option>
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
