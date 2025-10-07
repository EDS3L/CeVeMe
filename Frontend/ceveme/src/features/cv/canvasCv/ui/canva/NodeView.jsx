import React, { useEffect, useRef, useState } from 'react';

function NodeShape({ node, pxPerMm, onMouseDownNode, selected }) {
  const { frame } = node;
  const style = node.style || {};
  return (
    <div
      onMouseDown={(e) => onMouseDownNode(e, node)}
      className="select-none absolute"
      style={{
        left: frame.x * pxPerMm,
        top: frame.y * pxPerMm,
        width: frame.w * pxPerMm,
        height: frame.h * pxPerMm,
        transform: `rotate(${frame.rotation || 0}deg)`,
        transformOrigin: 'center',
        background: style.fill?.color ?? 'transparent',
        opacity: style.fill?.opacity ?? 1,
        border: style.stroke
          ? `${(style.stroke.width || 0.6) * pxPerMm}px solid ${
              style.stroke.color
            }`
          : 'none',
        borderRadius: (style.cornerRadius || 0) * pxPerMm,
        boxShadow: style.shadow
          ? `${style.shadow.x}px ${style.shadow.y}px ${style.shadow.blur}px ${style.shadow.color}`
          : 'none',
        outline: selected ? '2px solid #2563eb' : 'none',
        cursor: 'move',
        userSelect: 'none',
      }}
    />
  );
}

function NodeImage({ node, pxPerMm, onMouseDownNode, selected }) {
  const { frame } = node;
  return (
    <div
      onMouseDown={(e) => onMouseDownNode(e, node)}
      className="overflow-hidden select-none absolute"
      style={{
        left: frame.x * pxPerMm,
        top: frame.y * pxPerMm,
        width: frame.w * pxPerMm,
        height: frame.h * pxPerMm,
        transform: `rotate(${frame.rotation || 0}deg)`,
        transformOrigin: 'center',
        outline: selected ? '2px solid #2563eb' : 'none',
        cursor: 'move',
        userSelect: 'none',
      }}
    >
      <img
        alt=""
        src={node.src}
        draggable={false}
        className="w-full h-full block"
        style={{ objectFit: node.objectFit || 'cover' }}
      />
    </div>
  );
}

function NodeText({ node, pxPerMm, onMouseDownNode, onChangeText, selected }) {
  const { frame } = node;
  const style = node.textStyle || {};
  const editRef = useRef(null);
  const [editing, setEditing] = useState(false);

  // utrzymanie treści bez resetu selekcji
  useEffect(() => {
    const el = editRef.current;
    if (!el) return;
    const now = el.innerText;
    const next = node.text ?? '';
    if (now !== next) el.innerText = next;
  }, [node.text]);

  // focus po wejściu w edycję
  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => {
        editRef.current?.focus();
        // ustaw kursor na końcu
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      });
    }
  }, [editing]);

  return (
    <div
      className="absolute bg-transparent p-1.5"
      style={{
        left: frame.x * pxPerMm,
        top: frame.y * pxPerMm,
        width: frame.w * pxPerMm,
        height: frame.h * pxPerMm,
        transform: `rotate(${frame.rotation || 0}deg)`,
        transformOrigin: 'center',
        outline: selected ? '2px solid #2563eb' : 'none',
        cursor: editing ? 'text' : 'move',
        userSelect: editing ? 'text' : 'none',
      }}
      onMouseDown={(e) => {
        if (editing) return; // w edycji nie łapiemy drag
        onMouseDownNode(e, node); // łapanie całym boxem
      }}
      onDoubleClick={() => setEditing(true)}
    >
      <div
        ref={editRef}
        data-editable="true"
        contentEditable={editing && !node.lock}
        suppressContentEditableWarning
        spellCheck={false}
        className="w-full h-full outline-none"
        style={{
          color: style.color || '#0f172a',
          fontFamily: style.fontFamily || 'Inter, Arial, sans-serif',
          fontWeight: style.fontWeight || 400,
          fontSize: `${style.fontSize || 12}pt`,
          lineHeight: style.lineHeight || 1.35,
          textAlign: style.align || 'left',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          hyphens: 'auto',
          pointerEvents: editing ? 'auto' : 'none',
        }}
        onInput={(e) => onChangeText?.(node.id, e.currentTarget.innerText)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            editRef.current.blur();
          }
        }}
      />
    </div>
  );
}

export default function NodeView(props) {
  const { node } = props;
  if (node.type === 'shape') return <NodeShape {...props} />;
  if (node.type === 'image') return <NodeImage {...props} />;
  if (node.type === 'text') return <NodeText {...props} />;
  return null;
}
