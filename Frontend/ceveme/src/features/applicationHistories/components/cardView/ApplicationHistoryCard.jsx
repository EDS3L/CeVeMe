// src/pages/applicationHistory/components/cardView/ApplicationHistoryCard.jsx
import React from 'react';
import ApplicationHeader from './ApplicationHeader';
import ApplicationDates from './ApplicationDates';
import StatusSelect from '../StatusSelect';
import CVSection from './CVSection';
import StatusBadge from '../StatusBadge';

export default function ApplicationHistoryCard({ history, onStatusChange }) {
  return (
    <article className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/50 p-5 sm:p-6 transition-all duration-300 transform">
      <div className="space-y-5">
        <ApplicationHeader companyName={history.companyName} offerUrl={history.offerUrl} title={history.title} />
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
        <ApplicationDates dateOfApplication={history.dateOfApplication} dateOfLastModified={history.dateOfLastModified} />
      </div>
    </article>
  );
}
