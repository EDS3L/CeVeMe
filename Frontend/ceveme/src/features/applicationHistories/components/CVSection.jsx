import React, { useState } from 'react';
import CVPreview from './CVPreview';
import { Download } from 'lucide-react';

export default function CVSection({ cvFile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <CVPreview cvFile={cvFile} expanded={expanded} onExpand={setExpanded} />
      <a
        href={cvFile}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-indigo-700 hover:text-indigo-900 font-semibold transition-colors duration-200
                   py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
        aria-label="Pobierz plik CV"
      >
        <Download size={16} />
        Pobierz CV
      </a>
    </div>
  );
}
