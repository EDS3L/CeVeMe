import React from 'react';
import { Code, Plus } from 'lucide-react';
import CollapsibleSection from '../components/CollapsibleSection';
import SkillGroup from './SkillGroup';

export default function SkillsSection({
  skills = [],
  updateData,
  isOpen,
  onToggle,
}) {
  return (
    <CollapsibleSection
      title="Umiejętności"
      icon={Code}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {skills.map((grp, i) => (
          <SkillGroup
            key={i}
            group={grp}
            onChangeCategory={(v) =>
              updateData((d) => {
                d.skills[i].category = v;
              })
            }
            onRemove={() =>
              updateData((d) => {
                d.skills.splice(i, 1);
              })
            }
            onSkillChange={(j, value) =>
              updateData((d) => {
                d.skills[i].items[j].name = value;
              })
            }
            onSkillRemove={(j) =>
              updateData((d) => {
                d.skills[i].items.splice(j, 1);
              })
            }
            onSkillAdd={() =>
              updateData((d) => {
                d.skills[i].items = d.skills[i].items || [];
                d.skills[i].items.push({ name: '', visible: true });
              })
            }
            onSkillToggleVisible={(j, checked) =>
              updateData((d) => {
                d.skills[i].items[j].visible = checked;
              })
            }
          />
        ))}
        <button
          onClick={() =>
            updateData((d) => {
              d.skills = d.skills || [];
              d.skills.push({ category: '', items: [] });
            })
          }
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <Plus className="w-4 h-4" /> Dodaj kategorię
        </button>
      </div>
    </CollapsibleSection>
  );
}
