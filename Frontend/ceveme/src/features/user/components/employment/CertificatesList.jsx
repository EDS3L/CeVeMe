import React from 'react';
import { Plus, Trash2, Award, Save, Pencil, X } from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import { toast } from 'react-toastify';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';

export default function CertificatesList({
  editId,
  certificates,
  onChange,
  setConfirm,
  onImprove,
  setEditId,
}) {
  const update = (id, patch) =>
    onChange(certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const create = new EmploymentInfoCreate();
  const remove = new EmploymentInfoDelete();
  const userService = new UserService();
  const token = userService.getCookie('accessToken');
  const email = userService.getEmailFromToken(token);

  const createCertificate = async (name, dateOfCertificate) => {
    try {
      const res = await create.createCertificate(
        null,
        email,
        name,
        dateOfCertificate,
        null
      );
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteCertificate = async (itemId) => {
    const res = await remove.deleteCertificate(itemId);
    toast.success(res.message);
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <Award size={20} strokeWidth={2} /> Certyfikaty
      </h3>

      <ul role="list" className="grid gap-3">
        {certificates &&
          certificates.map((c) => {
            const isEditing = editId === c.id;

            return (
              <li
                key={c.id}
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
                    id={`cert-name-${c.id}`}
                    label="Nazwa certyfikatu"
                    value={c.name || ''}
                    onChange={(v) => update(c.id, { name: v })}
                    placeholder="np. AWS SAA"
                    disabled={!isEditing}
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
                      disabled={!isEditing}
                      className="w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus"
                    />
                  </div>

                  {!isEditing && !editId && (
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        aria-label="Edytuj certyfikat"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={() => {
                          setEditId(c.id);
                        }}
                      >
                        <Pencil /> Edytuj
                      </button>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    {isUUID(c.id) ? (
                      <button
                        type="button"
                        aria-label="Zapisz certyfikat"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={async () => {
                          const result = await createCertificate(
                            c.name,
                            c.dateOfCertificate
                          );
                          if (result) {
                            onChange(
                              certificates.map((cert) =>
                                cert.id === c.id
                                  ? { ...cert, id: result.itemId }
                                  : cert
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
                        aria-label="Zapisz edycję certyfikatu"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={async () => {
                          const result = await createCertificate(
                            c.name,
                            c.dateOfCertificate
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
                        if (isUUID(c.id)) {
                          onChange(certificates.filter((x) => x.id !== c.id));
                        }
                        setEditId(null);
                      }}
                    >
                      <X size={18} strokeWidth={2} /> Anuluj
                    </button>

                    {!isUUID(c.id) && (
                      <button
                        type="button"
                        aria-label="Usuń certyfikat"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                        onClick={() =>
                          setConfirm({
                            title: 'Usunąć certyfikat?',
                            desc: 'Tej operacji nie można cofnąć.',
                            action: () => {
                              onChange(
                                certificates.filter((x) => x.id !== c.id)
                              );
                              deleteCertificate(c.id);
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
        aria-label="Dodaj certyfikat"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([...certificates, { id, name: '', dateOfCertificate: '' }]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj certyfikat
      </button>
    </div>
  );
}
