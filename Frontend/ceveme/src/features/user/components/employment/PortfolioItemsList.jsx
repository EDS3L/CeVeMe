import React from 'react';
import { Plus, Trash2, FolderGit2 } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';

export default function PortfolioItemsList({
  isEdit,
  items,
  onChange,
  setConfirm,
  onImprove,
}) {
  const update = (id, patch) =>
    onChange(items.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <FolderGit2 size={20} strokeWidth={2} /> Pozycje portfolio
      </h3>

      <ul role="list" className="grid gap-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="grid gap-2 rounded-xl border border-cloudlight p-3"
          >
            <FieldWithAI
              id={`port-title-${p.id}`}
              label="Tytuł"
              value={p.title || ''}
              onChange={(v) => update(p.id, { title: v })}
              placeholder="Nazwa projektu…"
              disabled={!isEdit}
              onImprove={async () =>
                update(p.id, { title: await onImprove(p.title) })
              }
            />
            <FieldWithAI
              id={`port-desc-${p.id}`}
              label="Opis"
              value={p.description || ''}
              onChange={(v) => update(p.id, { description: v })}
              placeholder="Krótki opis projektu…"
              multiline
              aiButton={true}
              disabled={!isEdit}
              onImprove={async () =>
                update(p.id, { description: await onImprove(p.description) })
              }
            />

            {isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Usuń pozycję"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  onClick={() =>
                    setConfirm({
                      title: 'Usunąć pozycję portfolio?',
                      desc: 'Tej operacji nie można cofnąć.',
                      action: () =>
                        onChange(items.filter((x) => x.id !== p.id)),
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
          aria-label="Dodaj pozycję"
          onClick={() =>
            onChange([
              ...items,
              { id: crypto.randomUUID(), title: '', description: '' },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj pozycję
        </button>
      )}
    </div>
  );
}
