import React from 'react';
import { Plus, Trash2, BookOpen, Save, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import { toast } from 'react-toastify';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';
import EmploymentInfoEdit from '../../hooks/useEditEmploymentInfo';
import MonthYearPicker from './MonthYearPicker';

export default function CoursesList({
  editId,
  courses,
  onChange,
  setConfirm,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const create = new EmploymentInfoCreate();
  const remove = new EmploymentInfoDelete();
  const edit = new EmploymentInfoEdit();
  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const hasUnsavedNew = courses.some(
    (l) => isUUID(l.id) && !(l.name || '').trim()
  );

  const createCourse = async (courseName, dateOfCourse, courseDescription) => {
    try {
      const res = await create.createCourse(
        courseName,
        dateOfCourse,
        courseDescription
      );
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteCourse = async (itemId) => {
    const res = await remove.deleteCourse(itemId);
    toast.success(res.message);
  };

  const editCourse = async (
    itemId,
    courseName,
    dateOfCourse,
    courseDescription
  ) => {
    const res = await edit.editCourse(
      itemId,
      courseName,
      dateOfCourse,
      courseDescription
    );
    toast.success(res.message);
    return res;
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <BookOpen size={20} strokeWidth={2} /> Kursy
      </h3>

      <ul role="list" className="grid gap-3">
        {courses &&
          courses.map((c) => {
            const isEditing = editId === c.id;

            return (
              <li
                key={c.id}
                className={`grid gap-2 rounded-xl border p-3 transition
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
                    id={`course-name-${c.id}`}
                    label="Nazwa kursu"
                    value={c.courseName || ''}
                    onChange={(v) => update(c.id, { courseName: v })}
                    placeholder="Nazwa…"
                    disabled={!isEditing}
                    onImprove={async () =>
                      update(c.id, {
                        courseName: await onImprove(c.courseName),
                      })
                    }
                  />

                  <div className="grid gap-1">
                    <label
                      htmlFor={`course-date-${c.id}`}
                      className="text-sm font-medium"
                    >
                      Data
                    </label>
                    <MonthYearPicker
                      id={`course-date-${c.id}`}
                      value={c.dateOfCourse || ''}
                      onChange={(e) => update(c.id, { dateOfCourse: e })}
                      disabled={!isEditing}
                      min="1980-01"
                      max="2100-12"
                      className="w-full"
                    />
                  </div>

                  {!isEditing && !editId && (
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        aria-label="Edytuj kurs"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={() => setEditId(c.id)}
                      >
                        <Pencil /> Edytuj
                      </button>
                    </div>
                  )}
                </div>

                <FieldWithAI
                  id={`course-desc-${c.id}`}
                  label="Opis kursu"
                  value={c.courseDescription || ''}
                  onChange={(v) => update(c.id, { courseDescription: v })}
                  placeholder="Czego się nauczyłeś…"
                  multiline
                  aiButton={true}
                  isEditing={isEditing}
                  disabled={!isEditing}
                  onImprove={async () =>
                    update(c.id, {
                      courseDescription: await onImprove(c.courseDescription),
                    })
                  }
                />

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    {isUUID(c.id) ? (
                      <button
                        type="button"
                        aria-label="Zapisz kurs"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={async () => {
                          const result = await createCourse(
                            c.courseName,
                            c.dateOfCourse,
                            c.courseDescription
                          );
                          if (result) {
                            onChange(
                              courses.map((course) =>
                                course.id === c.id
                                  ? {
                                      ...course,
                                      id: result.itemId || result.id,
                                    }
                                  : course
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
                        aria-label="Zapisz edycję kursu"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={async () => {
                          const result = await editCourse(
                            c.id,
                            c.courseName,
                            c.dateOfCourse,
                            c.courseDescription
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
                        if (isUUID(c.id)) {
                          onChange(courses.filter((x) => x.id !== c.id));
                        }
                        setEditId(null);
                      }}
                    >
                      <X size={18} strokeWidth={2} /> Anuluj
                    </button>

                    {!isUUID(c.id) && (
                      <button
                        type="button"
                        aria-label="Usuń kurs"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                        onClick={() =>
                          setConfirm({
                            title: 'Usunąć kurs?',
                            desc: 'Tej operacji nie można cofnąć.',
                            action: () => {
                              onChange(courses.filter((x) => x.id !== c.id));
                              deleteCourse(c.id);
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
        aria-label="Dodaj kurs"
        onClick={() => {
          if (hasUnsavedNew) return;
          const id = crypto.randomUUID();
          onChange([
            ...courses,
            { id, courseName: '', dateOfCourse: '', courseDescription: '' },
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
        <Plus size={18} strokeWidth={2} /> Dodaj kurs
      </button>
    </div>
  );
}
