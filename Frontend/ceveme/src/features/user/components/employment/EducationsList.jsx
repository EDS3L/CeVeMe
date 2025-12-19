import React from 'react';
import { Plus, Save, Trash2, GraduationCap, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import Toggle from '../ui/Toggle';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import { toast } from 'react-toastify';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';
import EmploymentInfoEdit from '../../hooks/useEditEmploymentInfo';
import MonthYearPicker from './MonthYearPicker';

export default function EducationsList({
  editId,
  educations,
  onChange,
  setConfirm,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(educations.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const create = new EmploymentInfoCreate();
  const remove = new EmploymentInfoDelete();

  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const hasUnsavedNew = educations.some(
    (l) => isUUID(l.id) && !(l.name || '').trim()
  );

  const createEducation = async (
    schoolName,
    degree,
    fieldOfStudy,
    startingDate,
    endDate,
    currently
  ) => {
    try {
      const res = await create.createEducation(
        schoolName,
        degree,
        fieldOfStudy,
        startingDate,
        endDate,
        currently
      );
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteEducation = async (itemId) => {
    const res = await remove.deleteEducation(itemId);
    toast.success(res.message);
  };

  const edit = new EmploymentInfoEdit();
  const editEducation = async (
    id,
    schoolName,
    degree,
    fieldOfStudy,
    startingDate,
    endDate,
    currently
  ) => {
    const res = await edit.editEducation(
      id,
      schoolName,
      degree,
      fieldOfStudy,
      startingDate,
      endDate,
      currently
    );
    toast.success(res.message);
    return res;
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <GraduationCap size={20} strokeWidth={2} /> Edukacja
      </h3>

      <ul role="list" className="grid gap-3">
        {educations &&
          educations.map((ed) => {
            const isEditing = editId === ed.id;

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
                      : 'sm:grid-cols-[6fr_6fr]'
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

                  <FieldWithAI
                    id={`edu-field-${ed.id}`}
                    label="Kierunek"
                    value={ed.fieldOfStudy || ''}
                    onChange={(v) => update(ed.id, { fieldOfStudy: v })}
                    placeholder="np. Informatyka"
                    disabled={!isEditing}
                    onImprove={async () =>
                      update(ed.id, {
                        fieldOfStudy: await onImprove(ed.fieldOfStudy),
                      })
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
                    <MonthYearPicker
                      id={`edu-start-${ed.id}`}
                      value={ed.startingDate || ''}
                      onChange={(e) => update(ed.id, { startingDate: e })}
                      disabled={!isEditing}
                      min="1980-01"
                      max="2100-12"
                      className="w-full"
                    />
                  </div>

                  <div className="grid gap-1">
                    <label
                      htmlFor={`edu-end-${ed.id}`}
                      className="text-sm font-medium"
                    >
                      Data zakończenia
                    </label>
                    <MonthYearPicker
                      id={`edu-end-${ed.id}`}
                      value={ed.endDate || ''}
                      onChange={(e) => update(ed.id, { endDate: e })}
                      disabled={!isEditing || ed.currently}
                      min="1980-01"
                      max="2100-12"
                      className="w-full"
                    />
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
                    {isUUID(ed.id) ? (
                      <button
                        type="button"
                        aria-label="Zapisz edukację"
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
                            onChange(
                              educations.map((education) =>
                                education.id === ed.id
                                  ? {
                                      ...education,
                                      id: result.itemId || result.id,
                                    }
                                  : education
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
                        aria-label="Zapisz edycję edukacji"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={async () => {
                          const result = await editEducation(
                            ed.id,
                            ed.schoolName,
                            ed.degree,
                            ed.fieldOfStudy,
                            ed.startingDate,
                            ed.endDate,
                            ed.currently
                          );
                          console.log('zpisz' + result);
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
                        if (isUUID(ed.id)) {
                          onChange(educations.filter((x) => x.id !== ed.id));
                        }
                        setEditId(null);
                      }}
                    >
                      <X size={18} strokeWidth={2} /> Anuluj
                    </button>

                    {!isUUID(ed.id) && (
                      <button
                        type="button"
                        aria-label="Usuń edukację"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                        onClick={() => {
                          setConfirm({
                            title: 'Usunąć edukację?',
                            desc: 'Tej operacji nie można cofnąć.',
                            action: () => {
                              onChange(
                                educations.filter((x) => x.id !== ed.id)
                              );
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
          if (hasUnsavedNew) return;
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
        disabled={hasUnsavedNew}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight transition ${
          hasUnsavedNew
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-ivorymedium/60'
        }`}
      >
        <Plus size={18} strokeWidth={2} /> Dodaj edukację
      </button>
    </div>
  );
}
