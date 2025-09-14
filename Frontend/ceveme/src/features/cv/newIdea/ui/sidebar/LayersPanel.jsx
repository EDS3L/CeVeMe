import React from 'react';

function Icon({ name }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (name) {
    case 'eye':
      return (
        <svg {...common}>
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'eye-off':
      return (
        <svg {...common}>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.78 21.78 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.83 21.83 0 0 1-3.87 4.94" />
          <path d="M1 1l22 22" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case 'unlock':
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M12 7a4 4 0 0 1 8 0v1" />
        </svg>
      );
    case 'up':
      return (
        <svg {...common}>
          <polyline points="6 15 12 9 18 15" />
        </svg>
      );
    case 'down':
      return (
        <svg {...common}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );
    case 'top':
      return (
        <svg {...common}>
          <polyline points="6 15 12 9 18 15" />
          <line x1="4" y1="5" x2="20" y2="5" />
        </svg>
      );
    case 'bottom':
      return (
        <svg {...common}>
          <polyline points="6 9 12 15 18 9" />
          <line x1="4" y1="19" x2="20" y2="19" />
        </svg>
      );
    default:
      return null;
  }
}

function IconButton({ title, className = '', onClick, children }) {
  return (
    <button
      type="button"
      className={`btn-icon ${className}`}
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function LayersPanel({
  nodes,
  selectedId,
  setSelectedId,
  reorder,
  updateNode,
}) {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Warstwy</div>
      <ul className="layer-list">
        {nodes
          .slice()
          .reverse()
          .map((node) => {
            const isSelected = node.id === selectedId;
            const name = node.text?.trim() || node.src?.trim() || node.id;
            const visible = node.visible !== false;
            return (
              <li
                key={node.id}
                className={`layer-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedId(node.id)}
              >
                <div className="layer-main">
                  <span className="layer-type">{node.type}</span>
                  <span className="layer-name" title={name}>
                    {name}
                  </span>
                </div>

                <div
                  className="layer-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    title={visible ? 'Ukryj' : 'Pokaż'}
                    onClick={() =>
                      updateNode(node.id, { visible: visible ? false : true })
                    }
                  >
                    <Icon name={visible ? 'eye' : 'eye-off'} />
                  </IconButton>

                  <IconButton
                    title={node.lock ? 'Odblokuj' : 'Zablokuj'}
                    onClick={() => updateNode(node.id, { lock: !node.lock })}
                  >
                    <Icon name={node.lock ? 'unlock' : 'lock'} />
                  </IconButton>

                  <IconButton
                    title="W górę"
                    onClick={() => reorder(node.id, 'forward')}
                  >
                    <Icon name="up" />
                  </IconButton>

                  <IconButton
                    title="W dół"
                    onClick={() => reorder(node.id, 'backward')}
                  >
                    <Icon name="down" />
                  </IconButton>

                  <IconButton
                    title="Na wierzch"
                    className="btn-front"
                    onClick={() => reorder(node.id, 'front')}
                  >
                    <Icon name="top" />
                  </IconButton>

                  <IconButton
                    title="Na spód"
                    className="btn-back"
                    onClick={() => reorder(node.id, 'back')}
                  >
                    <Icon name="bottom" />
                  </IconButton>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
