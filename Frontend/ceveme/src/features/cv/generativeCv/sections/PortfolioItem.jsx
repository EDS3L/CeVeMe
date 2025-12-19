import React from 'react';
import { X, Plus } from 'lucide-react';
import EditableText from '../components/EditableText';

export default function PortfolioItem({
  item,
  onChange,
  onRemove,
  onToggleVisible,
  onTechChange,
  onTechRemove,
  onTechAdd,
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
          checked={item.visible !== false}
          onChange={(e) => onToggleVisible(e.target.checked)}
        />
        <span className="text-xs text-gray-500">Pokaż w CV</span>
      </label>
      <EditableText
        value={item.name || item.title || ''}
        onChange={(v) => onChange('name', v)}
        placeholder="Tytuł projektu"
        className="font-semibold mb-1"
      />
      <EditableText
        value={item.url || ''}
        onChange={(v) => onChange('url', v)}
        placeholder="URL projektu"
        className="mb-1"
      />
      <div>
        <h4 className="text-sm font-medium mb-1">Technologie</h4>
        {(item.technologies || []).map((tech, j) => (
          <div key={j} className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={tech.name}
              onChange={(e) => onTechChange(j, e.target.value)}
              placeholder="Technologia"
              className="flex-1 p-1 text-xs border rounded"
            />
            <button
              onClick={() => onTechRemove(j)}
              className="text-red-500 p-1 rounded hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={onTechAdd}
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <Plus className="w-4 h-4" /> Dodaj technologię
        </button>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1 mt-2">Osiągnięcia</h4>
        {(item.achievements || []).map((ach, j) => (
          <div key={j} className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={ach.description}
              onChange={(e) => onAchievementChange(j, e.target.value)}
              placeholder="Opis osiągnięcia"
              className="flex-1 p-1 text-xs border rounded"
            />
            <button
              onClick={() => onAchievementRemove(j)}
              className="text-red-500 p-1 rounded hover:bg-red-50"
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
