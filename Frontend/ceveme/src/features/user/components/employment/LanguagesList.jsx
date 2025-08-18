import React from 'react';
import { Plus, Trash2, Languages as LanguagesIcon } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';

export default function LanguagesList({
  isEdit,
  languages,
  onChange,
  setConfirm,
  onImprove,
}) {
  const update = (id, patch) =>
    onChange(languages.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <LanguagesIcon size={20} strokeWidth={2} /> Języki
      </h3>

      <ul role="list" className="grid gap-3">
        {languages.map((l) => (
          <li
            key={l.id}
            className="grid gap-2 rounded-xl border border-cloudlight p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`lang-name-${l.id}`}
                label="Nazwa"
                value={l.name || ''}
                onChange={(v) => update(l.id, { name: v })}
                placeholder="np. English"
                disabled={!isEdit}
                onImprove={async () =>
                  update(l.id, { name: await onImprove(l.name) })
                }
              />
              <FieldWithAI
                id={`lang-level-${l.id}`}
                label="Poziom"
                value={l.level || ''}
                onChange={(v) => update(l.id, { level: v })}
                placeholder="np. C1 / Native"
                disabled={!isEdit}
                onImprove={async () =>
                  update(l.id, { level: await onImprove(l.level) })
                }
              />
            </div>

            {isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Usuń język"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  onClick={() =>
                    setConfirm({
                      title: 'Usunąć język?',
                      desc: 'Tej operacji nie można cofnąć.',
                      action: () =>
                        onChange(languages.filter((x) => x.id !== l.id)),
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
          aria-label="Dodaj język"
          onClick={() =>
            onChange([
              ...languages,
              { id: crypto.randomUUID(), name: '', level: '' },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj język
        </button>
      )}
    </div>
  );
}
