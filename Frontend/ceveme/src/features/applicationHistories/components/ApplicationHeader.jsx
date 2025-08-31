import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';

export default function ApplicationHeader({ companyName, offerUrl, title }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-full">
            <Building2 className="text-indigo-700" size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 truncate">
            {companyName}
          </h3>
        </div>
        <a
          href={offerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5 transition-colors duration-200 text-sm font-medium"
        >
          <ExternalLink size={16} />
          <span>Oferta</span>
        </a>
      </div>
      <div className="pl-12">
        <h4 className="font-semibold text-slate-700 text-base leading-tight">
          {title}
        </h4>
      </div>
    </div>
  );
}
