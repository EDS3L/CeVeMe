import React from 'react';
import { STATUS_MAP, STATUS_OPTIONS } from '../constants/statusConfig';

export default function StatusSelect({ value, onChange }) {
  const statusInfo = STATUS_MAP[value] || STATUS_MAP.PENDING;
  const IconComponent = statusInfo.icon;

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 p-2 rounded-full bg-slate-100`}>
        <IconComponent
          className={`${statusInfo.color} flex-shrink-0`}
          size={18}
        />
      </div>
      <select
        className="flex-1 w-full rounded-xl border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
