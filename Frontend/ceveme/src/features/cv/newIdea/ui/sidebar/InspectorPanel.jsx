import React from 'react';

function Row({ label, children }) {
  return (
    <label
      style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr',
        gap: 8,
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
      <div>{children}</div>
    </label>
  );
}

export default function InspectorPanel({ node, updateNode, removeNode }) {
  if (!node) return <div style={{ color: '#64748b' }}>Brak zaznaczenia</div>;

  const f = node.frame || {};
  const ts = node.textStyle || {};
  const st = node.style || {};

  const num = (v) => (typeof v === 'number' ? v : 0);

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Właściwości</div>

      <Row label="X (mm)">
        <input
          type="number"
          value={num(f.x)}
          onChange={(e) =>
            updateNode(node.id, { frame: { x: +e.target.value } })
          }
        />
      </Row>
      <Row label="Y (mm)">
        <input
          type="number"
          value={num(f.y)}
          onChange={(e) =>
            updateNode(node.id, { frame: { y: +e.target.value } })
          }
        />
      </Row>
      <Row label="Szer. (mm)">
        <input
          type="number"
          value={num(f.w)}
          onChange={(e) =>
            updateNode(node.id, { frame: { w: Math.max(5, +e.target.value) } })
          }
        />
      </Row>
      <Row label="Wys. (mm)">
        <input
          type="number"
          value={num(f.h)}
          onChange={(e) =>
            updateNode(node.id, { frame: { h: Math.max(5, +e.target.value) } })
          }
        />
      </Row>
      <Row label="Rotacja (°)">
        <input
          type="number"
          value={num(f.rotation || 0)}
          onChange={(e) =>
            updateNode(node.id, { frame: { rotation: +e.target.value } })
          }
        />
      </Row>

      {node.type === 'text' && (
        <>
          <hr style={{ margin: '10px 0' }} />
          <Row label="Tekst">
            <textarea
              rows={3}
              value={node.text || ''}
              onChange={(e) => updateNode(node.id, { text: e.target.value })}
            />
          </Row>
          <Row label="Czcionka">
            <input
              value={ts.fontFamily || ''}
              onChange={(e) =>
                updateNode(node.id, {
                  textStyle: { fontFamily: e.target.value },
                })
              }
            />
          </Row>
          <Row label="Rozmiar (pt)">
            <input
              type="number"
              value={num(ts.fontSize || 12)}
              onChange={(e) =>
                updateNode(node.id, {
                  textStyle: { fontSize: +e.target.value },
                })
              }
            />
          </Row>
          <Row label="Waga">
            <input
              type="number"
              value={num(ts.fontWeight || 400)}
              onChange={(e) =>
                updateNode(node.id, {
                  textStyle: { fontWeight: +e.target.value },
                })
              }
            />
          </Row>
          <Row label="Kolor">
            <input
              type="color"
              value={ts.color || '#0f172a'}
              onChange={(e) =>
                updateNode(node.id, { textStyle: { color: e.target.value } })
              }
            />
          </Row>
          <Row label="Wyrównanie">
            <select
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
          <hr style={{ margin: '10px 0' }} />
          <Row label="URL">
            <input
              value={node.src || ''}
              onChange={(e) => updateNode(node.id, { src: e.target.value })}
            />
          </Row>
          <Row label="Dopasowanie">
            <select
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
          <hr style={{ margin: '10px 0' }} />
          <Row label="Wypełnienie">
            <input
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

      <hr style={{ margin: '10px 0' }} />
      <button
        onClick={() => removeNode(node.id)}
        style={{
          width: '100%',
          padding: '8px 10px',
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: 6,
          color: '#991b1b',
          fontWeight: 600,
        }}
      >
        Usuń element
      </button>
    </div>
  );
}
