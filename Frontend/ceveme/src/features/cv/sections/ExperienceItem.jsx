import React from 'react';
import { X, Plus } from 'lucide-react';
import EditableText from '../components/EditableText';

export default function ExperienceItem({
  exp,
  onChange,
  onRemove,
  onToggleVisible,
  onAchievementChange,
  onAchievementRemove,
  onAchievementAdd,
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
          checked={exp.visible !== false}
          onChange={(e) => onToggleVisible(e.target.checked)}
        />
        <span className="text-xs text-gray-500">Pokaż w CV</span>
      </label>
      <EditableText
        value={exp.title}
        onChange={(v) => onChange('title', v)}
        placeholder="Stanowisko"
        className="font-semibold mb-1"
      />
      <EditableText
        value={exp.company}
        onChange={(v) => onChange('company', v)}
        placeholder="Firma"
        className="mb-1"
      />
      <EditableText
        value={exp.period}
        onChange={(v) => onChange('period', v)}
        placeholder="Okres (np. 2022 – obecnie)"
        className="mb-2"
      />
      <div>
        <h4 className="text-sm font-medium mb-1">Osiągnięcia</h4>
        {exp.achievements?.map((ach, j) => (
          <div key={j} className="flex items-start gap-2 mb-1">
            <textarea
              value={ach.description}
              onChange={(e) => onAchievementChange(j, e.target.value)}
              placeholder="Opis osiągnięcia..."
              className="flex-1 p-2 text-sm border rounded resize-none"
              rows={2}
            />
            <button
              onClick={() => onAchievementRemove(j)}
              className="text-red-500 p-1 rounded hover:bg-red-50 mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={onAchievementAdd}
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <Plus className="w-4 h-4" /> Dodaj osiągnięcie
        </button>
      </div>
    </div>
  );
}
