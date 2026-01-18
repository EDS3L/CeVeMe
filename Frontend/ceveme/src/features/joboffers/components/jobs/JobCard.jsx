import React from "react";
import Card from "../ui/Card";
import {
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  ArrowUpRight,
  Banknote,
  Clock,
} from "lucide-react";

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

export default function JobCard({ job, onOpen }) {
  const salaryDisplay = formatSalary(
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency,
    job.salaryType,
  );

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onOpen(job)}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(job) : null)}
      className="group relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-feedbackfocus hover:shadow-xl transition"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-bookcloth to-kraft opacity-0 group-hover:opacity-[0.06] transition" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slatedark group-hover:underline underline-offset-4 decoration-bookcloth/50">
              {job.title || "Bez tytułu"}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-clouddark">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-4 h-4" /> {job.company || "—"}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {job.city || "—"}
              </span>
              {job.employmentType && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> {job.employmentType}
                </span>
              )}
            </div>
          </div>
          {job.link && (
            <a
              href={job.link}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-basewhite bg-gradient-to-r from-bookcloth to-kraft hover:to-manilla transition-colors"
            >
              Zobacz <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {salaryDisplay && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-gradient-to-r from-bookcloth/10 to-kraft/10 text-slatedark border border-bookcloth/30 font-medium">
              <Banknote className="w-4 h-4 text-bookcloth" />
              {salaryDisplay}
              {job.salaryType === "HOURLY" && (
                <Clock className="w-3 h-3 text-kraft ml-0.5" />
              )}
            </span>
          )}
          {job.experienceLevel && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-kraft/10 text-slatedark border border-kraft/30">
              {job.experienceLevel}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-clouddark">
          {job.dateAdded && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Dodano:{" "}
              {new Date(job.dateAdded).toLocaleDateString("pl-PL")}
            </span>
          )}
          {job.dateEnding && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Do:{" "}
              {new Date(job.dateEnding).toLocaleDateString("pl-PL")}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
