import React from 'react';
import {
  Plus,
  Save,
  Trash2,
  Link as LinkIcon,
  Pencil,
  X,
  Globe,
} from 'lucide-react';
import {
  SiLinkedin,
  SiInstagram,
  SiGithub,
  SiGitlab,
  SiBehance,
  SiDribbble,
  SiMedium,
  SiStackoverflow,
  SiFacebook,
  SiYoutube,
  SiTiktok,
  SiReddit,
  SiTelegram,
  SiWhatsapp,
  SiDiscord,
  SiSlack,
  SiCodepen,
  SiBitbucket,
  SiKaggle,
  SiGooglescholar,
  SiOrcid,
  SiResearchgate,
  SiDevdotto,
  SiHuggingface,
  SiGoodreads,
  SiSoundcloud,
  SiSpotify,
  SiApple,
  SiAmazon,
  SiCalendly,
  SiLinktree,
  SiNotion,
} from 'react-icons/si';
import FieldWithAI from '../ui/FieldWithAI';
import EmploymentInfoCreate from '../../hooks/useCreateEmploymentInfo';
import UserService from '../../../../hooks/UserService';
import EmploymentInfoDelete from '../../hooks/useDeleteEmploymentInfo';
import { toast } from 'react-toastify';
import EmploymentInfoEdit from '../../hooks/useEditEmploymentInfo';

const PROVIDERS = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    domains: ['linkedin.com'],
    Icon: SiLinkedin,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    domains: ['instagram.com'],
    Icon: SiInstagram,
  },
  { key: 'github', label: 'GitHub', domains: ['github.com'], Icon: SiGithub },
  { key: 'gitlab', label: 'GitLab', domains: ['gitlab.com'], Icon: SiGitlab },
  {
    key: 'behance',
    label: 'Behance',
    domains: ['behance.net'],
    Icon: SiBehance,
  },
  {
    key: 'dribbble',
    label: 'Dribbble',
    domains: ['dribbble.com'],
    Icon: SiDribbble,
  },
  { key: 'medium', label: 'Medium', domains: ['medium.com'], Icon: SiMedium },
  {
    key: 'stackoverflow',
    label: 'Stack Overflow',
    domains: ['stackoverflow.com'],
    Icon: SiStackoverflow,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    domains: ['facebook.com'],
    Icon: SiFacebook,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    domains: ['youtube.com', 'youtu.be'],
    Icon: SiYoutube,
  },
  { key: 'tiktok', label: 'TikTok', domains: ['tiktok.com'], Icon: SiTiktok },
  { key: 'reddit', label: 'Reddit', domains: ['reddit.com'], Icon: SiReddit },
  {
    key: 'telegram',
    label: 'Telegram',
    domains: ['t.me', 'telegram.me', 'telegram.org'],
    Icon: SiTelegram,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    domains: ['wa.me', 'whatsapp.com'],
    Icon: SiWhatsapp,
  },
  {
    key: 'discord',
    label: 'Discord',
    domains: ['discord.gg', 'discord.com'],
    Icon: SiDiscord,
  },
  { key: 'slack', label: 'Slack', domains: ['slack.com'], Icon: SiSlack },
  {
    key: 'codepen',
    label: 'CodePen',
    domains: ['codepen.io'],
    Icon: SiCodepen,
  },
  {
    key: 'bitbucket',
    label: 'Bitbucket',
    domains: ['bitbucket.org'],
    Icon: SiBitbucket,
  },
  { key: 'kaggle', label: 'Kaggle', domains: ['kaggle.com'], Icon: SiKaggle },
  {
    key: 'googlescholar',
    label: 'Google Scholar',
    domains: ['scholar.google.com'],
    Icon: SiGooglescholar,
  },
  { key: 'orcid', label: 'ORCID', domains: ['orcid.org'], Icon: SiOrcid },
  {
    key: 'researchgate',
    label: 'ResearchGate',
    domains: ['researchgate.net'],
    Icon: SiResearchgate,
  },
  { key: 'devto', label: 'DEV', domains: ['dev.to'], Icon: SiDevdotto },
  {
    key: 'huggingface',
    label: 'Hugging Face',
    domains: ['huggingface.co'],
    Icon: SiHuggingface,
  },
  {
    key: 'goodreads',
    label: 'Goodreads',
    domains: ['goodreads.com'],
    Icon: SiGoodreads,
  },
  {
    key: 'soundcloud',
    label: 'SoundCloud',
    domains: ['soundcloud.com'],
    Icon: SiSoundcloud,
  },
  {
    key: 'spotify',
    label: 'Spotify',
    domains: ['spotify.com'],
    Icon: SiSpotify,
  },
  { key: 'apple', label: 'Apple', domains: ['apple.com'], Icon: SiApple },
  {
    key: 'amazon',
    label: 'Amazon',
    domains: ['amazon.com', 'amazon.de', 'amazon.pl'],
    Icon: SiAmazon,
  },
  {
    key: 'calendly',
    label: 'Calendly',
    domains: ['calendly.com'],
    Icon: SiCalendly,
  },
  {
    key: 'linktree',
    label: 'Linktree',
    domains: ['linktr.ee'],
    Icon: SiLinktree,
  },
  { key: 'notion', label: 'Notion', domains: ['notion.so'], Icon: SiNotion },
];

