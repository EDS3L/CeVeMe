/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";

function Icon({ name, className = "" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };
  switch (name) {
    case "eye":
      return (
        <svg {...common}>
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "eye-off":
      return (
        <svg {...common}>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.78 21.78 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.83 21.83 0 0 1-3.87 4.94" />
          <path d="M1 1l22 22" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "unlock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M12 7a4 4 0 0 1 8 0v1" />
        </svg>
      );
    case "up":
      return (
        <svg {...common}>
          <polyline points="6 15 12 9 18 15" />
        </svg>
      );
    case "down":
      return (
        <svg {...common}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );
    case "top":
      return (
        <svg {...common}>
          <polyline points="6 15 12 9 18 15" />
          <line x1="4" y1="5" x2="20" y2="5" />
        </svg>
      );
    case "bottom":
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

function IconButton({ title, className = "", onClick, disabled, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-grid place-items-center w-7 h-7 rounded-lg border border-black/10 bg-white hover:bg-slate-50 active:translate-y-px disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export default function LayersPanel({
  nodes = [],
  selectedId,
  setSelectedId,
  selectedIds,
  setSelectedIds,
  activeGroupIds = null,
  onUngroup,
  reorder,
  updateNode,
}) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const selIds = useMemo(() => {
    if (Array.isArray(selectedIds)) return selectedIds;
    if (selectedId) return [selectedId];
    return [];
  }, [selectedIds, selectedId]);

  const setSel = (next) => {
    if (setSelectedIds) setSelectedIds(next);
    else if (setSelectedId) setSelectedId(next?.[0] || null);
  };

  const [isOpen, setOpen] = useState(true);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);
  useEffect(() => {
    if (isOpen && contentRef.current)
      setHeight(contentRef.current.scrollHeight);
    else setHeight(0);
  }, [isOpen, safeNodes.length, activeGroupIds?.length, selIds.length]);

  const isGrouped = Array.isArray(activeGroupIds) && activeGroupIds.length >= 2;
  const groupSet = useMemo(
    () => new Set(isGrouped ? activeGroupIds : []),
    [isGrouped, activeGroupIds]
  );
  const groupNodes = useMemo(
    () => safeNodes.filter((n) => groupSet.has(n.id)),
    [safeNodes, groupSet]
  );

  const allVisibleGroup =
    groupNodes.length > 0 && groupNodes.every((n) => n.visible !== false);
  const allLockedGroup =
    groupNodes.length > 0 && groupNodes.every((n) => !!n.lock);

  const toggleGroupVisibility = () => {
    if (!updateNode || !isGrouped) return;
    const next = !allVisibleGroup;
    groupNodes.forEach((n) => updateNode(n.id, { visible: next }));
  };
  const toggleGroupLock = () => {
    if (!updateNode || !isGrouped) return;
    const next = !allLockedGroup;
    groupNodes.forEach((n) => updateNode(n.id, { lock: next }));
  };

  const idsInDocOrder = useMemo(
    () => safeNodes.map((n) => n.id).filter((id) => groupSet.has(id)),
    [safeNodes, groupSet]
  );
  const reorderGroup = (mode) => {
    if (!reorder || !isGrouped) return;
    if (mode === "front" || mode === "forward")
      idsInDocOrder.forEach((id) => reorder(id, mode));
    else if (mode === "back" || mode === "backward")
      [...idsInDocOrder].reverse().forEach((id) => reorder(id, mode));
  };

  const isSelected = (id) => selIds.includes(id);
  const onRowClick = (e, id) => {
    const toggle = e.metaKey || e.ctrlKey;
    if (toggle)
      setSel(isSelected(id) ? selIds.filter((x) => x !== id) : [...selIds, id]);
    else setSel([id]);
  };

  const displayName = (node) =>
    (
      node.name ||
      node.text?.split("\n")[0] ||
      node.src ||
      node.id ||
      ""
    ).trim();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-sm">Zaznaczone / Ukryte</div>
        <div className="flex items-center gap-2">
          <IconButton
            title={isOpen ? "Zwiń" : "Rozwiń"}
            onClick={() => setOpen(!isOpen)}
          >
            <Icon
              name="down"
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </IconButton>
        </div>
      </div>

      {!isOpen && (
        <div className="text-xs text-slate-500 mb-2">
          {safeNodes.length} warstw
          {isGrouped ? ` • Grupa(${activeGroupIds.length})` : ""}
        </div>
      )}

      <div
        style={{ height, transition: "height 0.3s ease", overflow: "hidden" }}
      >
        <div ref={contentRef}>
          {isGrouped && (
            <div
              className="grid grid-cols-[1fr_auto] gap-2 items-center min-w-0 p-2 rounded-xl border border-sky-300 bg-sky-50 mb-2"
              title={`Aktywna grupa (${activeGroupIds.length})`}
              onClick={(e) => {
                e.stopPropagation();
                setSel([...activeGroupIds]);
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-slate-600 w-14 flex-none lowercase">
                  group
                </span>
                <span className="text-xs text-slate-900 truncate font-semibold">
                  Grupa ({activeGroupIds.length})
                </span>
              </div>
              <div
                className="flex items-center gap-1 flex-wrap justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton
                  title={allVisibleGroup ? "Ukryj grupę" : "Pokaż grupę"}
                  onClick={toggleGroupVisibility}
                  disabled={!updateNode}
                >
                  <Icon name={allVisibleGroup ? "eye" : "eye-off"} />
                </IconButton>
                <IconButton
                  title={allLockedGroup ? "Odblokuj grupę" : "Zablokuj grupę"}
                  onClick={toggleGroupLock}
                  disabled={!updateNode}
                >
                  <Icon name={allLockedGroup ? "unlock" : "lock"} />
                </IconButton>
                <IconButton
                  title="W górę (grupa)"
                  onClick={() => reorderGroup("forward")}
                  disabled={!reorder}
                >
                  <Icon name="up" />
                </IconButton>
                <IconButton
                  title="W dół (grupa)"
                  onClick={() => reorderGroup("backward")}
                  disabled={!reorder}
                >
                  <Icon name="down" />
                </IconButton>
                <IconButton
                  title="Na wierzch (grupa)"
                  className="hidden sm:inline-grid"
                  onClick={() => reorderGroup("front")}
                  disabled={!reorder}
                >
                  <Icon name="top" />
                </IconButton>
                <IconButton
                  title="Na spód (grupa)"
                  className="hidden sm:inline-grid"
                  onClick={() => reorderGroup("back")}
                  disabled={!reorder}
                >
                  <Icon name="bottom" />
                </IconButton>
                {typeof onUngroup === "function" && (
                  <button
                    type="button"
                    className="ml-1 px-2 py-1 rounded-md text-xs font-semibold border border-rose-600 text-rose-700 hover:bg-rose-50"
                    onClick={onUngroup}
                    title="Rozgrupuj"
                  >
                    Rozgrupuj
                  </button>
                )}
              </div>
            </div>
          )}

          <ul className="space-y-1">
            {(() => {
              // Filtruj: tylko ukryte, zablokowane lub zaznaczone
              const filteredNodes = safeNodes
                .slice()
                .reverse()
                .filter((node) => {
                  const selected = selIds.includes(node.id);
                  const hidden = node.visible === false;
                  const locked = !!node.lock;
                  const inGroup = groupSet.has(node.id);
                  return selected || hidden || locked || inGroup;
                });

              if (filteredNodes.length === 0) {
                return (
                  <li className="text-xs text-slate-400 text-center py-6 px-2">
                    <div className="text-slate-300 mb-1">📋</div>
                    Zaznacz element lub ukryj/zablokuj,
                    <br />
                    aby zobaczyć go tutaj
                  </li>
                );
              }

              return filteredNodes.map((node) => {
                const selected = selIds.includes(node.id);
                const name = displayName(node);
                const visible = node.visible !== false;
                const inGroup = groupSet.has(node.id);
                const isLocked = !!node.lock;

                // Ikony stanu
                const statusIcons = [];
                if (!visible) statusIcons.push("👁️‍🗨️");
                if (isLocked) statusIcons.push("🔒");

                return (
                  <li
                    key={node.id}
                    onClick={(e) => onRowClick(e, node.id)}
                    className={`
                      flex flex-col gap-1 p-2 rounded-lg border transition-all cursor-pointer
                      ${
                        selected
                          ? "border-blue-400 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }
                      ${inGroup ? "border-sky-300 bg-sky-50/50" : ""}
                      ${!visible ? "opacity-60" : ""}
                    `}
                    title={inGroup ? "Element w aktywnej grupie" : name}
                  >
                    {/* Górny wiersz: typ + nazwa + ikony stanu */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`
                        text-[10px] uppercase font-medium px-1.5 py-0.5 rounded
                        ${
                          node.type === "text"
                            ? "bg-amber-100 text-amber-700"
                            : ""
                        }
                        ${
                          node.type === "shape"
                            ? "bg-blue-100 text-blue-700"
                            : ""
                        }
                        ${
                          node.type === "image"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                        ${
                          node.type === "icon"
                            ? "bg-purple-100 text-purple-700"
                            : ""
                        }
                        ${
                          node.type === "drawing"
                            ? "bg-pink-100 text-pink-700"
                            : ""
                        }
                        ${
                          ![
                            "text",
                            "shape",
                            "image",
                            "icon",
                            "drawing",
                          ].includes(node.type)
                            ? "bg-slate-100 text-slate-600"
                            : ""
                        }
                      `}
                      >
                        {node.type}
                      </span>
                      <span className="text-xs text-slate-700 truncate flex-1 font-medium">
                        {name || "(bez nazwy)"}
                      </span>
                      {statusIcons.length > 0 && (
                        <span className="text-xs">{statusIcons.join(" ")}</span>
                      )}
                    </div>

                    {/* Dolny wiersz: przyciski akcji */}
                    <div
                      className="flex items-center gap-1 pt-1 border-t border-slate-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        title={visible ? "Ukryj" : "Pokaż"}
                        onClick={() =>
                          updateNode &&
                          updateNode(node.id, { visible: !visible })
                        }
                        disabled={!updateNode}
                        className={
                          !visible ? "bg-amber-50 border-amber-200" : ""
                        }
                      >
                        <Icon name={visible ? "eye" : "eye-off"} />
                      </IconButton>
                      <IconButton
                        title={node.lock ? "Odblokuj" : "Zablokuj"}
                        onClick={() =>
                          updateNode &&
                          updateNode(node.id, { lock: !node.lock })
                        }
                        disabled={!updateNode}
                        className={isLocked ? "bg-rose-50 border-rose-200" : ""}
                      >
                        <Icon name={node.lock ? "lock" : "unlock"} />
                      </IconButton>
                      <div className="flex-1" />
                      <IconButton
                        title="W górę"
                        onClick={() => reorder && reorder(node.id, "forward")}
                        disabled={!reorder}
                      >
                        <Icon name="up" />
                      </IconButton>
                      <IconButton
                        title="W dół"
                        onClick={() => reorder && reorder(node.id, "backward")}
                        disabled={!reorder}
                      >
                        <Icon name="down" />
                      </IconButton>
                    </div>
                  </li>
                );
              });
            })()}
          </ul>
        </div>
      </div>
    </div>
  );
}
