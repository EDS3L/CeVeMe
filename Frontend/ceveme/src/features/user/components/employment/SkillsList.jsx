import React from 'react';
import { Plus, Save, Trash2, Wrench, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import { toast } from 'react-toastify';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';

export default function SkillsList({
  editId,
  skills,
  onChange,
  setConfirm,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(skills.map((s) => (s.id === id ? { ...s, ...patch } : s)));

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

  const createSkill = async (name, type) => {
    try {
      const res = await create.createSkill(null, email, name, type, null);
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteSkill = async (itemId) => {
    const res = await remove.deleteSkill(itemId);
    toast.success(res.message);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <Wrench size={20} strokeWidth={2} /> Umiejętności
      </h3>

      <ul role="list" className="grid gap-3">
        {skills.map((s) => {
          const isEditing = editId === s.id;
          const isNew = !s.name && !s.type;

          return (
            <li
              key={s.id}
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
                  id={`skill-name-${s.id}`}
                  label="Nazwa"
                  value={s.name || ''}
                  onChange={(v) => update(s.id, { name: v })}
                  placeholder="np. Spring Boot / React"
                  disabled={!isEditing}
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
                    disabled={!isEditing}
                    className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
                  >
                    <option value="">Wybierz…</option>
                    <option value="SOFT">SOFT</option>
                    <option value="TECHNICAL">TECHNICAL</option>
                  </select>
                </div>

                {!isEditing && !editId && (
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      aria-label="Edytuj umiejętność"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => setEditId(s.id)}
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
                      aria-label="Zapisz umiejętność"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={() => {
                        createSkill(s.name, s.type);
                        setEditId(null);
                      }}
                    >
                      <Save size={18} strokeWidth={2} /> Zapisz
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Zapisz edycję umiejętności"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                      onClick={async () => {
                        const result = await createSkill(s.name, s.type);
                        if (result) {
                          s.id = result.id;
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
                        onChange(skills.filter((x) => x.id !== s.id));
                      }
                      setEditId(null);
                    }}
                  >
                    <X size={18} strokeWidth={2} /> Anuluj
                  </button>

                  {!isNew && (
                    <button
                      type="button"
                      aria-label="Usuń umiejętność"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                      onClick={() =>
                        setConfirm({
                          title: 'Usunąć umiejętność?',
                          desc: 'Tej operacji nie można cofnąć.',
                          action: () => {
                            onChange(skills.filter((x) => x.id !== s.id)),
                              deleteSkill(s.id);
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
        aria-label="Dodaj umiejętność"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([...skills, { id, name: '', type: '' }]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj umiejętność
      </button>
    </div>
  );
}
