// src/components/SidebarEditor.jsx
import React, { useState } from 'react';
import { produce } from 'immer';
import {
  Plus,
  X,
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
                  <X className="w-4 h-4" />
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
              <Plus className="w-4 h-4" /> Dodaj link
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

      {/* Doświadczenie */}
      <CollapsibleSection
        title="Doświadczenie"
        icon={Briefcase}
        isOpen={openSections.experience}
        onToggle={() => toggleSection('experience')}
      >
        <div className="space-y-4">
          {cvData.experience?.map((exp, i) => (
            <div key={i} className="p-3 border rounded relative">
              <button
                onClick={() =>
                  updateData((d) => {
                    d.experience.splice(i, 1);
                  })
                }
                className="absolute top-2 right-2 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <EditableText
                value={exp.title}
                onChange={(v) =>
                  updateData((d) => {
                    d.experience[i].title = v;
                  })
                }
                placeholder="Stanowisko"
                className="font-semibold mb-1"
              />
              <EditableText
                value={exp.company}
                onChange={(v) =>
                  updateData((d) => {
                    d.experience[i].company = v;
                  })
                }
                placeholder="Firma"
                className="mb-1"
              />
              <EditableText
                value={exp.period}
                onChange={(v) =>
                  updateData((d) => {
                    d.experience[i].period = v;
                  })
                }
                placeholder="Okres (np. 2022 – obecnie)"
                className="mb-2"
              />
              <div>
                <h4 className="text-sm font-medium mb-1">Osiągnięcia</h4>
                {exp.achievements?.map((ach, j) => (
                  <div key={j} className="flex items-start gap-2 mb-1">
                    <textarea
                      value={ach.description}
                      onChange={(e) =>
                        updateData((d) => {
                          d.experience[i].achievements[j].description =
                            e.target.value;
                        })
                      }
                      placeholder="Opis osiągnięcia..."
                      className="flex-1 p-2 text-sm border rounded resize-none"
                      rows={2}
                    />
                    <button
                      onClick={() =>
                        updateData((d) => {
                          d.experience[i].achievements.splice(j, 1);
                        })
                      }
                      className="text-red-500 p-1 rounded hover:bg-red-50 mt-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    updateData((d) => {
                      d.experience[i].achievements =
                        d.experience[i].achievements || [];
                      d.experience[i].achievements.push({ description: '' });
                    })
                  }
                  className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
                >
                  <Plus className="w-4 h-4" /> Dodaj osiągnięcie
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              updateData((d) => {
                d.experience = d.experience || [];
                d.experience.push({
                  title: '',
                  company: '',
                  period: '',
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

      {/* Umiejętności */}
      <CollapsibleSection
        title="Umiejętności"
        icon={Code}
        isOpen={openSections.skills}
        onToggle={() => toggleSection('skills')}
      >
        <div className="space-y-4">
          {cvData.skills?.map((grp, i) => (
            <div key={i} className="p-3 border rounded relative">
              <button
                onClick={() =>
                  updateData((d) => {
                    d.skills.splice(i, 1);
                  })
                }
                className="absolute top-2 right-2 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <EditableText
                value={grp.category}
                onChange={(v) =>
                  updateData((d) => {
                    d.skills[i].category = v;
                  })
                }
                placeholder="Kategoria"
                className="font-semibold mb-1"
              />
              {grp.items?.map((item, j) => (
                <div key={j} className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateData((d) => {
                        d.skills[i].items[j].name = e.target.value;
                      })
                    }
                    placeholder="Umiejętność"
                    className="flex-1 p-1 text-sm border rounded"
                  />
                  <button
                    onClick={() =>
                      updateData((d) => {
                        d.skills[i].items.splice(j, 1);
                      })
                    }
                    className="text-red-500 p-1 rounded hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateData((d) => {
                    d.skills[i].items = d.skills[i].items || [];
                    d.skills[i].items.push({ name: '' });
                  })
                }
                className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
              >
                <Plus className="w-4 h-4" /> Dodaj umiejętność
              </button>
            </div>
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

      {/* Edukacja */}
      <CollapsibleSection
        title="Edukacja"
        icon={GraduationCap}
        isOpen={openSections.education}
        onToggle={() => toggleSection('education')}
      >
        <div className="space-y-4">
          {cvData.education?.map((edu, i) => (
            <div key={i} className="p-3 border rounded relative">
              <button
                onClick={() =>
                  updateData((d) => {
                    d.education.splice(i, 1);
                  })
                }
                className="absolute top-2 right-2 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <EditableText
                value={edu.degree}
                onChange={(v) =>
                  updateData((d) => {
                    d.education[i].degree = v;
                  })
                }
                placeholder="Stopień/specjalność"
                className="font-semibold mb-1"
              />
              <EditableText
                value={edu.institution}
                onChange={(v) =>
                  updateData((d) => {
                    d.education[i].institution = v;
                  })
                }
                placeholder="Uczelnia/instytucja"
                className="mb-1"
              />
              <EditableText
                value={edu.period}
                onChange={(v) =>
                  updateData((d) => {
                    d.education[i].period = v;
                  })
                }
                placeholder="Okres (np. 2018–2022)"
              />
            </div>
          ))}
          <button
            onClick={() =>
              updateData((d) => {
                d.education = d.education || [];
                d.education.push({ degree: '', institution: '', period: '' });
              })
            }
            className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
          >
            <Plus className="w-4 h-4" /> Dodaj edukację
          </button>
        </div>
      </CollapsibleSection>

      {/* Portfolio/Projekty */}
      <CollapsibleSection
        title="Portfolio/Projekty"
        icon={Globe}
        isOpen={openSections.portfolio}
        onToggle={() => toggleSection('portfolio')}
      >
        <div className="space-y-4">
          {cvData.portfolio?.map((item, i) => (
            <div key={i} className="p-3 border rounded relative">
              <button
                onClick={() =>
                  updateData((d) => {
                    d.portfolio.splice(i, 1);
                  })
                }
                className="absolute top-2 right-2 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <EditableText
                value={item.title}
                onChange={(v) =>
                  updateData((d) => {
                    d.portfolio[i].title = v;
                  })
                }
                placeholder="Tytuł projektu"
                className="font-semibold mb-1"
              />
              <EditableText
                value={item.url}
                onChange={(v) =>
                  updateData((d) => {
                    d.portfolio[i].url = v;
                  })
                }
                placeholder="URL projektu"
              />
            </div>
          ))}
          <button
            onClick={() =>
              updateData((d) => {
                d.portfolio = d.portfolio || [];
                d.portfolio.push({ title: '', url: '' });
              })
            }
            className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
          >
            <Plus className="w-4 h-4" /> Dodaj projekt
          </button>
        </div>
      </CollapsibleSection>

      {/* Certyfikaty */}
      <CollapsibleSection
        title="Certyfikaty"
        icon={Award}
        isOpen={openSections.certificates}
        onToggle={() => toggleSection('certificates')}
      >
        <div className="space-y-4">
          {cvData.certificates?.map((cert, i) => (
            <div key={i} className="p-3 border rounded relative">
              <button
                onClick={() =>
                  updateData((d) => {
                    d.certificates.splice(i, 1);
                  })
                }
                className="absolute top-2 right-2 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <EditableText
                value={cert.name}
                onChange={(v) =>
                  updateData((d) => {
                    d.certificates[i].name = v;
                  })
                }
                placeholder="Nazwa certyfikatu"
                className="font-semibold mb-1"
              />
              <EditableText
                value={cert.issuer}
                onChange={(v) =>
                  updateData((d) => {
                    d.certificates[i].issuer = v;
                  })
                }
                placeholder="Wystawca"
                className="mb-1"
              />
              <EditableText
                value={cert.date}
                onChange={(v) =>
                  updateData((d) => {
                    d.certificates[i].date = v;
                  })
                }
                placeholder="Data (np. 2023-05)"
              />
            </div>
          ))}
          <button
            onClick={() =>
              updateData((d) => {
                d.certificates = d.certificates || [];
                d.certificates.push({ name: '', issuer: '', date: '' });
              })
            }
            className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
          >
            <Plus className="w-4 h-4" /> Dodaj certyfikat
          </button>
        </div>
      </CollapsibleSection>
    </aside>
  );
}
