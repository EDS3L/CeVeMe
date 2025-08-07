import React from 'react';
import { X } from 'lucide-react';

export default function SkillItem({
  item,
  onChange,
  onRemove,
  onToggleVisible,
}) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <input
        type="checkbox"
        checked={item.visible !== false}
        onChange={(e) => onToggleVisible(e.target.checked)}
        className="mr-1"
        title="Pokaż w CV"
      />
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Umiejętność"
        className="flex-1 p-1 text-sm border rounded"
      />
      <button
        onClick={onRemove}
        className="text-red-500 p-1 rounded hover:bg-red-50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
