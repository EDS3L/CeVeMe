import React from 'react';
import { GraduationCap, Plus } from 'lucide-react';
import CollapsibleSection from '../components/CollapsibleSection';
import EducationItem from './EducationItem';

export default function EducationSection({
  education = [],
  updateData,
  isOpen,
  onToggle,
}) {
  return (
    <CollapsibleSection
      title="Edukacja"
      icon={GraduationCap}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {education.map((edu, i) => (
          <EducationItem
            key={i}
            edu={edu}
            onChange={(field, value) =>
              updateData((d) => {
                (d.educations || d.education)[i][field] = value;
              })
            }
            onRemove={() =>
              updateData((d) => {
                (d.educations || d.education).splice(i, 1);
              })
            }
            onToggleVisible={(checked) =>
              updateData((d) => {
                (d.educations || d.education)[i].visible = checked;
              })
            }
          />
        ))}
        <button
          onClick={() =>
            updateData((d) => {
              if (d.educations)
                d.educations.push({
                  degree: '',
                  institution: '',
                  specialization: '',
                  period: '',
                  visible: true,
                });
              else if (d.education)
                d.education.push({
                  degree: '',
                  institution: '',
                  specialization: '',
                  period: '',
                  visible: true,
                });
              else
                d.educations = [
                  {
                    degree: '',
                    institution: '',
                    specialization: '',
                    period: '',
                    visible: true,
                  },
                ];
            })
          }
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <Plus className="w-4 h-4" /> Dodaj edukację
        </button>
      </div>
    </CollapsibleSection>
  );
}
