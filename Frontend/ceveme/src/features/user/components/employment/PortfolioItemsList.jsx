import React from 'react';
import { Plus, Trash2, FolderGit2, Save, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';
import { toast } from 'react-toastify';

export default function PortfolioItemsList({
  editId,
  items,
  onChange,
  setConfirm,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(items.map((p) => (p.id === id ? { ...p, ...patch } : p)));

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

  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const createPortfolio = async (title, description) => {
    try {
      const res = await create.createPortfolio(
        null,
        email,
        title,
        description,
        null
      );
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deletePortfolio = async (itemId) => {
    const res = await remove.deletePortfolio(itemId);
    toast.success(res.message);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <FolderGit2 size={20} strokeWidth={2} /> Pozycje portfolio
      </h3>

      <ul role="list" className="grid gap-3">
        {items.map((p) => {
          const isEditing = editId === p.id;

          return (
            <li
              key={p.id}
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
                    ? 'sm:grid-cols-[6fr]'
                    : 'sm:grid-cols-[6fr]'
                } gap-2`}
              >
                <FieldWithAI
                  id={`port-title-${p.id}`}
                  label="Tytuł"
                  value={p.title || ''}
                  onChange={(v) => update(p.id, { title: v })}
                  placeholder="Nazwa projektu…"
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  isEditing={isEditing}
                  onImprove={async () =>
                    update(p.id, {
                      description: await onImprove(p.description),
                    })
                  }
                />

                {!isEditing && !editId && (
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      aria-label="Edytuj pozycję"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => setEditId(p.id)}
                    >
                      <Pencil /> Edytuj
                    </button>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  {isUUID(p.id) ? (
                    <button
                      type="button"
                      aria-label="Zapisz pozycję"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={async () => {
                        const result = await createPortfolio(
                          p.title,
                          p.description
                        );
                        if (result) {
                          onChange(
                            items.map((item) =>
                              item.id === p.id
                                ? { ...item, id: result.itemId || result.id }
                                : item
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
                      aria-label="Zapisz edycję pozycji"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={async () => {
                        const result = await createPortfolio(
                          p.title,
                          p.description
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
                      if (isUUID(p.id)) {
                        onChange(items.filter((x) => x.id !== p.id));
                      }
                      setEditId(null);
                    }}
                  >
                    <X size={18} strokeWidth={2} /> Anuluj
                  </button>

                  {!isUUID(p.id) && (
                    <button
                      type="button"
                      aria-label="Usuń pozycję"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                      onClick={() => {
                        setConfirm({
                          title: 'Usunąć pozycję portfolio?',
                          desc: 'Tej operacji nie można cofnąć.',
                          action: () => {
                            onChange(items.filter((x) => x.id !== p.id));
                            deletePortfolio(p.id);
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
        aria-label="Dodaj pozycję"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([...items, { id, title: '', description: '' }]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj pozycję
      </button>
    </div>
  );
}
