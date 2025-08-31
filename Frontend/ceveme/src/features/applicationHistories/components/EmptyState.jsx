import React from 'react';
import { ClipboardList } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 rounded-2xl border-2 border-dashed border-slate-300">
      <ClipboardList className="text-slate-400 mb-4" size={48} />
      <p className="text-xl font-bold text-slate-700">
        Brak historii aplikacji
      </p>
      <p className="text-sm text-slate-500 mt-2">
        Twoje aplikacje pojawią się tutaj, gdy tylko je dodasz.
      </p>
    </div>
  );
}
