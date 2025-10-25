import React from 'react';
import Toolbar from './Toolbar';
import InspectorPanel from './InspectorPanel';

export default function EditorShell({ toolbarProps, canvas, inspectorProps }) {
  return (
    <div className="min-h-screen bg-white">
      <Toolbar {...toolbarProps} />
      <main className="grid grid-cols-[1fr_320px]">
        <section className="min-h-[calc(100vh-3.5rem)] overflow-auto">
          {canvas}
        </section>
        <InspectorPanel {...inspectorProps} />
      </main>
    </div>
  );
}
