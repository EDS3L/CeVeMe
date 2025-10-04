import React from 'react';

export default function NodeView({
  node,
  pxPerMm,
  selected,
  onMouseDownNode,
  onChangeText,
}) {
  const { frame } = node;
  const left = frame.x * pxPerMm;
  const top = frame.y * pxPerMm;
  const width = frame.w * pxPerMm;
  const height = frame.h * pxPerMm;

  const baseStyle = {
    position: 'absolute',
    left,
    top,
    width,
    height,
    transform: `rotate(${frame.rotation || 0}deg)`,
    transformOrigin: 'center',
    borderRadius: (node.style?.cornerRadius || 0) * pxPerMm,
    boxShadow: node.style?.shadow
      ? `${node.style.shadow.x}px ${node.style.shadow.y}px ${node.style.shadow.blur}px ${node.style.shadow.color}`
      : 'none',
    outline: selected ? '2px solid #2563eb' : 'none',
    userSelect: 'none',
  };

  const fill = node.style?.fill;
  const stroke = node.style?.stroke;

  if (node.type === 'shape') {
    return (
      <div
        onMouseDown={(e) => onMouseDownNode(e, node)}
        className="select-none"
        style={{
          ...baseStyle,
          background: fill ? fill.color : 'transparent',
          opacity: fill?.opacity ?? 1,
          border: stroke
            ? `${stroke.width || 0.6}mm solid ${stroke.color}`
            : 'none',
        }}
      />
    );
  }

  if (node.type === 'image') {
    return (
      <div
        onMouseDown={(e) => onMouseDownNode(e, node)}
        className="overflow-hidden select-none"
        style={{ ...baseStyle }}
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

  if (node.type === 'text') {
    const style = node.textStyle || {};
    return (
      <div
        onMouseDown={(e) => onMouseDownNode(e, node)}
        className="cursor-text bg-transparent p-1.5"
        style={{ ...baseStyle }}
        onDoubleClick={(e) => {
          const el = e.currentTarget.querySelector('[data-edit]');
          if (el) {
            el.focus();
            document.execCommand('selectAll', false);
          }
        }}
      >
        <div
          data-edit
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={(e) => onChangeText(node.id, e.currentTarget.innerText)}
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
          }}
        >
          {node.text || ''}
        </div>
      </div>
    );
  }

  return null;
}
