import React, { useEffect, useMemo, useState, useCallback } from "react";
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
} from "lucide-react";

import Tabs from "../components/ui/Tabs";
import Toast from "../components/ui/Toast";
import ConfirmModal from "../components/ui/ConfirmModal";

import LanguagesList from "../components/employment/LanguagesList";
import CertificatesList from "../components/employment/CertificatesList";
import ExperiencesList from "../components/employment/ExperiencesList";
import CoursesList from "../components/employment/CoursesList";
import SkillsList from "../components/employment/SkillsList";
import PortfolioItemsList from "../components/employment/PortfolioItemsList";
import LinksList from "../components/employment/LinksList";
import EducationsList from "../components/employment/EducationsList";

import ImploymentInfoGet from "../hooks/useGetEmploymentInfo";
import UserService from "../../../hooks/UserService";
import Refinement from "../hooks/userAirefinement";

import {
  AITimeoutProvider,
  useAITimeout,
} from "../components/utils/AITimeoutContext";

function EmploymentInfoPageContent() {
  const [activeTab, setActiveTab] = useState("jezyki");
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

  const { hasActiveTimeout, timeoutData } = useAITimeout();

  const api = useMemo(() => new ImploymentInfoGet(), []);
  const userService = useMemo(() => new UserService(), []);
  const token = userService.getCookie("accessToken");
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

  const [errors] = useState({});

  const improveText = async (text) => (text || "").trim();

  const tabs = useMemo(
    () => [
      { key: "jezyki", label: "Języki", icon: LanguagesIcon },
      { key: "certyfikaty", label: "Certyfikaty", icon: Award },
      { key: "doswiadczenie", label: "Doświadczenie", icon: Briefcase },
      { key: "kursy", label: "Kursy", icon: BookOpen },
      { key: "umiejetnosci", label: "Umiejętności", icon: Wrench },
      { key: "portfolio", label: "Portfolio", icon: FolderGit2 },
      { key: "linki", label: "Linki", icon: LinkIcon },
      { key: "edukacja", label: "Edukacja", icon: GraduationCap },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const data = await api.getEmploymentInfo(email);
        if (mounted) setForm(data);
      } catch (error) {
        pushToast("error", "Nie udało się pobrać danych.");
        console.error(error);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [api, email]);

  return (
    <>
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

              {hasActiveTimeout && timeoutData && (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  AI dostępne za:{" "}
                  {Math.floor((timeoutData.howMuchLeft ?? 0) / 60)}:
                  {String((timeoutData.howMuchLeft ?? 0) % 60).padStart(2, "0")}
                </div>
              )}
            </div>
          </header>

          <section className="rounded-2xl border border-cloudlight bg-basewhite shadow-sm">
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

            <div className="p-4 sm:p-6">
              {activeTab === "jezyki" && (
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

              {activeTab === "certyfikaty" && (
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

              {activeTab === "doswiadczenie" && (
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

              {activeTab === "kursy" && (
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

              {activeTab === "umiejetnosci" && (
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

              {activeTab === "portfolio" && (
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

              {activeTab === "linki" && (
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

              {activeTab === "edukacja" && (
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

export default function EmploymentInfoPage() {
  const refinement = useMemo(() => new Refinement(), []);
  const bootstrapFetcher = useCallback(
    () => refinement.checkTimeout("REFINEMENT"),
    [refinement]
  );

  return (
    <AITimeoutProvider bootstrapFetcher={bootstrapFetcher}>
      <EmploymentInfoPageContent />
    </AITimeoutProvider>
  );
}
