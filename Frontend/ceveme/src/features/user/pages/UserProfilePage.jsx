import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  Pencil,
  Save,
  X,
  Loader2,
  Languages as LanguagesIcon,
  Award,
  Briefcase,
  BookOpen,
  Wrench,
  FolderGit2,
  Link as LinkIcon,
  GraduationCap,
  User,
} from 'lucide-react';

import Tabs from '../components/ui/Tabs';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';
import FieldWithAI from '../components/ui/FieldWithAI';
import Toggle from '../components/ui/Toggle';

import LanguagesList from '../components/employment/LanguagesList';
import CertificatesList from '../components/employment/CertificatesList';
import ExperiencesList from '../components/employment/ExperiencesList';
import CoursesList from '../components/employment/CoursesList';
import SkillsList from '../components/employment/SkillsList';
import PortfolioItemsList from '../components/employment/PortfolioItemsList';
import LinksList from '../components/employment/LinksList';
import EducationsList from '../components/employment/EducationsList';
import Navbar from '../../../components/Navbar';
import ImploymentInfoGet from '../hooks/useGetEmploymentInfo';
import EmploymentInfoCreate from '../hooks/useCreateEmploymentInfo';
import UserService from '../../../hooks/UserService';
import { ToastContainer } from 'react-toastify';
import UserDetails from '../../settings/components/UserDetails';

