import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ApplicationHeader from "./ApplicationHeader";
import ApplicationDates from "./ApplicationDates";
import StatusSelect from "../StatusSelect";
import CVSection from "./CVSection";
import StatusBadge from "../StatusBadge";

export default function ApplicationHistoryCard({ history, onStatusChange }) {
  const navigate = useNavigate();

  const handlePrepareInterview = () => {
    navigate(`/interview/modes/${history.jobOfferId}`, {
      state: {
        jobOffer: {
          id: history.jobOfferId,
          title: history.title,
          company: history.companyName,
        },
      },
    });
  };

  return (
    <article className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/50 p-5 sm:p-6 transition-all duration-300 transform">
      <div className="space-y-5">
        <ApplicationHeader
          companyName={history.companyName}
          offerUrl={history.offerUrl}
          title={history.title}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <div className="flex flex-col gap-2">
              <StatusBadge value={history.status} />
              <StatusSelect value={history.status} onChange={onStatusChange} />
            </div>
          </div>
          <div className="md:col-span-1 flex justify-start md:justify-end">
            <CVSection cvFile={history.cvFile} />
          </div>
        </div>
        <ApplicationDates
          dateOfApplication={history.dateOfApplication}
          dateOfLastModified={history.dateOfLastModified}
        />

        {history.jobOfferId && (
          <div className="pt-2 border-t border-slate-200/50">
            <button
              onClick={handlePrepareInterview}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Przygotuj się do rozmowy z AI
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