const EXTRA = [{ key: 'website', label: 'Strona / Inny', Icon: Globe }];
const ALL_OPTIONS = [...PROVIDERS, ...EXTRA];

function detectProviderByUrl(url) {
  if (!url) return null;
  try {
    const value = String(url).trim();
    const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const host = u.hostname.replace(/^www\./, '');
    const found = PROVIDERS.find((p) =>
      p.domains.some((d) => host === d || host.endsWith(`.${d}`))
    );
    if (found) return found;
  } catch {
    console.log('');
  }
  return null;
}

function getByKey(key) {
  return (
    ALL_OPTIONS.find((p) => p.key === key) ||
    EXTRA.find((x) => x.key === 'website')
  );
}

function keyFromTitle(title) {
  if (!title) return 'website';
  const t = title.toLowerCase();
  const hit = ALL_OPTIONS.find(
    (p) => p.key === t || p.label.toLowerCase() === t
  );
  return hit ? hit.key : 'website';
}

function resolveProvider(title, url) {
  return detectProviderByUrl(url) || getByKey(keyFromTitle(title));
}

function defaultUrlForProvider(p) {
  if (!p) return '';
  const d = p.domains?.[0];
  return p.key !== 'website' && d ? `https://${d}/` : '';
}

function isGenericUrl(v) {
  if (!v) return true;
  const s = String(v).trim();
  return (
    s === '' ||
    s === 'https://' ||
    s === 'http://' ||
    s === 'https://…' ||
    s === 'http://…'
  );
}

