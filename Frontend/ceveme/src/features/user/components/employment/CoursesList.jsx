import React from 'react';
import { Plus, Trash2, BookOpen, Save, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import { toast } from 'react-toastify';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';

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

  const createCourse = async (courseName, dateOfCourse, courseDescription) => {
    try {
      const res = await create.createCourse(
        null,
        email,
        courseName,
        dateOfCourse,
        courseDescription,
        null
      );
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };
  const deleteCourse = async (itemId) => {
    const res = await remove.deleteLanguage(itemId);
    toast.success(res.message);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <BookOpen size={20} strokeWidth={2} /> Kursy
      </h3>

      <ul role="list" className="grid gap-3">
        {courses.map((c) => {
          const isEditing = editId === c.id;
          const isNew =
            !c.courseName && !c.dateOfCourse && !c.courseDescription;

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
                    update(c.id, { courseName: await onImprove(c.courseName) })
                  }
                />

                <div className="grid gap-1">
                  <label
                    htmlFor={`course-date-${c.id}`}
                    className="text-sm font-medium"
                  >
                    Data
                  </label>
                  <input
                    id={`course-date-${c.id}`}
                    type="date"
                    value={c.dateOfCourse || ''}
                    onChange={(e) =>
                      update(c.id, { dateOfCourse: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
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
                disabled={!isEditing}
                onImprove={async () =>
                  update(c.id, {
                    courseDescription: await onImprove(c.courseDescription),
                  })
                }
              />

              {isEditing && (
                <div className="flex justify-end gap-2">
                  {isNew ? (
                    <button
                      type="button"
                      aria-label="Zapisz kurs"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => {
                        createCourse(
                          c.courseName,
                          c.dateOfCourse,
                          c.courseDescription
                        );
                        setEditId(null);
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
                        const result = await createCourse(
                          c.courseName,
                          c.dateOfCourse,
                          c.courseDescription
                        );
                        if (result) {
                          c.id = result.id;
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
                      if (isNew) {
                        onChange(courses.filter((x) => x.id !== c.id));
                      }
                      setEditId(null);
                    }}
                  >
                    <X size={18} strokeWidth={2} /> Anuluj
                  </button>

                  {!isNew && (
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
          const id = crypto.randomUUID();
          onChange([
            ...courses,
            { id, courseName: '', dateOfCourse: '', courseDescription: '' },
          ]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj kurs
      </button>
    </div>
  );
}
