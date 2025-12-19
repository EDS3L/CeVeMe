// src/pages/applicationHistory/components/tableView/ApplicationHistoryTable.jsx
import React from 'react';
import { Building2, ExternalLink, Download } from 'lucide-react';
import StatusSelect from '../../components/StatusSelect';
import StatusBadge from '../../components/StatusBadge';

export default function ApplicationHistoryTable({ histories, onStatusChange }) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 sm:px-6 py-3 font-semibold">Firma</th>
              <th className="px-4 sm:px-6 py-3 font-semibold">Stanowisko</th>
              <th className="px-4 sm:px-6 py-3 font-semibold">Status</th>
              <th className="px-4 sm:px-6 py-3 font-semibold">Aplikacja</th>
              <th className="px-4 sm:px-6 py-3 font-semibold">Modyfikacja</th>
              <th className="px-4 sm:px-6 py-3 font-semibold">Oferta</th>
              <th className="px-4 sm:px-6 py-3 font-semibold">CV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {histories.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-full">
                      <Building2 className="text-indigo-700" size={18} />
                    </div>
                    <span className="font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-[280px]">{row.companyName}</span>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <span className="text-slate-700 truncate block max-w-[220px] sm:max-w-[280px]">{row.title}</span>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col gap-2 max-w-[280px]">
                    <StatusBadge value={row.status} />
                    <StatusSelect value={row.status} onChange={(v) => onStatusChange(row.id, v)} />
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <span className="text-slate-700">{row.dateOfApplication}</span>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <span className="text-slate-700">{row.dateOfLastModified}</span>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <a
                    href={row.offerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                    aria-label="Otwórz ofertę"
                  >
                    <ExternalLink size={16} />
                    <span>Oferta</span>
                  </a>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <a
                    href={row.cvFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-semibold py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
                    aria-label="Pobierz CV"
                  >
                    <Download size={16} />
                    <span>Pobierz</span>
                  </a>
                </td>
              </tr>
            ))}
            {!histories.length && (
              <tr>
                <td className="px-4 sm:px-6 py-8 text-center text-slate-500" colSpan={7}>Brak wyników dla wybranych filtrów</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
