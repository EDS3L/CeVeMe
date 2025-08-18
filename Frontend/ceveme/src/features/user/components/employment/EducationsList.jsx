import React from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import Toggle from '../ui/Toggle';

export default function EducationsList({
  isEdit,
  educations,
  onChange,
  setConfirm,
  errors,
  onImprove,
}) {
  const update = (id, patch) =>
    onChange(educations.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <GraduationCap size={20} strokeWidth={2} /> Edukacja
      </h3>

      <ul role="list" className="grid gap-3">
        {educations.map((ed) => (
          <li
            key={ed.id}
            className="grid gap-3 rounded-xl border border-cloudlight p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`edu-school-${ed.id}`}
                label="Uczelnia / Szkoła"
                value={ed.schoolName || ''}
                onChange={(v) => update(ed.id, { schoolName: v })}
                placeholder="Nazwa szkoły"
                disabled={!isEdit}
                onImprove={async () =>
                  update(ed.id, { schoolName: await onImprove(ed.schoolName) })
                }
              />
              <FieldWithAI
                id={`edu-degree-${ed.id}`}
                label="Stopień"
                value={ed.degree || ''}
                onChange={(v) => update(ed.id, { degree: v })}
                placeholder="np. Inż., Lic., Mgr"
                disabled={!isEdit}
                onImprove={async () =>
                  update(ed.id, { degree: await onImprove(ed.degree) })
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`edu-field-${ed.id}`}
                label="Kierunek"
                value={ed.fieldOfStudy || ''}
                onChange={(v) => update(ed.id, { fieldOfStudy: v })}
                placeholder="np. Informatyka"
                disabled={!isEdit}
                onImprove={async () =>
                  update(ed.id, {
                    fieldOfStudy: await onImprove(ed.fieldOfStudy),
                  })
                }
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-2 items-end">
              <div className="grid gap-1">
                <label
                  htmlFor={`edu-start-${ed.id}`}
                  className="text-sm font-medium"
                >
                  Data rozpoczęcia
                </label>
                <input
                  id={`edu-start-${ed.id}`}
                  type="date"
                  value={ed.startingDate || ''}
                  onChange={(e) =>
                    update(ed.id, { startingDate: e.target.value })
                  }
                  disabled={!isEdit}
                  className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
                />
              </div>
              <div className="grid gap-1">
                <label
                  htmlFor={`edu-end-${ed.id}`}
                  className="text-sm font-medium"
                >
                  Data zakończenia
                </label>
                <input
                  id={`edu-end-${ed.id}`}
                  type="date"
                  value={ed.endDate || ''}
                  onChange={(e) => update(ed.id, { endDate: e.target.value })}
                  disabled={!isEdit || ed.currently}
                  aria-invalid={!!errors[`edu-dates-${ed.id}`]}
                  className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus disabled:opacity-60"
                />
                {errors[`edu-dates-${ed.id}`] && (
                  <p className="text-xs text-feedbackerror">
                    {errors[`edu-dates-${ed.id}`]}
                  </p>
                )}
              </div>
              <Toggle
                id={`edu-current-${ed.id}`}
                label="W trakcie"
                checked={!!ed.currently}
                onChange={(v) =>
                  update(ed.id, {
                    currently: v,
                    ...(v ? { endDate: '' } : null),
                  })
                }
                disabled={!isEdit}
              />
            </div>

            {isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Usuń edukację"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  onClick={() =>
                    setConfirm({
                      title: 'Usunąć pozycję edukacji?',
                      desc: 'Tej operacji nie można cofnąć.',
                      action: () =>
                        onChange(educations.filter((x) => x.id !== ed.id)),
                    })
                  }
                >
                  <Trash2 size={18} strokeWidth={2} /> Usuń
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {isEdit && (
        <button
          type="button"
          aria-label="Dodaj edukację"
          onClick={() =>
            onChange([
              ...educations,
              {
                id: crypto.randomUUID(),
                schoolName: '',
                degree: '',
                fieldOfStudy: '',
                startingDate: '',
                endDate: '',
                currently: false,
              },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj edukację
        </button>
      )}
    </div>
  );
}
