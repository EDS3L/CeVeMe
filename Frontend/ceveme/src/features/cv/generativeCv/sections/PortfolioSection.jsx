import React from 'react';
import { Globe, Plus } from 'lucide-react';
import CollapsibleSection from '../components/CollapsibleSection';
import PortfolioItem from './PortfolioItem';

export default function PortfolioSection({
  portfolio = [],
  updateData,
  isOpen,
  onToggle,
}) {
  return (
    <CollapsibleSection
      title="Portfolio/Projekty"
      icon={Globe}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {portfolio.map((item, i) => (
          <PortfolioItem
            key={i}
            item={item}
            onChange={(field, value) =>
              updateData((d) => {
                d.portfolio[i][field] = value;
              })
            }
            onRemove={() =>
              updateData((d) => {
                d.portfolio.splice(i, 1);
              })
            }
            onToggleVisible={(checked) =>
              updateData((d) => {
                d.portfolio[i].visible = checked;
              })
            }
            onTechChange={(j, value) =>
              updateData((d) => {
                d.portfolio[i].technologies[j].name = value;
              })
            }
            onTechRemove={(j) =>
              updateData((d) => {
                d.portfolio[i].technologies.splice(j, 1);
              })
            }
            onTechAdd={() =>
              updateData((d) => {
                d.portfolio[i].technologies = d.portfolio[i].technologies || [];
                d.portfolio[i].technologies.push({ name: '' });
              })
            }
            onAchievementChange={(j, value) =>
              updateData((d) => {
                d.portfolio[i].achievements[j].description = value;
              })
            }
            onAchievementRemove={(j) =>
              updateData((d) => {
                d.portfolio[i].achievements.splice(j, 1);
              })
            }
            onAchievementAdd={() =>
              updateData((d) => {
                d.portfolio[i].achievements = d.portfolio[i].achievements || [];
                d.portfolio[i].achievements.push({
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
              d.portfolio = d.portfolio || [];
              d.portfolio.push({
                name: '',
                url: '',
                visible: true,
                technologies: [],
                achievements: [],
              });
            })
          }
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <Plus className="w-4 h-4" /> Dodaj projekt
        </button>
      </div>
    </CollapsibleSection>
  );
}
