import {
  Plus,
  Trash2,
  Languages as LanguagesIcon,
  Save,
  Pencil,
  X,
} from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';
import { toast } from 'react-toastify';

export default function LanguagesList({
  editId,
  languages,
  onChange,
  setConfirm,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(languages.map((l) => (l.id === id ? { ...l, ...patch } : l)));

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

  const createLanguage = async (name, level) => {
    try {
      const res = await create.createLanguage(null, email, name, level, null);
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteLanguage = async (itemId) => {
    const res = await remove.deleteLanguage(itemId);
    toast.success(res.message);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <LanguagesIcon size={20} strokeWidth={2} /> Języki
      </h3>

      <ul role="list" className="grid gap-3">
        {languages.map((l) => {
          const isEditing = editId === l.id;
          return (
            <li
              key={l.id}
              className={`grid gap-2 rounded-xl border p-3 transition
    ${isEditing ? 'border-bookcloth/20 bg-bookcloth/5' : 'border-cloudlight'}
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
                  id={`lang-name-${l.id}`}
                  label="Nazwa"
                  value={l.name || ''}
                  onChange={(v) => update(l.id, { name: v })}
                  placeholder="np. English"
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  onImprove={async () =>
                    update(l.id, { level: await onImprove(l.level) })
                  }
                />

                {!isEditing && !editId && (
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      aria-label="Usuń język"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => {
                        setEditId(l.id);
                      }}
                    >
                      <Pencil /> Edytuj
                    </button>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  {!l.name && !l.level ? (
                    <button
                      type="button"
                      aria-label="Zapisz język"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => {
                        createLanguage(l.name, l.level);
                        setEditId(null);
                      }}
                    >
                      <Save size={18} strokeWidth={2} /> Zapisz
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Zapisz edycję języka"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={async () => {
                        const result = await createLanguage(l.name, l.level);
                        if (result) {
                          l.id = result.itemId;
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
                      if (!l.name && !l.level) {
                        onChange(languages.filter((x) => x.id !== l.id));
                      }
                      setEditId(null);
                    }}
                  >
                    <X size={18} strokeWidth={2} /> Anuluj
                  </button>

                  {(l.name || l.level) && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                      onClick={() => {
                        setConfirm({
                          title: 'Usunąć język?',
                          desc: 'Tej operacji nie można cofnąć.',
                          action: () => {
                            onChange(languages.filter((x) => x.id !== l.id));
                            deleteLanguage(l.id);
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
        aria-label="Dodaj język"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([...languages, { id: id, name: '', level: '' }]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj język
      </button>
    </div>
  );
}
