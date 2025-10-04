import React from 'react';
import { X } from 'lucide-react';
import EditableText from '../components/EditableText';

export default function EducationItem({
  edu,
  onChange,
  onRemove,
  onToggleVisible,
}) {
  return (
    <div className="p-3 border rounded relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500"
      >
        <X className="w-4 h-4" />
      </button>
      <label className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={edu.visible !== false}
          onChange={(e) => onToggleVisible(e.target.checked)}
        />
        <span className="text-xs text-gray-500">Pokaż w CV</span>
      </label>
      <EditableText
        value={edu.degree}
        onChange={(v) => onChange('degree', v)}
        placeholder="Stopień/specjalność"
        className="font-semibold mb-1"
      />
      <EditableText
        value={edu.institution}
        onChange={(v) => onChange('institution', v)}
        placeholder="Uczelnia/instytucja"
        className="mb-1"
      />
      <EditableText
        value={edu.specialization || ''}
        onChange={(v) => onChange('specialization', v)}
        placeholder="Specjalizacja"
        className="mb-1"
      />
      <EditableText
        value={edu.period}
        onChange={(v) => onChange('period', v)}
        placeholder="Okres (np. 2018–2022)"
      />
    </div>
  );
}
