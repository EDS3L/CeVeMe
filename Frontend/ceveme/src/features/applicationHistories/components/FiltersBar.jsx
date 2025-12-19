// src/pages/applicationHistory/components/FiltersBar.jsx
import React from 'react';
import { STATUS_OPTIONS } from '../constants/statusConfig';
import { Filter, X } from 'lucide-react';

export default function FiltersBar({ filters, onChange, onClear, resultsCount }) {
  return (
    <div className="w-full bg-white/70 backdrop-blur-lg border border-slate-200/60 rounded-2xl shadow-sm p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-indigo-600" />
          <span className="text-sm font-semibold text-slate-700">Filtry</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onChange({ ...filters, status: e.target.value })}
              className="rounded-xl border-slate-300 px-3 py-2 bg-white text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            >
              <option value="ALL">Wszystkie statusy</option>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Data aplikacji od</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => onChange({ ...filters, from: e.target.value })}
              className="rounded-xl border-slate-300 px-3 py-2 bg-white text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Data aplikacji do</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => onChange({ ...filters, to: e.target.value })}
              className="rounded-xl border-slate-300 px-3 py-2 bg-white text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Wyniki: <span className="font-semibold text-slate-800">{resultsCount}</span></span>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <X size={14} />
            Wyczyść
          </button>
        </div>
      </div>
    </div>
  );
}
