import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Building2,
  MapPin,
  Bookmark,
  Briefcase,
  Clock,
  ClockFading,
  ScrollText,
  ExternalLink,
  CheckCircle2,
  Banknote,
} from "lucide-react";
import Modal from "../ui/Modal";
import JobMap from "./JobMap";

const formatSalary = (min, max, currency = "PLN", type) => {
  const formatter = new Intl.NumberFormat("pl-PL");

  if (!min && !max) return null;

  const typeLabel = type === "HOURLY" ? "/godz." : "/mies.";
  const currencyLabel = currency || "PLN";

  if (min && max) {
    if (min === max) {
      return `${formatter.format(min)} ${currencyLabel}${typeLabel}`;
    }
    return `${formatter.format(min)} - ${formatter.format(max)} ${currencyLabel}${typeLabel}`;
  }

  if (min) return `od ${formatter.format(min)} ${currencyLabel}${typeLabel}`;
  if (max) return `do ${formatter.format(max)} ${currencyLabel}${typeLabel}`;

  return null;
};

export default function JobModal({ open, onClose, job }) {
  const nav = useNavigate();
  if (!open || !job) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("pl-PL") : "—");

  const showMap = job.street && job.latitude && job.longitude;
  const fullAddress =
    job.street && job.city
      ? `${job.street}, ${job.city}`
      : job.city || "Brak adresu";

  const getPortalName = (url) => {
    if (!url) return "Nieznane źródło";
    try {
      const hostname = new URL(url).hostname;
      if (hostname.includes("justjoin.it")) return "JustJoin.it";
      if (hostname.includes("pracuj.pl")) return "Pracuj.pl";
      if (hostname.includes("bulldogjob")) return "Bulldog Job";
      if (hostname.includes("nofluffjobs")) return "No Fluff Jobs";
      return hostname.replace("www.", "");
    } catch {
      return "Nieznane źródło";
    }
  };
  const truncateHtml = (html, maxWords = 50) => {
    if (!html) return null;

    // Remove HTML tags for counting
    const text = html.replace(/<[^>]*>/g, " ").trim();
    const words = text.split(/\s+/);

    if (words.length <= maxWords) return html;

    // Return first maxWords
    const truncated = words.slice(0, maxWords).join(" ");
    return `${truncated}... <em class="text-gray-500">(więcej na portalu)</em>`;
  };

  const jobTags = [
    job.experienceLevel
      ? job.experienceLevel.charAt(0).toUpperCase() +
        job.experienceLevel.slice(1)
      : "",
    job.employmentType
      ? job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)
      : "",
  ].filter(Boolean);

  return (
    <Modal
      open={open}
      onClose={onClose}
      modalCss="max-w-6xl overflow-hidden rounded-xl"
      backdropClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute cursor-pointer right-4 top-4 p-2 rounded-full text-gray-500 bg-white hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 shadow-md"
        aria-label="Zamknij szczegóły"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="p-6 md:p-10 max-h-[90vh] overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* HEADER */}
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold text-gray-900">
                  {job.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-lg">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Building2 className="w-5 h-5 text-baseblack" />
                    {job.company || "—"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <MapPin className="w-5 h-5 text-baseblack" />
                    {job.city || "Lokalizacja zdalna"}
                  </span>

                  {(job.salaryMin || job.salaryMax) && (
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Banknote className="w-5 h-5 text-bookcloth" />
                      <span className="font-bold text-bookcloth">
                        {formatSalary(
                          job.salaryMin,
                          job.salaryMax,
                          job.salaryCurrency,
                          job.salaryType,
                        )}
                      </span>
                      {job.salaryType === "HOURLY" && (
                        <Clock className="w-4 h-4 text-kraft" />
                      )}
                    </span>
                  )}
                </div>
                <div className=" flex flex-wrap gap-2">
                  {jobTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium bg-kraft text-basewhite rounded-full shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-2 mt-4 mr-4 sm:mt-0 self-start sm:self-auto">
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-base font-semibold text-basewhite bg-bookcloth rounded-lg hover:opacity-90 transition-colors focus:outline-none focus:ring-4 focus:ring-manilla shadow-lg hover:shadow-xl"
                >
                  Zobacz ofertę
                </a>
              </div>
            </header>

            {/* SECTIONS */}
            <div className="space-y-6">
              <JobSummarySection
                dateAdded={formatDate(job.dateAdded)}
                dateEnding={formatDate(job.dateEnding)}
              />

              {/* Info Section */}
              <section className="bg-gradient-to-br from-ivorylight to-white p-6 rounded-xl border border-kraft/20">
                <h4 className="text-xl font-semibold text-slatedark mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-bookcloth" />
                  Informacje o ofercie
                </h4>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-slatedark min-w-[120px]">
                      Stanowisko:
                    </span>
                    <span>{job.title || "—"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-slatedark min-w-[120px]">
                      Firma:
                    </span>
                    <span>{job.company || "—"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-slatedark min-w-[120px]">
                      Lokalizacja:
                    </span>
                    <span>{job.city || "—"}</span>
                  </div>
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-bookcloth/5 to-kraft/5 rounded-lg border border-bookcloth/20">
                      <span className="font-semibold text-slatedark min-w-[120px] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-bookcloth" />
                        Wynagrodzenie:
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-bookcloth text-lg">
                          {formatSalary(
                            job.salaryMin,
                            job.salaryMax,
                            job.salaryCurrency,
                            job.salaryType,
                          )}
                        </span>
                        {job.salaryType && (
                          <span className="text-sm text-clouddark flex items-center gap-1">
                            {job.salaryType === "HOURLY" ? (
                              <>
                                <Clock className="w-3 h-3" /> Stawka godzinowa
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" /> Stawka miesięczna
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {job.experienceLevel && (
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-slatedark min-w-[120px]">
                        Doświadczenie:
                      </span>
                      <span>{job.experienceLevel}</span>
                    </div>
                  )}
                  {job.employmentType && (
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-slatedark min-w-[120px]">
                        Typ umowy:
                      </span>
                      <span>{job.employmentType}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 pt-2 border-t border-kraft/20">
                    <span className="font-semibold text-slatedark min-w-[120px]">
                      Źródło:
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-bookcloth font-medium">
                      <ExternalLink className="w-4 h-4" />
                      {getPortalName(job.link)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Responsibilities Section */}
              {job.responsibilities && (
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold text-slatedark mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-bookcloth" />
                    Opis stanowiska
                  </h4>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5"
                    dangerouslySetInnerHTML={{
                      __html: truncateHtml(job.responsibilities, 60),
                    }}
                  />
                </section>
              )}

              {/* Requirements Section */}
              {job.requirements && (
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold text-slatedark mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-bookcloth" />
                    Wymagania
                  </h4>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5"
                    dangerouslySetInnerHTML={{
                      __html: truncateHtml(job.requirements, 60),
                    }}
                  />
                </section>
              )}

              {/* Nice to Have Section */}
              {job.niceToHave && (
                <section className="bg-gradient-to-br from-kraft/5 to-manilla/5 p-6 rounded-xl border border-kraft/30 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold text-slatedark mb-4">
                    💡 Mile widziane
                  </h4>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5"
                    dangerouslySetInnerHTML={{
                      __html: truncateHtml(job.niceToHave, 40),
                    }}
                  />
                </section>
              )}

              {/* Benefits Section */}
              {job.benefits && (
                <section className="bg-gradient-to-br from-bookcloth/5 to-kraft/5 p-6 rounded-xl border border-bookcloth/30 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold text-slatedark mb-4">
                    ✨ Benefity
                  </h4>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5"
                    dangerouslySetInnerHTML={{
                      __html: truncateHtml(job.benefits, 40),
                    }}
                  />
                </section>
              )}

              {/* Info Footer */}
              <div className="text-center text-sm text-gray-500 italic bg-ivorylight/50 p-4 rounded-lg border border-kraft/10">
                Wyświetlono skróconą wersję oferty. Pełne szczegóły dostępne na
                stronie portalu {getPortalName(job.link)}.
              </div>

              {/* CTA Section */}
              <aside className="bg-gradient-to-r from-bookcloth/5 to-kraft/5 p-6 rounded-xl border border-bookcloth/20">
                <p className="text-center text-gray-700 mb-4">
                  Zainteresowany? Wygeneruj dopasowane CV do tej oferty!
                </p>
                <button
                  className="w-full cursor-pointer inline-flex font-bold items-center justify-center gap-2 px-6 py-3 rounded-lg text-white bg-gradient-to-r from-bookcloth to-kraft hover:from-kraft hover:to-manilla transition-all shadow-lg hover:shadow-xl"
                  onClick={() =>
                    nav("/cv2", { state: { offerLink: job.link } })
                  }
                >
                  <ScrollText className="w-5 h-5" />
                  Wygeneruj CV w Edytorze
                </button>
              </aside>
              {showMap && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    Lokalizcja na mapie
                  </h4>
                  <JobMap
                    latitude={job.latitude}
                    longitude={job.longitude}
                    title={job.title}
                    adress={fullAddress}
                  ></JobMap>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function JobSummarySection({ dateAdded, dateEnding }) {
  const Card = ({ icon, label, value, highlight = false }) => (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-md transition-all hover:shadow-lg ${
        highlight
          ? "bg-gradient-to-br from-bookcloth/10 to-kraft/10 border-bookcloth/30"
          : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-3 rounded-full shadow-inner ${
          highlight ? "bg-bookcloth/20 text-bookcloth" : "bg-blue-50 text-black"
        }`}
      >
        {React.createElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p
          className={`text-lg font-bold ${
            highlight ? "text-bookcloth" : "text-gray-800"
          }`}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card icon={Clock} label="Data dodania" value={dateAdded} />
        <Card icon={ClockFading} label="Ważna do" value={dateEnding} />
      </div>
    </section>
  );
}

function JobSection({ title, htmlContent }) {
  if (!htmlContent || htmlContent.__html === "") return null;
  return (
    <section>
      <h4 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">
        {title}
      </h4>
      <div
        className=" text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={htmlContent}
      />
    </section>
  );
}
