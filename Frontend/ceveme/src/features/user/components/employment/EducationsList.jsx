import React from 'react';
import { Plus, Save, Trash2, GraduationCap, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import Toggle from '../ui/Toggle';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import { toast } from 'react-toastify';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';

export default function EducationsList({
  editId,
  educations,
  onChange,
  setConfirm,
  errors,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(educations.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const token = getCookie('jwt');

  const create = new EmploymentInfoCreate();
  const remove = new EmploymentInfoDelete();
  const userService = new UserService();
  const email = userService.getEmailFromToken(token);

  const createEducation = async (
    schoolName,
    degree,
    fieldOfStudy,
    startingDate,
    endDate,
    currently
  ) => {
    try {
      const res = await await create.createEducation(
        null,
        email,
        schoolName,
        degree,
        fieldOfStudy,
        startingDate,
        endDate,
        currently,
        null
      );
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteEducation = async (itemId) => {
    const res = await remove.deleteLanguage(itemId);
    toast.success(res.message);
  };

  const isEmpty = (ed) =>
    !(
      ed.schoolName?.trim() ||
      ed.degree?.trim() ||
      ed.fieldOfStudy?.trim() ||
      ed.startingDate ||
      ed.endDate ||
      ed.currently
    );

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <GraduationCap size={20} strokeWidth={2} /> Edukacja
      </h3>

      <ul role="list" className="grid gap-3">
        {educations.map((ed) => {
          const isEditing = editId === ed.id;
          const empty = isEmpty(ed);

          return (
            <li
              key={ed.id}
              className={`grid gap-3 rounded-xl border p-3 transition
                ${
                  isEditing
                    ? 'border-bookcloth/20 bg-bookcloth/5'
                    : 'border-cloudlight'
                }
              `}
            >
              <div
                className={`grid ${
                  isEditing || editId
                    ? 'sm:grid-cols-[6fr_6fr]'
                    : 'sm:grid-cols-[6fr_6fr_1fr]'
                } gap-2`}
              >
                <FieldWithAI
                  id={`edu-school-${ed.id}`}
                  label="Uczelnia / Szkoła"
                  value={ed.schoolName || ''}
                  onChange={(v) => update(ed.id, { schoolName: v })}
                  placeholder="Nazwa szkoły"
                  disabled={!isEditing}
                  onImprove={async () =>
                    update(ed.id, {
                      schoolName: await onImprove(ed.schoolName),
                    })
                  }
                />
                <FieldWithAI
                  id={`edu-degree-${ed.id}`}
                  label="Stopień"
                  value={ed.degree || ''}
                  onChange={(v) => update(ed.id, { degree: v })}
                  placeholder="np. Inż., Lic., Mgr"
                  disabled={!isEditing}
                  onImprove={async () =>
                    update(ed.id, { degree: await onImprove(ed.degree) })
                  }
                />

                {!isEditing && !editId && (
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      aria-label="Edytuj edukację"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => setEditId(ed.id)}
                    >
                      <Pencil /> Edytuj
                    </button>
                  </div>
                )}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing || ed.currently}
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
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  {empty ? (
                    <button
                      type="button"
                      aria-label="Zapisz edukację"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => {
                        createEducation(
                          ed.schoolName,
                          ed.degree,
                          ed.fieldOfStudy,
                          ed.startingDate,
                          ed.endDate,
                          ed.currently
                        );
                        setEditId(null);
                      }}
                    >
                      <Save size={18} strokeWidth={2} /> Zapisz
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Zapisz edycję edukacji"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={async () => {
                        const result = await createEducation(
                          ed.schoolName,
                          ed.degree,
                          ed.fieldOfStudy,
                          ed.startingDate,
                          ed.endDate,
                          ed.currently
                        );
                        if (result) {
                          ed.id = result.itemId;
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
                      if (empty) {
                        onChange(educations.filter((x) => x.id !== ed.id));
                      }
                      setEditId(null);
                    }}
                  >
                    <X size={18} strokeWidth={2} /> Anuluj
                  </button>

                  {!empty && (
                    <button
                      type="button"
                      aria-label="Usuń edukację"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                      onClick={() => {
                        setConfirm({
                          title: 'Usunąć język?',
                          desc: 'Tej operacji nie można cofnąć.',
                          action: () => {
                            onChange(educations.filter((x) => x.id !== ed.id));
                            deleteEducation(ed.id);
                            setEditId(null);
                          },
                        });
                      }}
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
        aria-label="Dodaj edukację"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([
            ...educations,
            {
              id,
              schoolName: '',
              degree: '',
              fieldOfStudy: '',
              startingDate: '',
              endDate: '',
              currently: false,
            },
          ]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj edukację
      </button>
    </div>
  );
}
