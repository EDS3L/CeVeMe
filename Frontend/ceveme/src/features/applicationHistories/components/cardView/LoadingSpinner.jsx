import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-lg font-semibold text-slate-700">
        Wczytuję historię...
      </p>
      <p className="text-sm text-slate-500">Proszę czekać.</p>
    </div>
  );
}
