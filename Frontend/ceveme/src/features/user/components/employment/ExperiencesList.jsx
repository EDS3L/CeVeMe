import React from 'react';
import { Plus, Trash2, Briefcase, Save } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import Toggle from '../ui/Toggle';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';

export default function ExperiencesList({
  isEdit,
  experiences,
  onChange,
  setConfirm,
  errors,
  onImprove,
  setIsEdit,
}) {
  const update = (id, patch) =>
    onChange(experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const token = getCookie('jwt');

  const create = new EmploymentInfoCreate();
  const userService = new UserService();
  const email = userService.getEmailFromToken(token);

  const createExperience = async (
    companyName,
    startingDate,
    endDate,
    currently,
    positionName,
    jobDescription,
    jobAchievements
  ) => {
    await create.createExperience(
      null,
      email,
      companyName,
      startingDate,
      endDate,
      currently,
      positionName,
      jobDescription,
      jobAchievements,
      null
    );
    setIsEdit(false);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <Briefcase size={20} strokeWidth={2} /> Doświadczenie
      </h3>

      <ul role="list" className="grid gap-3">
        {experiences.map((ex) => (
          <li
            key={ex.id}
            className="grid gap-3 rounded-xl border border-cloudlight p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`exp-company-${ex.id}`}
                label="Firma"
                value={ex.companyName || ''}
                onChange={(v) => update(ex.id, { companyName: v })}
                placeholder="Nazwa firmy"
                disabled={!isEdit}
                onImprove={async () =>
                  update(ex.id, {
                    companyName: await onImprove(ex.companyName),
                  })
                }
              />
              <FieldWithAI
                id={`exp-position-${ex.id}`}
                label="Stanowisko"
                value={ex.positionName || ''}
                onChange={(v) => update(ex.id, { positionName: v })}
                placeholder="np. Java Developer"
                disabled={!isEdit}
                onImprove={async () =>
                  update(ex.id, {
                    positionName: await onImprove(ex.positionName),
                  })
                }
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-2 items-end">
              <div className="grid gap-1">
                <label
                  htmlFor={`exp-start-${ex.id}`}
                  className="text-sm font-medium"
                >
                  Data rozpoczęcia
                </label>
                <input
                  id={`exp-start-${ex.id}`}
                  type="date"
                  value={ex.startingDate || ''}
                  onChange={(e) =>
                    update(ex.id, { startingDate: e.target.value })
                  }
                  disabled={!isEdit}
                  className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
                />
              </div>
              <div className="grid gap-1">
                <label
                  htmlFor={`exp-end-${ex.id}`}
                  className="text-sm font-medium"
                >
                  Data zakończenia
                </label>
                <input
                  id={`exp-end-${ex.id}`}
                  type="date"
                  value={ex.endDate || ''}
                  onChange={(e) => update(ex.id, { endDate: e.target.value })}
                  disabled={!isEdit || ex.currently}
                  aria-invalid={!!errors[`exp-dates-${ex.id}`]}
                  className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus disabled:opacity-60"
                />
                {errors[`exp-dates-${ex.id}`] && (
                  <p className="text-xs text-feedbackerror">
                    {errors[`exp-dates-${ex.id}`]}
                  </p>
                )}
              </div>
              <Toggle
                id={`exp-current-${ex.id}`}
                label="Obecnie pracuję"
                checked={!!ex.currently}
                onChange={(v) =>
                  update(ex.id, {
                    currently: v,
                    ...(v ? { endDate: '' } : null),
                  })
                }
                disabled={!isEdit}
              />
            </div>

            <FieldWithAI
              id={`exp-desc-${ex.id}`}
              label="Opis obowiązków"
              value={ex.jobDescription || ''}
              onChange={(v) => update(ex.id, { jobDescription: v })}
              placeholder="Zakres zadań…"
              multiline
              disabled={!isEdit}
              aiButton={true}
              onImprove={async () =>
                update(ex.id, {
                  jobDescription: await onImprove(ex.jobDescription),
                })
              }
            />
            <FieldWithAI
              id={`exp-ach-${ex.id}`}
              label="Osiągnięcia"
              value={ex.jobAchievements || ''}
              onChange={(v) => update(ex.id, { jobAchievements: v })}
              placeholder="Najważniejsze sukcesy…"
              multiline
              disabled={!isEdit}
              aiButton={true}
              onImprove={async () =>
                update(ex.id, {
                  jobAchievements: await onImprove(ex.jobAchievements),
                })
              }
            />

            {isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Usuń doświadczenie"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  onClick={() =>
                    setConfirm({
                      title: 'Usunąć doświadczenie?',
                      desc: 'Tej operacji nie można cofnąć.',
                      action: () =>
                        onChange(experiences.filter((x) => x.id !== ex.id)),
                    })
                  }
                >
                  <Trash2 size={18} strokeWidth={2} /> Usuń
                </button>
                <button
                  type="button"
                  aria-label="Usuń język"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                  onClick={() => {
                    createExperience(
                      ex.companyName,
                      ex.startingDate,
                      ex.endDate,
                      ex.currently,
                      ex.positionName,
                      ex.jobDescription,
                      ex.jobAchievements
                    );
                  }}
                >
                  <Save size={18} strokeWidth={2} /> Zapisz
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {isEdit && (
        <button
          type="button"
          aria-label="Dodaj doświadczenie"
          onClick={() =>
            onChange([
              ...experiences,
              {
                id: crypto.randomUUID(),
                companyName: '',
                startingDate: '',
                endDate: '',
                currently: false,
                positionName: '',
                jobDescription: '',
                jobAchievements: '',
              },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj doświadczenie
        </button>
      )}
    </div>
  );
}
