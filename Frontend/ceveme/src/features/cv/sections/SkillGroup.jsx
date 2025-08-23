import React from 'react';
import { X, Plus } from 'lucide-react';
import SkillItem from './SkillItem';
import EditableText from '../components/EditableText';

export default function SkillGroup({
  group,
  onChangeCategory,
  onRemove,
  onSkillChange,
  onSkillRemove,
  onSkillAdd,
  onSkillToggleVisible,
}) {
  return (
    <div className="p-3 border rounded relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500"
      >
        <X className="w-4 h-4" />
      </button>
      <EditableText
        value={group.category}
        onChange={onChangeCategory}
        placeholder="Kategoria"
        className="font-semibold mb-1"
      />
      {group.items?.map((item, j) => (
        <SkillItem
          key={j}
          item={item}
          onChange={(v) => onSkillChange(j, v)}
          onRemove={() => onSkillRemove(j)}
          onToggleVisible={(checked) => onSkillToggleVisible(j, checked)}
        />
      ))}
      <button
        onClick={onSkillAdd}
        className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
      >
        <Plus className="w-4 h-4" /> Dodaj umiejętność
      </button>
    </div>
  );
}
