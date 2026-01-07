import React from "react";
import { Search, Filter } from "lucide-react";

export default function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-bookcloth to-kraft text-basewhite shadow-lg">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slatedark">
        Brak wyników
      </h3>
      <p className="mt-1 text-cloudmedium">
        {hasFilters
          ? "Nie znaleziono ofert spełniających wybrane kryteria."
          : "Aktualnie brak aktywnych ofert pracy."}
      </p>
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-md"
        >
          <Filter className="w-4 h-4" />
          Wyczyść wszystkie filtry
        </button>
      )}
    </div>
  );
}
