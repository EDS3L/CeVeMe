import React, { useEffect, useRef, useCallback } from 'react';

function Row({ label, children }) {
  return (
    <label className="grid grid-cols-[90px_1fr] gap-2 items-center mb-2">
      <span className="text-xs text-slate-500">{label}</span>
      <div>{children}</div>
    </label>
  );
}

/**
 * Props:
 * - node:           aktualnie fokusowany node (ostatni zaznaczony)
 * - updateNode:     (id, patch)
 * - removeNode:     (id) => void
 * - activeGroupIds: array id-ów, jeżeli mamy aktywną grupę (>=2)
 */
export default function InspectorPanel({
  node,
  updateNode,
  removeNode,
  activeGroupIds = null,
}) {
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  // ——— helper: sprawdź czy użytkownik jest w polu tekstowym/edytowalnym
  const isEditable = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (el.isContentEditable) return true;
    if (el.closest?.('[contenteditable="true"]')) return true;
    if (el.getAttribute?.('role') === 'textbox') return true;
    return false;
  };

  // ——— usuwanie selekcji (pojedynczy albo cała grupa)
  const deleteSelection = useCallback(() => {
    const isGroup = Array.isArray(activeGroupIds) && activeGroupIds.length >= 2;
    if (isGroup) {
      // usuń wszystkie z grupy
      for (const id of activeGroupIds) removeNode(id);
    } else if (node) {
      removeNode(node.id);
    }
  }, [activeGroupIds, node, removeNode]);

  // ——— DEL/Backspace poza inputami usuwa pojedynczy / grupę
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const active = document.activeElement;
      if (isEditable(active)) return;

      // nie kasuj, jeśli jest zaznaczenie tekstu w dokumencie
      const sel = window.getSelection?.();
      if (sel && !sel.isCollapsed) return;

      // jeśli nie ma nic zaznaczonego, nic nie rób
      const hasGroup =
        Array.isArray(activeGroupIds) && activeGroupIds.length >= 2;
      if (!hasGroup && !node) return;

      e.preventDefault();
      deleteSelection();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeGroupIds, node, deleteSelection]);

  // sprzątanie blobów
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  if (!node && !(Array.isArray(activeGroupIds) && activeGroupIds.length >= 2)) {
    return (
      <aside className="sticky top-14 self-start w-[320px] shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-black/10 bg-white p-3">
        <div className="text-slate-500">Brak zaznaczenia</div>
      </aside>
    );
  }

  const f = node?.frame || {};
  const st = node?.style || {};
  const num = (v) => (typeof v === 'number' ? v : 0);

  const setSrcFromFile = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      updateNode(node.id, { src: String(dataUrl) });
    } catch {
      const url = URL.createObjectURL(file);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      updateNode(node.id, { src: url });
    }
  };

  const isGroup = Array.isArray(activeGroupIds) && activeGroupIds.length >= 2;

  return (
    <aside className="sticky top-14 self-start w-[320px] shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-black/10 bg-white p-3">
      <div className="font-bold mb-2">Właściwości</div>

      {/* Gdy wybrana grupa — pokazujemy skrót i przycisk kasowania grupy */}
      {isGroup && (
        <div className="mb-3 p-2 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-600">
          Wybrano <b>{activeGroupIds.length}</b> elementy/ów (grupa).
        </div>
      )}

      {/* Panel geometrii tylko dla pojedynczego node'a */}
      {!isGroup && node && (
        <>
          <Row label="X (mm)">
            <input
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
              type="number"
              value={num(f.x)}
              onChange={(e) =>
                updateNode(node.id, { frame: { x: +e.target.value } })
              }
            />
          </Row>
          <Row label="Y (mm)">
            <input
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
              type="number"
              value={num(f.y)}
              onChange={(e) =>
                updateNode(node.id, { frame: { y: +e.target.value } })
              }
            />
          </Row>
          <Row label="Szer. (mm)">
            <input
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
              type="number"
              value={num(f.w)}
              onChange={(e) =>
                updateNode(node.id, {
                  frame: { w: Math.max(5, +e.target.value) },
                })
              }
            />
          </Row>
          <Row label="Wys. (mm)">
            <input
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
              type="number"
              value={num(f.h)}
              onChange={(e) =>
                updateNode(node.id, {
                  frame: { h: Math.max(5, +e.target.value) },
                })
              }
            />
          </Row>
        </>
      )}

      {/* Obraz */}
      {!isGroup && node?.type === 'image' && (
        <>
          <hr className="my-3 border-black/10" />
          <Row label="URL">
            <input
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
              value={node.src || ''}
              onChange={(e) => updateNode(node.id, { src: e.target.value })}
              placeholder="https://... lub data:/blob:"
            />
          </Row>
          <Row label="Wgraj plik">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  await setSrcFromFile(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                className="px-3 py-2 rounded-lg border border-black/10 bg-white text-sm hover:bg-slate-50"
                onClick={() => fileInputRef.current?.click()}
              >
                Wybierz obraz…
              </button>
            </div>
          </Row>
          <Row label="Dopasowanie">
            <select
              className="px-2 py-[6px] text-sm rounded-lg border border-black/10 bg-white outline-none focus:ring-2 focus:ring-blue-500/40"
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
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
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

      {/* Kształt */}
      {!isGroup && node?.type === 'shape' && (
        <>
          <hr className="my-3 border-black/10" />
          <Row label="Wypełnienie">
            <input
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
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
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
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
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
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
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
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
              className="w-full rounded-lg border border-black/10 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
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
      <button
        onClick={deleteSelection}
        className="w-full px-3 py-2 rounded-lg border border-red-500 bg-red-100 text-red-700 font-semibold"
      >
        {isGroup ? 'Usuń grupę' : 'Usuń element'}
      </button>
    </aside>
  );
}
