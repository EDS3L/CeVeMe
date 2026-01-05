import { useCallback, useEffect, useRef, useState } from "react";
import {
  emptyDocument,
  createTextNode,
  createImageNode,
  createShapeNode,
  createIconNode,
} from "../core/model";
import { saveDocument, loadDocument } from "../services/storage";
import { A4 } from "../core/mm";

export default function useEngine(initialDoc) {
  const [doc, setDoc] = useState(() => initialDoc || emptyDocument(A4));
  const [selectedId, setSelectedId] = useState(null);
  const history = useRef({ stack: [], redo: [] });

  const pushHistory = useCallback((prevDoc) => {
    history.current.stack.push(JSON.stringify(prevDoc));
    if (history.current.stack.length > 50) history.current.stack.shift();
    history.current.redo = [];
  }, []);

  const undo = useCallback(() => {
    if (history.current.stack.length === 0) return;
    const snap = history.current.stack.pop();
    history.current.redo.push(JSON.stringify(doc));
    const prev = snap ? JSON.parse(snap) : null;
    if (prev) {
      setDoc(prev);
      setSelectedId(null);
    }
  }, [doc]);

  const redo = useCallback(() => {
    if (history.current.redo.length === 0) return;
    const snap = history.current.redo.pop();
    if (snap) {
      history.current.stack.push(JSON.stringify(doc));
      const next = JSON.parse(snap);
      setDoc(next);
      setSelectedId(null);
    }
  }, [doc]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      const k = e.key.toLowerCase();
      if (k === "z") {
        e.preventDefault();
        undo();
      } else if (k === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  const addText = useCallback(() => {
    setDoc((prev) => {
      pushHistory(prev);
      const next = { ...prev, nodes: [...prev.nodes, createTextNode()] };
      return next;
    });
  }, [pushHistory]);

  const addImage = useCallback(
    (src) => {
      setDoc((prev) => {
        pushHistory(prev);
        const node = createImageNode(src ? { src } : {});
        const next = { ...prev, nodes: [...prev.nodes, node] };
        return next;
      });
    },
    [pushHistory]
  );

  const addRect = useCallback(() => {
    setDoc((prev) => {
      pushHistory(prev);
      const next = { ...prev, nodes: [...prev.nodes, createShapeNode()] };
      return next;
    });
  }, [pushHistory]);

  const addIcon = useCallback(
    (iconKey = "phone") => {
      setDoc((prev) => {
        pushHistory(prev);
        const node = createIconNode(iconKey);
        const next = { ...prev, nodes: [...prev.nodes, node] };
        return next;
      });
    },
    [pushHistory]
  );

  const updateNode = useCallback(
    (id, updater) => {
      setDoc((prev) => {
        const idx = prev.nodes.findIndex((n) => n.id === id);
        if (idx === -1) return prev;
        pushHistory(prev);
        const node = { ...prev.nodes[idx] };
        const patch = typeof updater === "function" ? updater(node) : updater;
        const merged = {
          ...node,
          ...patch,
          frame: { ...node.frame, ...(patch.frame || {}) },
          style: { ...(node.style || {}), ...(patch.style || {}) },
          textStyle: { ...(node.textStyle || {}), ...(patch.textStyle || {}) },
        };
        const nodes = [...prev.nodes];
        nodes[idx] = merged;
        const next = { ...prev, nodes };
        return next;
      });
    },
    [pushHistory]
  );

  const removeNode = useCallback(
    (id) => {
      setDoc((prev) => {
        pushHistory(prev);
        const nodes = prev.nodes.filter((n) => n.id !== id);
        const next = { ...prev, nodes };
        return next;
      });
      setSelectedId((s) => (s === id ? null : s));
    },
    [pushHistory]
  );

  const reorder = useCallback(
    (id, dir) => {
      setDoc((prev) => {
        const idx = prev.nodes.findIndex((n) => n.id === id);
        if (idx === -1) return prev;
        pushHistory(prev);
        const nodes = [...prev.nodes];
        const [node] = nodes.splice(idx, 1);
        let to = idx;
        if (dir === "forward") to = Math.min(prev.nodes.length - 1, idx + 1);
        if (dir === "backward") to = Math.max(0, idx - 1);
        if (dir === "front") to = prev.nodes.length;
        if (dir === "back") to = 0;
        nodes.splice(to, 0, node);
        const next = { ...prev, nodes };
        return next;
      });
    },
    [pushHistory]
  );


  const alignNodes = useCallback(
    (ids, align) => {
      if (!ids || ids.length < 2) return;
      setDoc((prev) => {
        const targetNodes = prev.nodes.filter((n) =>
          ids.includes(String(n.id))
        );
        if (targetNodes.length < 2) return prev;

        pushHistory(prev);

        const frames = targetNodes.map((n) => n.frame);
        const minX = Math.min(...frames.map((f) => f.x));
        const maxX = Math.max(...frames.map((f) => f.x + f.w));
        const minY = Math.min(...frames.map((f) => f.y));
        const maxY = Math.max(...frames.map((f) => f.y + f.h));
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const nodes = prev.nodes.map((n) => {
          if (!ids.includes(String(n.id))) return n;
          const f = { ...n.frame };

          switch (align) {
            case "left":
              f.x = minX;
              break;
            case "right":
              f.x = maxX - f.w;
              break;
            case "center":
              f.x = centerX - f.w / 2;
              break;
            case "top":
              f.y = minY;
              break;
            case "bottom":
              f.y = maxY - f.h;
              break;
            case "middle":
              f.y = centerY - f.h / 2;
              break;
            default:
              break;
          }

          return { ...n, frame: f };
        });

        if (align === "distributeH" && targetNodes.length >= 3) {
          const sorted = [...targetNodes].sort((a, b) => a.frame.x - b.frame.x);
          const totalWidth = sorted.reduce((s, n) => s + n.frame.w, 0);
          const totalSpace = maxX - minX - totalWidth;
          const gap = totalSpace / (sorted.length - 1);
          let currentX = minX;
          sorted.forEach((sn) => {
            const idx = nodes.findIndex((n) => n.id === sn.id);
            if (idx !== -1) {
              nodes[idx] = {
                ...nodes[idx],
                frame: { ...nodes[idx].frame, x: currentX },
              };
              currentX += nodes[idx].frame.w + gap;
            }
          });
        }

        if (align === "distributeV" && targetNodes.length >= 3) {
          const sorted = [...targetNodes].sort((a, b) => a.frame.y - b.frame.y);
          const totalHeight = sorted.reduce((s, n) => s + n.frame.h, 0);
          const totalSpace = maxY - minY - totalHeight;
          const gap = totalSpace / (sorted.length - 1);
          let currentY = minY;
          sorted.forEach((sn) => {
            const idx = nodes.findIndex((n) => n.id === sn.id);
            if (idx !== -1) {
              nodes[idx] = {
                ...nodes[idx],
                frame: { ...nodes[idx].frame, y: currentY },
              };
              currentY += nodes[idx].frame.h + gap;
            }
          });
        }

        const next = { ...prev, nodes };
        return next;
      });
    },
    [pushHistory]
  );

  const setDocument = useCallback(
    (newDocOrUpdater) => {
      setDoc((prev) => {
        pushHistory(prev);
        if (typeof newDocOrUpdater === "function") {
          return newDocOrUpdater(prev);
        }
        return newDocOrUpdater;
      });
      setSelectedId(null);
    },
    [pushHistory]
  );

  const save = useCallback(() => saveDocument(doc), [doc]);

  const load = useCallback(() => {
    const d = loadDocument();
    if (d) {
      setDoc(d);
      setSelectedId(null);
    }
    return !!d;
  }, []);

  return {
    doc,
    setDocument,
    selectedId,
    setSelectedId,
    addText,
    addImage,
    addRect,
    addIcon,
    updateNode,
    removeNode,
    reorder,
    alignNodes,
    undo,
    redo,
    canUndo: history.current.stack.length > 0,
    canRedo: history.current.redo.length > 0,
    save,
    load,
  };
}
