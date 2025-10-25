import React from 'react';
import { STATUS_MAP, STATUS_OPTIONS } from '../constants/statusConfig';

export default function StatusSelect({ value, onChange }) {
  const statusInfo = STATUS_MAP[value] || STATUS_MAP.PENDING;
  const IconComponent = statusInfo.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100"
        aria-hidden
      >
        <IconComponent
          className={`${statusInfo.color} flex-shrink-0`}
          size={16}
        />
      </div>

      <div className="relative inline-block">
        <select
          className="appearance-none pr-8 pl-3 py-1.5 bg-white border border-slate-200 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-150"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
