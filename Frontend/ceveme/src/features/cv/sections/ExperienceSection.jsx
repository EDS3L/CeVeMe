import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import CollapsibleSection from '../components/CollapsibleSection';
import ExperienceItem from './ExperienceItem';

export default function ExperienceSection({
  experience = [],
  updateData,
  isOpen,
  onToggle,
}) {
  return (
    <CollapsibleSection
      title="Doświadczenie"
      icon={Briefcase}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {experience.map((exp, i) => (
          <ExperienceItem
            key={i}
            exp={exp}
            onChange={(field, value) =>
              updateData((d) => {
                d.experience[i][field] = value;
              })
            }
            onRemove={() =>
              updateData((d) => {
                d.experience.splice(i, 1);
              })
            }
            onToggleVisible={(checked) =>
              updateData((d) => {
                d.experience[i].visible = checked;
              })
            }
            onAchievementChange={(j, value) =>
              updateData((d) => {
                d.experience[i].achievements[j].description = value;
              })
            }
            onAchievementRemove={(j) =>
              updateData((d) => {
                d.experience[i].achievements.splice(j, 1);
              })
            }
            onAchievementAdd={() =>
              updateData((d) => {
                d.experience[i].achievements =
                  d.experience[i].achievements || [];
                d.experience[i].achievements.push({
                  description: '',
                  visible: true,
                });
              })
            }
          />
        ))}
        <button
          onClick={() =>
            updateData((d) => {
              d.experience = d.experience || [];
              d.experience.push({
                title: '',
                company: '',
                period: '',
                visible: true,
                achievements: [],
              });
            })
          }
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <Plus className="w-4 h-4" /> Dodaj doświadczenie
        </button>
      </div>
    </CollapsibleSection>
  );
}
