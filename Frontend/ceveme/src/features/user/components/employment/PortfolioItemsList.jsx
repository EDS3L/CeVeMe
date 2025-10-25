import React from 'react';
import {
  Plus,
  Trash2,
  FolderGit2,
  Save,
  Pencil,
  X,
  Link as LinkIcon,
  ExternalLink,
  Copy,
} from 'lucide-react';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';
import { toast } from 'react-toastify';
import EmploymentInfoEdit from '../../hooks/useEditEmploymentInfo';

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

  const create = new EmploymentInfoCreate();
  const remove = new EmploymentInfoDelete();
  const userService = new UserService();
  const token = userService.getCookie('accessToken');
  const email = userService.getEmailFromToken(token);

  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const normalizeUrl = (val) => {
    if (!val) return '';
    const trimmed = String(val).trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  };

  const isValidUrl = (val) => {
    if (!val) return true;
    try {
      const u = new URL(normalizeUrl(val));
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const getHostname = (val) => {
    try {
      return new URL(normalizeUrl(val)).hostname;
    } catch {
      return '';
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Skopiowano adres URL');
    } catch {
      toast.error('Nie udało się skopiować URL');
    }
  };

  const createPortfolio = async (title, description, url) => {
    try {
      const res = await create.createPortfolio(
        null,
        email,
        title,
        description,
        url,
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

  const edit = new EmploymentInfoEdit();
  const editPortfolio = async (id, title, description, url) => {
    const res = await edit.editPortfolioItem(id, title, description, url);
    toast.success(res.message);
    return res;
  };

  const hasUnsavedNew = items.some(
    (l) => isUUID(l.id) && !(l.name || '').trim()
  );

  return (
    <div className="grid gap-2">
      <h3 className="font-semibold flex items-center gap-2">
        <FolderGit2 size={20} strokeWidth={2} /> Pozycje portfolio
      </h3>

      <ul role="list" className="grid gap-3">
        {items &&
          items.map((p) => {
            const isEditing = editId === p.id;
            const urlRaw = p.url || '';
            const urlValid = isValidUrl(urlRaw);
            const urlHasValue = Boolean(urlRaw?.trim());
            const urlNormalized = normalizeUrl(urlRaw);
            const hostname = getHostname(urlRaw);

            return (
              <li
                key={p.id}
                className={`grid gap-2 rounded-xl border p-3 transition ${
                  isEditing
                    ? 'border-bookcloth/20 bg-bookcloth/5'
                    : 'border-cloudlight'
                }`}
              >
                <div
                  className={`grid ${
                    isEditing || editId ? 'sm:grid-cols-1' : 'sm:grid-cols-1'
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
                    label="Opis projektu"
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

                  <div className="grid gap-1">
                    <label
                      htmlFor={`port-url-${p.id}`}
                      className="text-sm text-graphite"
                    >
                      Adres URL
                    </label>

                    <div
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition focus-within:ring-2 focus-within:ring-bookcloth/40 ${
                        !isEditing ? 'bg-ivorymedium/40' : 'bg-white'
                      } ${
                        urlHasValue && !urlValid
                          ? 'border-red-300'
                          : 'border-cloudlight focus-within:border-bookcloth/50'
                      }`}
                    >
                      <LinkIcon size={18} className="shrink-0" />
                      <input
                        id={`port-url-${p.id}`}
                        type="url"
                        inputMode="url"
                        placeholder="np. https://github.com/moj-projekt"
                        className="w-full outline-none"
                        value={p.url}
                        onChange={(e) => update(p.id, { url: e.target.value })}
                        onBlur={() => {
                          if (urlHasValue) update(p.id, { url: urlNormalized });
                        }}
                        disabled={!isEditing}
                        aria-invalid={urlHasValue && !urlValid}
                        aria-describedby={`port-url-hint-${p.id}`}
                      />

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded-lg px-2 py-1 text-sm border hover:bg-ivorymedium/60 disabled:opacity-50"
                          onClick={() => copyToClipboard(urlNormalized)}
                          disabled={!urlHasValue || !urlValid || !isEditing}
                          title="Kopiuj URL"
                        >
                          <Copy size={16} />
                        </button>
                        <a
                          href={
                            urlValid && urlHasValue ? urlNormalized : undefined
                          }
                          target="_blank"
                          rel="noreferrer"
                          className={`rounded-lg px-2 py-1 text-sm border inline-flex items-center gap-1 hover:bg-ivorymedium/60 ${
                            !urlHasValue || !urlValid
                              ? 'pointer-events-none opacity-50'
                              : ''
                          }`}
                          title="Otwórz w nowej karcie"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>

                    {urlHasValue && (
                      <div
                        id={`port-url-hint-${p.id}`}
                        className="flex items-center gap-2 text-xs"
                      >
                        {urlValid ? (
                          <>
                            {hostname && (
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                                alt="favicon"
                                className="h-4 w-4 rounded"
                                loading="lazy"
                              />
                            )}
                            <span className="text-graphite/80">
                              {hostname || urlNormalized}
                            </span>
                          </>
                        ) : (
                          <span className="text-red-500">
                            Nieprawidłowy adres URL
                          </span>
                        )}
                      </div>
                    )}
                  </div>

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
                            p.description,
                            p.url
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
                          console.log(p.url);
                          const result = await editPortfolio(
                            p.id,
                            p.title,
                            p.description,
                            p.url
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
          if (hasUnsavedNew) return;

          const id = crypto.randomUUID();
          onChange([...items, { id, title: '', description: '', url: '' }]);
          setEditId(id);
        }}
        disabled={hasUnsavedNew}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight transition ${
          hasUnsavedNew
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-ivorymedium/60'
        }`}
        title={
          hasUnsavedNew
            ? 'Zapisz istniejący nowy język zanim dodasz kolejny'
            : 'Dodaj język'
        }
      >
        <Plus size={18} strokeWidth={2} /> Dodaj pozycję
      </button>
    </div>
  );
}
