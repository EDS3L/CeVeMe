import React from 'react';
import { Plus, Trash2, Briefcase, Save, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import Toggle from '../ui/Toggle';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';
import { toast } from 'react-toastify';
import Refinement from '../../hooks/userAirefinement';

export default function ExperiencesList({
  editId,
  experiences,
  onChange,
  setConfirm,
  errors,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const create = new EmploymentInfoCreate();
  const remove = new EmploymentInfoDelete();
  const userService = new UserService();
  const token = userService.getCookie('accessToken');
  const email = userService.getEmailFromToken(token);

  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const createExperience = async (
    companyName,
    startingDate,
    endDate,
    currently,
    positionName,
    jobDescription,
    jobAchievements
  ) => {
    try {
      const res = await create.createExperience(
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
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteExperience = async (itemId) => {
    const res = await remove.deleteExperience(itemId);
    toast.success(res.message);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <Briefcase size={20} strokeWidth={2} /> Doświadczenie
      </h3>

      <ul role="list" className="grid gap-3">
        {experiences &&
          experiences.map((ex) => {
            const editing = editId === ex.id;

            return (
              <li
                key={ex.id}
                className={`grid gap-3 rounded-xl border p-3 transition
                ${
                  editing
                    ? 'border-bookcloth/20 bg-bookcloth/5'
                    : 'border-cloudlight'
                }
              `}
              >
                <div
                  className={`grid ${
                    editing || editId
                      ? 'sm:grid-cols-[6fr_6fr]'
                      : 'sm:grid-cols-[6fr_6fr_1fr]'
                  } gap-2`}
                >
                  <FieldWithAI
                    id={`exp-company-${ex.id}`}
                    label="Firma"
                    value={ex.companyName || ''}
                    onChange={(v) => update(ex.id, { companyName: v })}
                    placeholder="Nazwa firmy"
                    disabled={!editing}
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
                    disabled={!editing}
                    onImprove={async () =>
                      update(ex.id, {
                        positionName: await onImprove(ex.positionName),
                      })
                    }
                  />

                  {!editing && !editId && (
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        aria-label="Edytuj doświadczenie"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={() => setEditId(ex.id)}
                      >
                        <Pencil /> Edytuj
                      </button>
                    </div>
                  )}
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
                      disabled={!editing}
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
                      onChange={(e) =>
                        update(ex.id, { endDate: e.target.value })
                      }
                      disabled={!editing || ex.currently}
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
                    disabled={!editing}
                  />
                </div>

                <FieldWithAI
                  id={`exp-desc-${ex.id}`}
                  label="Opis obowiązków"
                  value={ex.jobDescription || ''}
                  onChange={(v) => update(ex.id, { jobDescription: v })}
                  placeholder="Zakres zadań…"
                  multiline
                  disabled={!editing}
                  aiButton={true}
                  isEditing={editing}
                  onImprove={async () =>
                    update(ex.id, {
                      jobDescription: await onImprove(ex.jobDescription),
                    })
                  }
                />

                <FieldWithAI
                  id={`exp-ach-${ex.id}`}
                  label="Osiągnięcia w pracy"
                  value={ex.jobAchievements || ''}
                  onChange={(v) => update(ex.id, { jobAchievements: v })}
                  placeholder="Najważniejsze sukcesy…"
                  multiline
                  disabled={!editing}
                  isEditing={editing}
                  aiButton={true}
                  onImprove={async () =>
                    update(ex.id, {
                      jobAchievements: await onImprove(ex.jobAchievements),
                    })
                  }
                />

                {editing && (
                  <div className="flex justify-end gap-2">
                    {isUUID(ex.id) ? (
                      <button
                        type="button"
                        aria-label="Zapisz doświadczenie"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={async () => {
                          const result = await createExperience(
                            ex.companyName,
                            ex.startingDate,
                            ex.endDate,
                            ex.currently,
                            ex.positionName,
                            ex.jobDescription,
                            ex.jobAchievements
                          );
                          if (result) {
                            onChange(
                              experiences.map((experience) =>
                                experience.id === ex.id
                                  ? {
                                      ...experience,
                                      id: result.itemId || result.id,
                                    }
                                  : experience
                              )
                            );
                            setEditId(null);
                          }
                        }}
                      >
                        <Save size={18} strokeWidth={2} /> Zapisz
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label="Zapisz edycję doświadczenia"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={async () => {
                          const result = await createExperience(
                            ex.companyName,
                            ex.startingDate,
                            ex.endDate,
                            ex.currently,
                            ex.positionName,
                            ex.jobDescription,
                            ex.jobAchievements
                          );
                          if (result) {
                            setEditId(null);
                          }
                        }}
                      >
                        <Save size={18} strokeWidth={2} /> Zapisz edycję
                      </button>
                    )}

                    <button
                      type="button"
                      aria-label="Anuluj edycję"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                      onClick={() => {
                        if (isUUID(ex.id)) {
                          onChange(experiences.filter((x) => x.id !== ex.id));
                        }
                        setEditId(null);
                      }}
                    >
                      <X size={18} strokeWidth={2} /> Anuluj
                    </button>

                    {!isUUID(ex.id) && (
                      <button
                        type="button"
                        aria-label="Usuń doświadczenie"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                        onClick={() =>
                          setConfirm({
                            title: 'Usunąć doświadczenie?',
                            desc: 'Tej operacji nie można cofnąć.',
                            action: () => {
                              onChange(
                                experiences.filter((x) => x.id !== ex.id)
                              );
                              deleteExperience(ex.id);
                              setEditId(null);
                            },
                          })
                        }
                      >
                        <Trash2 size={18} strokeWidth={2} /> Usuń
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
      </ul>

      <button
        type="button"
        aria-label="Dodaj doświadczenie"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([
            ...experiences,
            {
              id,
              companyName: '',
              startingDate: '',
              endDate: '',
              currently: false,
              positionName: '',
              jobDescription: '',
              jobAchievements: '',
            },
          ]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj doświadczenie
      </button>
    </div>
  );
}
