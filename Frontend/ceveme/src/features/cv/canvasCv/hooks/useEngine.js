import { useCallback, useEffect, useRef, useState } from 'react';
import {
  emptyDocument,
  createTextNode,
  createImageNode,
  createShapeNode,
} from '../core/model';
import { saveDocument, loadDocument } from '../services/storage';
import { A4 } from '../core/mm';

export default function useEngine(initialDoc) {
  const [doc, setDoc] = useState(() => initialDoc || emptyDocument(A4));
  const [selectedId, setSelectedId] = useState(null);
  const history = useRef({ stack: [], redo: [] });

  const pushHistory = useCallback((nextDoc) => {
    history.current.stack.push(JSON.stringify(nextDoc));
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
      if (k === 'z') {
        e.preventDefault();
        undo();
      } else if (k === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  const addText = useCallback(() => {
    setDoc((prev) => {
      const next = { ...prev, nodes: [...prev.nodes, createTextNode()] };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const addImage = useCallback(
    (src) => {
      setDoc((prev) => {
        const node = createImageNode(src ? { src } : {});
        const next = { ...prev, nodes: [...prev.nodes, node] };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const addRect = useCallback(() => {
    setDoc((prev) => {
      const next = { ...prev, nodes: [...prev.nodes, createShapeNode()] };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateNode = useCallback(
    (id, updater) => {
      setDoc((prev) => {
        const idx = prev.nodes.findIndex((n) => n.id === id);
        if (idx === -1) return prev;
        const node = { ...prev.nodes[idx] };
        const patch = typeof updater === 'function' ? updater(node) : updater;
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
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const removeNode = useCallback(
    (id) => {
      setDoc((prev) => {
        const nodes = prev.nodes.filter((n) => n.id !== id);
        const next = { ...prev, nodes };
        pushHistory(next);
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
        const nodes = [...prev.nodes];
        const [node] = nodes.splice(idx, 1);
        let to = idx;
        if (dir === 'forward') to = Math.min(prev.nodes.length - 1, idx + 1);
        if (dir === 'backward') to = Math.max(0, idx - 1);
        if (dir === 'front') to = prev.nodes.length;
        if (dir === 'back') to = 0;
        nodes.splice(to, 0, node);
        const next = { ...prev, nodes };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const setDocument = useCallback(
    (newDoc) => {
      console.log(newDoc);
      setDoc(newDoc);
      pushHistory(newDoc);
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
    updateNode,
    removeNode,
    reorder,
    undo,
    redo,
    canUndo: history.current.stack.length > 0,
    canRedo: history.current.redo.length > 0,
    save,
    load,
  };
}