function LinkIconBadge({ title, url, providerKey }) {
  const prov = providerKey
    ? getByKey(providerKey)
    : resolveProvider(title, url);
  const IconComp = prov.Icon;
  const label = (title && title.trim()) || prov.label;
  const effectiveUrl = (() => {
    const raw = String(url || '').trim();
    if (raw) return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const d = defaultUrlForProvider(prov);
    return d || undefined;
  })();
  const clickable = !!effectiveUrl;
  const base =
    'inline-flex items-center justify-center h-10 w-10 rounded-xl border border-cloudlight hover:bg-ivorymedium/60 transition';
  const content = <IconComp size={18} className="shrink-0" />;
  return clickable ? (
    <a
      href={effectiveUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={base}
    >
      {content}
    </a>
  ) : (
    <div aria-label={label} title={label} className={`${base} cursor-default`}>
      {content}
    </div>
  );
}

function ProviderSelect({
  valueKey,
  onChange,
  disabled = false,
  inline = false,
}) {
  const commonClass =
    'h-10 min-w-44 rounded-xl border border-cloudlight px-3 bg-white focus:outline-none focus:ring-2 focus:ring-bookcloth/40';
  if (inline) {
    return (
      <select
        value={valueKey}
        onChange={(e) => onChange(e.target.value)}
        className={`${commonClass} ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      >
        <optgroup label="Najczęstsze">
          {[
            'linkedin',
            'github',
            'instagram',
            'youtube',
            'behance',
            'dribbble',
          ].map((k) => {
            const p = getByKey(k);
            return (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            );
          })}
        </optgroup>
        <optgroup label="Pozostałe">
          {PROVIDERS.filter(
            (p) =>
              ![
                'linkedin',
                'github',
                'instagram',
                'youtube',
                'behance',
                'dribbble',
              ].includes(p.key)
          ).map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
          <option value="website">Strona / Inny</option>
        </optgroup>
      </select>
    );
  }
  return (
    <div className="grid gap-1">
      <label className="text-sm text-kraft">Serwis</label>
      <select
        value={valueKey}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-cloudlight px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-bookcloth/40"
      >
        <optgroup label="Najczęstsze">
          {[
            'linkedin',
            'github',
            'instagram',
            'youtube',
            'behance',
            'dribbble',
          ].map((k) => {
            const p = getByKey(k);
            return (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            );
          })}
        </optgroup>
        <optgroup label="Pozostałe">
          {PROVIDERS.filter(
            (p) =>
              ![
                'linkedin',
                'github',
                'instagram',
                'youtube',
                'behance',
                'dribbble',
              ].includes(p.key)
          ).map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
          <option value="website">Strona / Inny</option>
        </optgroup>
      </select>
    </div>
  );
}

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

  const create = new EmploymentInfoCreate();
  const remove = new EmploymentInfoDelete();
  const userService = new UserService();
  const token = userService.getCookie('accessToken');
  const email = userService.getEmailFromToken(token);

  const isUUID = (str) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      str
    );

  const createLink = async (title, link) => {
    try {
      const res = await create.createLink(null, email, title, link, null);
      toast.success(res.message);
      return res;
    } catch {
      return null;
    }
  };

  const deleteLink = async (itemId) => {
    const res = await remove.deleteLink(itemId);
    toast.success(res.message);
  };

  const edit = new EmploymentInfoEdit();
  const editLink = async (id, title, link) => {
    const res = await edit.editLink(id, title, link);
    toast.success(res.message);
    return res;
  };

  const hasAnyLinks = Array.isArray(links) && links.length > 0;

  return (
    <div className="grid gap-3">
      <h3 className="font-semibold flex items-center gap-2">
        <LinkIcon size={20} strokeWidth={2} /> Linki
      </h3>

      {hasAnyLinks && (
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <LinkIconBadge
              key={`badge-${l.id}`}
              title={l.title}
              url={l.link}
              providerKey={l.providerKey}
            />
          ))}
        </div>
      )}

      <ul role="list" className="grid gap-3">
        {links &&
          links.map((l) => {
            const isEditing = editId === l.id;
            const selectedKey = l.providerKey ?? keyFromTitle(l.title);
            const prov = l.providerKey
              ? getByKey(l.providerKey)
              : resolveProvider(l.title, l.link);
            const ProvIcon = prov.Icon;

            return (
              <li
                key={l.id}
                className={`grid gap-2 rounded-xl border p-3 transition ${
                  isEditing
                    ? 'border-bookcloth/20 bg-bookcloth/5'
                    : 'border-cloudlight'
                }`}
              >
                <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
                  <div className="flex-none inline-flex items-center justify-center h-10 w-10 rounded-xl border border-cloudlight">
                    <ProvIcon size={18} />
                  </div>

                  <ProviderSelect
                    inline
                    disabled={!isEditing}
                    valueKey={selectedKey}
                    onChange={(newKey) => {
                      const prevProv = getByKey(selectedKey);
                      const nextProv = getByKey(newKey);
                      const prevDefault = defaultUrlForProvider(prevProv);
                      const nextDefault = defaultUrlForProvider(nextProv);
                      const shouldReplaceUrl =
                        isGenericUrl(l.link) ||
                        String(l.link || '').trim() === prevDefault;
                      const patch = {
                        providerKey: newKey,
                        title: nextProv.label,
                        link: shouldReplaceUrl ? nextDefault : l.link,
                      };
                      update(l.id, patch);
                    }}
                  />

                  <div className="flex-1 min-w-[220px]">
                    <FieldWithAI
                      id={`link-url-${l.id}`}
                      label=""
                      value={l.link || ''}
                      onChange={(v) => {
                        const next = { link: v };
                        const byUrl = detectProviderByUrl(v);
                        if (byUrl) {
                          next.title = byUrl.label;
                          next.providerKey = byUrl.key;
                        }
                        update(l.id, next);
                      }}
                      placeholder="https://…"
                      disabled={!isEditing}
                      onImprove={async () =>
                        update(l.id, { link: await onImprove(l.link) })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-auto flex-none">
                    {!isEditing && !editId && (
                      <button
                        type="button"
                        aria-label="Edytuj link"
                        className="inline-flex items-center gap-2 rounded-xl px-3 h-10 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                        onClick={() => setEditId(l.id)}
                      >
                        <Pencil /> Edytuj
                      </button>
                    )}

                    {isEditing && (
                      <>
                        {isUUID(l.id) ? (
                          <button
                            type="button"
                            aria-label="Zapisz link"
                            className="inline-flex items-center gap-2 rounded-xl px-3 h-10 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                            onClick={async () => {
                              const result = await createLink(l.title, l.link);
                              if (result) {
                                onChange(
                                  links.map((link) =>
                                    link.id === l.id
                                      ? {
                                          ...link,
                                          id: result.itemId || result.id,
                                        }
                                      : link
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
                            aria-label="Zapisz edycję linku"
                            className="inline-flex items-center gap-2 rounded-xl px-3 h-10 border text-white cursor-pointer border-kraft hover:bg-bookcloth/90 bg-bookcloth"
                            onClick={async () => {
                              const result = await editLink(
                                l.id,
                                l.title,
                                l.link
                              );
                              if (result) setEditId(null);
                            }}
                          >
                            <Save size={18} strokeWidth={2} /> Zapisz edycję
                          </button>
                        )}

                        <button
                          type="button"
                          aria-label="Anuluj edycję"
                          className="inline-flex items-center gap-2 rounded-xl px-3 h-10 border border-cloudlight hover:bg-ivorymedium/60"
                          onClick={() => {
                            if (isUUID(l.id)) {
                              onChange(links.filter((x) => x.id !== l.id));
                            }
                            setEditId(null);
                          }}
                        >
                          <X size={18} strokeWidth={2} /> Anuluj
                        </button>

                        {!isUUID(l.id) && (
                          <button
                            type="button"
                            aria-label="Usuń link"
                            className="inline-flex items-center gap-2 rounded-xl px-3 h-10 border border-cloudlight hover:bg-ivorymedium/60"
                            onClick={() => {
                              setConfirm({
                                title: 'Usunąć link?',
                                desc: 'Tej operacji nie można cofnąć.',
                                action: () => {
                                  onChange(links.filter((x) => x.id !== l.id));
                                  deleteLink(l.id);
                                  setEditId(null);
                                },
                              });
                            }}
                          >
                            <Trash2 size={18} strokeWidth={2} /> Usuń
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>

      <button
        type="button"
        aria-label="Dodaj link"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange([
            ...links,
            { id, providerKey: 'website', title: 'Strona / Inny', link: '' },
          ]);
          setEditId(id);
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-cloudlight hover:bg-ivorymedium/60"
      >
        <Plus size={18} strokeWidth={2} /> Dodaj link
      </button>
    </div>
  );
}