export default function EmploymentInfoPage() {
  const [activeTab, setActiveTab] = useState('jezyki');
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const [languageEditId, setLanguageEditId] = useState(null);
  const [certificateEditId, setCertificateEditId] = useState(null);
  const [experienceEditId, setExperienceEditId] = useState(null);
  const [courseEditId, setCourseEditId] = useState(null);
  const [educationEditId, setEducationEditId] = useState(null);
  const [skillEditId, setSkillEditId] = useState(null);
  const [portfolioEditId, setPortfolioEditId] = useState(null);
  const [linkEditId, setLinkEditId] = useState(null);

  const api = new ImploymentInfoGet();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const token = getCookie('jwt');

  const userService = new UserService();
  const email = userService.getEmailFromToken(token);

  const pushToast = (type, message) =>
    setToasts((t) => [...t, { id: crypto.randomUUID(), type, message }]);
  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const [form, setForm] = useState(() => ({
    languages: [],
    certificates: [],
    experiences: [],
    courses: [],
    skills: [],
    portfolioItems: [],
    links: [],
    educations: [],
  }));

  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    form.experiences.forEach((ex) => {
      if (
        ex.startingDate &&
        ex.endDate &&
        !ex.currently &&
        ex.startingDate > ex.endDate
      ) {
        e[`exp-dates-${ex.id}`] = 'Data zakończenia < daty rozpoczęcia.';
      }
    });
    form.educations.forEach((ed) => {
      if (
        ed.startingDate &&
        ed.endDate &&
        !ed.currently &&
        ed.startingDate > ed.endDate
      ) {
        e[`edu-dates-${ed.id}`] = 'Data zakończenia < daty rozpoczęcia.';
      }
    });
    setErrors(e);
    return e;
  };

  const improveText = async (text) => (text || '').trim();

  const onEdit = () => setIsEdit(true);
  const onCancel = () => {
    setIsEdit(false);
    setErrors({});
    pushToast('info', 'Zmiany odrzucone.');
  };
  const onSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      pushToast('error', 'Popraw błędy w formularzu.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEdit(false);
      pushToast('success', 'Zapisano.');
    }, 300);
  };

  const tabs = useMemo(
    () => [
      { key: 'jezyki', label: 'Języki', icon: LanguagesIcon },
      { key: 'certyfikaty', label: 'Certyfikaty', icon: Award },
      { key: 'doswiadczenie', label: 'Doświadczenie', icon: Briefcase },
      { key: 'kursy', label: 'Kursy', icon: BookOpen },
      { key: 'umiejetnosci', label: 'Umiejętności', icon: Wrench },
      { key: 'portfolio', label: 'Portfolio', icon: FolderGit2 },
      { key: 'linki', label: 'Linki', icon: LinkIcon },
      { key: 'edukacja', label: 'Edukacja', icon: GraduationCap },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getEmploymentInfo(email);
        // console.log(data);
        setForm(data);
      } catch (error) {
        pushToast('error', 'Nie udało się pobrać danych.');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-dvh bg-ivorylight text-slatedark">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 py-6">
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={24}
                strokeWidth={2}
                className="text-bookcloth"
              />
              <h1 className="text-xl font-semibold">Informacje zawodowe</h1>
            </div>
            <div className="flex items-center gap-2">
              {!isEdit ? (
                <button
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-bookcloth text-basewhite hover:opacity-90"
                >
                  <Pencil size={20} strokeWidth={2} /> Edytuj
                </button>
              ) : (
                <>
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-bookcloth text-basewhite hover:opacity-90 disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2
                        size={20}
                        strokeWidth={2}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={20} strokeWidth={2} />
                    )}
                    Zapisz
                  </button>
                  <button
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-cloudlight hover:bg-ivorymedium/60"
                  >
                    <X size={20} strokeWidth={2} /> Anuluj
                  </button>
                </>
              )}
            </div>
          </header>

          <section className="rounded-2xl border border-cloudlight bg-basewhite shadow-sm">
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

            <div className="p-4 sm:p-6">
              {activeTab === 'jezyki' && (
                <LanguagesList
                  editId={languageEditId}
                  languages={form.languages}
                  onChange={(languages) =>
                    setForm((f) => ({ ...f, languages }))
                  }
                  setConfirm={setConfirm}
                  onImprove={improveText}
                  setEditId={setLanguageEditId}
                  onCancel={() => setLanguageEditId(null)}
                  pushToast={pushToast}
                />
              )}

              {activeTab === 'certyfikaty' && (
                <CertificatesList
                  editId={certificateEditId}
                  certificates={form.certificates}
                  onChange={(certificates) =>
                    setForm((f) => ({ ...f, certificates }))
                  }
                  setConfirm={setConfirm}
                  onImprove={improveText}
                  setEditId={setCertificateEditId}
                  onCancel={() => setCertificateEditId(null)}
                  pushToast={pushToast}
                />
              )}

              {activeTab === 'doswiadczenie' && (
                <ExperiencesList
                  editId={experienceEditId}
                  experiences={form.experiences}
                  onChange={(experiences) =>
                    setForm((f) => ({ ...f, experiences }))
                  }
                  setConfirm={setConfirm}
                  errors={errors}
                  onImprove={improveText}
                  setEditId={setExperienceEditId}
                  onCancel={() => setExperienceEditId(null)}
                  pushToast={pushToast}
                />
              )}

              {activeTab === 'kursy' && (
                <CoursesList
                  editId={courseEditId}
                  courses={form.courses}
                  onChange={(courses) => setForm((f) => ({ ...f, courses }))}
                  setConfirm={setConfirm}
                  onImprove={improveText}
                  setEditId={setCourseEditId}
                  onCancel={() => setCourseEditId(null)}
                  pushToast={pushToast}
                />
              )}

              {activeTab === 'umiejetnosci' && (
                <SkillsList
                  editId={skillEditId}
                  skills={form.skills}
                  onChange={(skills) => setForm((f) => ({ ...f, skills }))}
                  setConfirm={setConfirm}
                  onImprove={improveText}
                  setEditId={setSkillEditId}
                  onCancel={() => setSkillEditId(null)}
                  pushToast={pushToast}
                />
              )}

              {activeTab === 'portfolio' && (
                <PortfolioItemsList
                  editId={portfolioEditId}
                  items={form.portfolioItems}
                  onChange={(items) =>
                    setForm((f) => ({ ...f, portfolioItems: items }))
                  }
                  setConfirm={setConfirm}
                  onImprove={improveText}
                  setEditId={setPortfolioEditId}
                  onCancel={() => setPortfolioEditId(null)}
                  pushToast={pushToast}
                />
              )}

              {activeTab === 'linki' && (
                <LinksList
                  editId={linkEditId}
                  links={form.links}
                  onChange={(links) => setForm((f) => ({ ...f, links }))}
                  setConfirm={setConfirm}
                  onImprove={improveText}
                  setEditId={setLinkEditId}
                  onCancel={() => setLinkEditId(null)}
                  pushToast={pushToast}
                />
              )}

              {activeTab === 'edukacja' && (
                <EducationsList
                  editId={educationEditId}
                  educations={form.educations}
                  onChange={(educations) =>
                    setForm((f) => ({ ...f, educations }))
                  }
                  setConfirm={setConfirm}
                  errors={errors}
                  onImprove={improveText}
                  setEditId={setEducationEditId}
                  onCancel={() => setEducationEditId(null)}
                  pushToast={pushToast}
                />
              )}
            </div>
          </section>
        </main>

        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
          ))}
        </div>

        <ConfirmModal
          open={!!confirm}
          title={confirm?.title}
          desc={confirm?.desc}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm?.action?.();
            setConfirm(null);
          }}
        />
      </div>
    </>
  );
}

// user - > emplyment infio(list) -> experince(list) -> jobs(list) -> education(list)
//   Frontend: E
