import React from 'react';
import { Plus, Save, Trash2, Link as LinkIcon } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';

export default function LinksList({
  isEdit,
  links,
  onChange,
  setConfirm,
  onImprove,
  setIsEdit,
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
    setIsEdit(false);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <LinkIcon size={20} strokeWidth={2} /> Linki
      </h3>

      <ul role="list" className="grid gap-3">
        {links.map((l) => (
          <li
            key={l.id}
            className="grid gap-2 rounded-xl border border-cloudlight p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              <FieldWithAI
                id={`link-title-${l.id}`}
                label="Tytuł"
                value={l.title || ''}
                onChange={(v) => update(l.id, { title: v })}
                placeholder="np. LinkedIn, Portfolio"
                disabled={!isEdit}
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
                disabled={!isEdit}
                onImprove={async () =>
                  update(l.id, { link: await onImprove(l.link) })
                }
              />
            </div>

            {isEdit && (
              <div className="flex justify-end">
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
                <button
                  type="button"
                  aria-label="Usuń język"
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                  onClick={() => {
                    createLink(l.title, l.link);
                  }}
                >
                  <Save size={18} strokeWidth={2} /> Zapisz
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {isEdit && (
        <button
          type="button"
          aria-label="Dodaj link"
          onClick={() =>
            onChange([
              ...links,
              { id: crypto.randomUUID(), title: '', link: '' },
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
        >
          <Plus size={18} strokeWidth={2} /> Dodaj link
        </button>
      )}
    </div>
  );
}
