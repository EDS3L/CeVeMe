import Modal from '../ui/Modal';
import { X, Building2, MapPin, ArrowUpRight, ScrollText } from 'lucide-react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { useNavigate } from 'react-router-dom';

export default function JobModal({ open, onClose, job }) {
  const nav = useNavigate();
  if (!open || !job) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute cursor-pointer right-3 top-3 p-2 rounded-lg text-slatedark hover:bg-ivorymedium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feedbackfocus"
        aria-label="Zamknij szczegóły"
      >
        <X className="w-5 h-5 " />
      </button>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-bookcloth to-kraft text-basewhite px-6 py-6">
        <h3 className="text-2xl font-bold">{job.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-basewhite/90">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-4 h-4" /> {job.company || '—'}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {job.location?.city || '—'}
          </span>
          {job.salary && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-basewhite/15">
              {job.salary}
            </span>
          )}
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="px-6 py-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h4 className="text-slatedark font-semibold">Opis / Obowiązki</h4>
            <div
              className="mt-2 prose prose-sm max-w-none text-slatedark prose-a:text-bookcloth"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(job.responsibilities || ''),
              }}
            />
            {job.requirements && (
              <>
                <h4 className="mt-6 text-slatedark font-semibold">Wymagania</h4>
                <p className="mt-2 text-slatedark">{job.requirements}</p>
              </>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-basewhite/50 bg-ivorymedium p-4">
              <div className="space-y-2 text-sm text-slatedark">
                <Row label="Poziom" value={job.experienceLevel || '—'} />
                <Row label="Forma" value={job.employmentType || '—'} />
                <Row
                  label="Dodano"
                  value={
                    job.dateAdded
                      ? new Date(job.dateAdded).toLocaleDateString()
                      : '—'
                  }
                />
                <Row
                  label="Ważne do"
                  value={
                    job.dateEnding
                      ? new Date(job.dateEnding).toLocaleDateString()
                      : '—'
                  }
                />
              </div>
              <a
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-basewhite bg-gradient-to-r from-bookcloth to-kraft hover:to-manilla"
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Przejdź do oferty <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                className="mt-4 w-full cursor-pointer inline-flex font-bold items-center justify-center gap-2 px-4 py-2 rounded-lg text-basewhite bg-gradient-to-r from-blue-300 to-blue-700 hover:to-blue-500"
                onClick={() => nav('/cv', { state: { offerLink: job.link } })}
                rel="noopener noreferrer"
              >
                Wygneruj cv <ScrollText className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-clouddark">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
