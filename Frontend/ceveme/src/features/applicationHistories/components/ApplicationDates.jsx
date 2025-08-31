import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function ApplicationDates({
  dateOfApplication,
  dateOfLastModified,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-slate-600 border-t border-slate-200 pt-4 mt-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="text-slate-400 flex-shrink-0" size={16} />
        <span>
          <span className="font-medium text-slate-700">Aplikacja:</span>{' '}
          {dateOfApplication}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CalendarDays className="text-slate-400 flex-shrink-0" size={16} />
        <span>
          <span className="font-medium text-slate-700">Modyfikacja:</span>{' '}
          {dateOfLastModified}
        </span>
      </div>
    </div>
  );
}
