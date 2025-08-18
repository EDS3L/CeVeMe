import React from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';

export default function CoursesList({
  isEdit,
  courses,
  onChange,
  setConfirm,
  onImprove,
}) {
  const update = (id, patch) =>
    onChange(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <BookOpen size={20} strokeWidth={2} /> Kursy
      </h3>

      <ul role="list" className="grid gap-3">
        {courses.map((c) => (
          <li
            key={c.id}
            className="grid gap-2 rounded-xl border border-cloudlight p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`course-name-${c.id}`}
                label="Nazwa kursu"
                value={c.courseName || ''}
                onChange={(v) => update(c.id, { courseName: v })}
                placeholder="Nazwa…"
                disabled={!isEdit}
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
                  disabled={!isEdit}
                  className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
                />
              </div>
            </div>

            <FieldWithAI
              id={`course-desc-${c.id}`}
              label="Opis kursu"
              value={c.courseDescription || ''}
              onChange={(v) => update(c.id, { courseDescription: v })}
              placeholder="Czego się nauczyłeś…"
              multiline
              aiButton={true}
              disabled={!isEdit}
              onImprove={async () =>
                update(c.id, {
                  courseDescription: await onImprove(c.courseDescription),
                })
              }
            />

            {isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Usuń kurs"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  onClick={() =>
                    setConfirm({
                      title: 'Usunąć kurs?',
                      desc: 'Tej operacji nie można cofnąć.',
                      action: () =>
                        onChange(courses.filter((x) => x.id !== c.id)),
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
          aria-label="Dodaj kurs"
          onClick={() =>
            onChange([
              ...courses,
              {
                id: crypto.randomUUID(),
                courseName: '',
                dateOfCourse: '',
                courseDescription: '',
              },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj kurs
        </button>
      )}
    </div>
  );
}
