import React from 'react';
import { Plus, Trash2, Award } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';

export default function CertificatesList({
  isEdit,
  certificates,
  onChange,
  setConfirm,
  onImprove,
}) {
  const update = (id, patch) =>
    onChange(certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <Award size={20} strokeWidth={2} /> Certyfikaty
      </h3>

      <ul role="list" className="grid gap-3">
        {certificates.map((c) => (
          <li
            key={c.id}
            className="grid gap-2 rounded-xl border border-cloudlight p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`cert-name-${c.id}`}
                label="Nazwa certyfikatu"
                value={c.name || ''}
                onChange={(v) => update(c.id, { name: v })}
                placeholder="np. AWS SAA"
                disabled={!isEdit}
                onImprove={async () =>
                  update(c.id, { name: await onImprove(c.name) })
                }
              />
              <div className="grid gap-1">
                <label
                  htmlFor={`cert-date-${c.id}`}
                  className="text-sm font-medium"
                >
                  Data uzyskania
                </label>
                <input
                  id={`cert-date-${c.id}`}
                  type="date"
                  value={c.dateOfCertificate || ''}
                  onChange={(e) =>
                    update(c.id, { dateOfCertificate: e.target.value })
                  }
                  disabled={!isEdit}
                  className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
                />
              </div>
            </div>

            {isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Usuń certyfikat"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  onClick={() =>
                    setConfirm({
                      title: 'Usunąć certyfikat?',
                      desc: 'Tej operacji nie można cofnąć.',
                      action: () =>
                        onChange(certificates.filter((x) => x.id !== c.id)),
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
          aria-label="Dodaj certyfikat"
          onClick={() =>
            onChange([
              ...certificates,
              { id: crypto.randomUUID(), name: '', dateOfCertificate: '' },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj certyfikat
        </button>
      )}
    </div>
  );
}
