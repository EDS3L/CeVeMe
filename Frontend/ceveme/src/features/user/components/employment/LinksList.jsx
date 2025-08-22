import React from 'react';
import { Plus, Save, Trash2, Link as LinkIcon, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';

export default function LinksList({
  editId,
  links,
  onChange,
  setConfirm,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const token = getCookie('jwt');

  const create = new EmploymentInfoCreate();
  const userService = new UserService();
  const email = userService.getEmailFromToken(token);

  const createLink = async (title, link) => {
    await create.createLink(null, email, title, link, null);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <LinkIcon size={20} strokeWidth={2} /> Linki
      </h3>

      <ul role="list" className="grid gap-3">
        {links.map((l) => {
          const isEditing = editId === l.id;
          const isNew = !l.title && !l.link;

          return (
            <li
              key={l.id}
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
                  id={`link-title-${l.id}`}
                  label="Tytuł"
                  value={l.title || ''}
                  onChange={(v) => update(l.id, { title: v })}
                  placeholder="np. LinkedIn, Portfolio"
                  disabled={!isEditing}
                  onImprove={async () =>
                    update(l.id, { title: await onImprove(l.title) })
                  }
                />
                <FieldWithAI
                  id={`link-url-${l.id}`}
                  label="URL"
                  value={l.link || ''}
                  onChange={(v) => update(l.id, { link: v })}
                  placeholder="https://…"
                  disabled={!isEditing}
                  onImprove={async () =>
                    update(l.id, { link: await onImprove(l.link) })
                  }
                />

                {!isEditing && !editId && (
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      aria-label="Edytuj link"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => setEditId(l.id)}
                    >
                      <Pencil /> Edytuj
                    </button>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  {isNew ? (
                    <button
                      type="button"
                      aria-label="Zapisz link"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => {
                        createLink(l.title, l.link);
                        setEditId(null);
                      }}
                    >
                      <Save size={18} strokeWidth={2} /> Zapisz
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Zapisz edycję linku"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => {
                        createLink(l.title, l.link);
                        setEditId(null);
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
                        onChange(links.filter((x) => x.id !== l.id));
                      }
                      setEditId(null);
                    }}
                  >
                    <X size={18} strokeWidth={2} /> Anuluj
                  </button>

                  {!isNew && (
                    <button
                      type="button"
                      aria-label="Usuń link"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                      onClick={() =>
                        setConfirm({
                          title: 'Usunąć link?',
                          desc: 'Tej operacji nie można cofnąć.',
                          action: () =>
                            onChange(links.filter((x) => x.id !== l.id)),
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
        aria-label="Dodaj link"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([...links, { id, title: '', link: '' }]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj link
      </button>
    </div>
  );
}
