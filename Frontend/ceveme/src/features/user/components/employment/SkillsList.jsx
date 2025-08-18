import React from 'react';
import { Plus, Trash2, Wrench } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';

export default function SkillsList({
  isEdit,
  skills,
  onChange,
  setConfirm,
  onImprove,
}) {
  const update = (id, patch) =>
    onChange(skills.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <Wrench size={20} strokeWidth={2} /> Umiejętności
      </h3>

      <ul role="list" className="grid gap-3">
        {skills.map((s) => (
          <li
            key={s.id}
            className="grid gap-2 rounded-xl border border-cloudlight p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`skill-name-${s.id}`}
                label="Nazwa"
                value={s.name || ''}
                onChange={(v) => update(s.id, { name: v })}
                placeholder="np. Spring Boot / React"
                disabled={!isEdit}
                onImprove={async () =>
                  update(s.id, { name: await onImprove(s.name) })
                }
              />
              <div className="grid gap-1">
                <label
                  htmlFor={`skill-type-${s.id}`}
                  className="text-sm font-medium"
                >
                  Typ
                </label>
                <select
                  id={`skill-type-${s.id}`}
                  value={s.type || ''}
                  onChange={(e) => update(s.id, { type: e.target.value })}
                  disabled={!isEdit}
                  className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
                >
                  <option value="">Wybierz…</option>
                  <option value="SOFT">SOFT</option>
                  <option value="TECHNICAL">TECHNICAL</option>
                </select>
              </div>
            </div>

            {isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Usuń umiejętność"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  onClick={() =>
                    setConfirm({
                      title: 'Usunąć umiejętność?',
                      desc: 'Tej operacji nie można cofnąć.',
                      action: () =>
                        onChange(skills.filter((x) => x.id !== s.id)),
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
          aria-label="Dodaj umiejętność"
          onClick={() =>
            onChange([
              ...skills,
              { id: crypto.randomUUID(), name: '', type: '' },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj umiejętność
        </button>
      )}
    </div>
  );
}
