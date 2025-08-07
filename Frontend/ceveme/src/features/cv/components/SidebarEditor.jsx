import React, { useState } from 'react';
import { produce } from 'immer';
import {
  User,
  Briefcase,
  FileText,
  Code,
  GraduationCap,
  Globe,
  Award,
} from 'lucide-react';
import EditableText from './EditableText';
import CollapsibleSection from './CollapsibleSection';
import ExperienceSection from '../sections/ExperienceSection';
import SkillsSection from '../sections/SkillsSection';
import EducationSection from '../sections/EducationSection';
import PortfolioSection from '../sections/PortfolioSection';
import CertificatesSection from '../sections/CertificatesSection';

export default function SidebarEditor({ cvData, onDataChange }) {
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    skills: true,
    education: false,
    portfolio: false,
    certificates: false,
  });

  const toggleSection = (section) =>
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

  const updateData = (updater) => {
    onDataChange((current) => produce(current, updater));
  };

  return (
    <aside className="w-1/3 max-w-sm h-full bg-white p-4 border-r overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Edytor CV</h2>

      {/* Nagłówek */}
      <EditableText
        value={cvData.headline || ''}
        onChange={(v) =>
          updateData((d) => {
            d.headline = v;
          })
        }
        placeholder="Tytuł zawodowy"
        className="text-lg font-semibold mb-4"
      />

      {/* Dane osobowe */}
      <CollapsibleSection
        title="Dane osobowe"
        icon={User}
        isOpen={openSections.personal}
        onToggle={() => toggleSection('personal')}
      >
        <div className="space-y-2">
          {[
            { key: 'name', placeholder: 'Imię i nazwisko' },
            { key: 'email', placeholder: 'Adres e-mail' },
            { key: 'phoneNumber', placeholder: 'Numer telefonu' },
            { key: 'city', placeholder: 'Miasto' },
          ].map(({ key, placeholder }) => (
            <EditableText
              key={key}
              value={cvData.personalData?.[key] || ''}
              onChange={(v) =>
                updateData((d) => {
                  d.personalData = d.personalData || {};
                  d.personalData[key] = v;
                })
              }
              placeholder={placeholder}
            />
          ))}
          {/* Linki */}
          <div className="pt-2">
            <h4 className="text-sm font-semibold mb-2">Linki</h4>
            {cvData.personalData?.links?.map((link, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={link.type}
                  onChange={(e) =>
                    updateData((d) => {
                      d.personalData.links[i].type = e.target.value;
                    })
                  }
                  placeholder="Typ (np. LinkedIn)"
                  className="flex-1 p-1 text-xs border rounded"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) =>
                    updateData((d) => {
                      d.personalData.links[i].url = e.target.value;
                    })
                  }
                  placeholder="URL"
                  className="flex-1 p-1 text-xs border rounded"
                />
                <button
                  onClick={() =>
                    updateData((d) => {
                      d.personalData.links.splice(i, 1);
                    })
                  }
                  className="text-red-500 p-1 rounded hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                updateData((d) => {
                  d.personalData = d.personalData || {};
                  d.personalData.links = d.personalData.links || [];
                  d.personalData.links.push({ type: '', url: '' });
                })
              }
              className="text-indigo-600 hover:underline flex items-center gap-1 text-sm"
            >
              + Dodaj link
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* Podsumowanie */}
      <CollapsibleSection
        title="Podsumowanie"
        icon={FileText}
        isOpen={openSections.summary}
        onToggle={() => toggleSection('summary')}
      >
        <EditableText
          value={cvData.summary || ''}
          onChange={(v) =>
            updateData((d) => {
              d.summary = v;
            })
          }
          placeholder="Twoje podsumowanie zawodowe..."
          multiline
        />
      </CollapsibleSection>

      <ExperienceSection
        experience={cvData.experience}
        updateData={updateData}
        isOpen={openSections.experience}
        onToggle={() => toggleSection('experience')}
      />

      <SkillsSection
        skills={cvData.skills}
        updateData={updateData}
        isOpen={openSections.skills}
        onToggle={() => toggleSection('skills')}
      />

      <EducationSection
        education={cvData.educations || cvData.education}
        updateData={updateData}
        isOpen={openSections.education}
        onToggle={() => toggleSection('education')}
      />

      <PortfolioSection
        portfolio={cvData.portfolio}
        updateData={updateData}
        isOpen={openSections.portfolio}
        onToggle={() => toggleSection('portfolio')}
      />

      <CertificatesSection
        certificates={cvData.certificates}
        updateData={updateData}
        isOpen={openSections.certificates}
        onToggle={() => toggleSection('certificates')}
      />
    </aside>
  );
}
