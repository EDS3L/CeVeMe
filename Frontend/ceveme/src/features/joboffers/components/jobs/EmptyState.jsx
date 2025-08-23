import React from 'react';
import { Search } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-bookcloth to-kraft text-basewhite shadow-lg">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slatedark">
        Brak wyników
      </h3>
      <p className="mt-1 text-cloudmedium">
        Spróbuj zmienić zapytanie lub odznaczyć część filtrów.
      </p>
    </div>
  );
}
