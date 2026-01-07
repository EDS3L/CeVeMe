import React, { memo } from "react";
import { Search, Filter, X } from "lucide-react";

const ActiveFilters = memo(({ criteria, onRemove, onClear, onOpenFilters }) => {
  const filters = [];

  if (criteria.city) {
    filters.push({ key: "city", label: criteria.city, field: "city" });
  }
  if (criteria.experienceLevel) {
    filters.push({
      key: "experienceLevel",
      label: criteria.experienceLevel,
      field: "experienceLevel",
    });
  }
  if (criteria.employmentType) {
    filters.push({
      key: "employmentType",
      label: criteria.employmentType,
      field: "employmentType",
    });
  }
  if (criteria.company) {
    filters.push({ key: "company", label: criteria.company, field: "company" });
  }
  if (criteria.title) {
    filters.push({
      key: "title",
      label: `Stanowisko: ${criteria.title}`,
      field: "title",
    });
  }
  if (criteria.dateAddedFrom) {
    filters.push({
      key: "dateAddedFrom",
      label: `Od: ${criteria.dateAddedFrom}`,
      field: "dateAddedFrom",
    });
  }
  if (criteria.dateAddedTo) {
    filters.push({
      key: "dateAddedTo",
      label: `Do: ${criteria.dateAddedTo}`,
      field: "dateAddedTo",
    });
  }

  if (filters.length === 0 && !criteria.q) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate/20 bg-white hover:bg-ivory transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {criteria.q && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Search className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">{criteria.q}</span>
          <button
            onClick={() => onRemove("q", "")}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            aria-label="Usuń wyszukiwanie"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filters.map((filter) => (
        <div
          key={filter.key}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate/10 text-slatedark border border-slate/20"
        >
          <span className="text-sm font-medium">{filter.label}</span>
          <button
            onClick={() => onRemove(filter.field, "")}
            className="hover:bg-slate/20 rounded-full p-0.5 transition-colors"
            aria-label={`Usuń filtr: ${filter.label}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {filters.length > 0 && (
        <button
          onClick={onClear}
          className="text-sm text-clouddark hover:text-slatedark underline transition-colors"
        >
          Wyczyść wszystkie
        </button>
      )}

      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate/20 bg-white hover:bg-ivory transition-colors ml-auto"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Więcej filtrów</span>
      </button>
    </div>
  );
});

ActiveFilters.displayName = "ActiveFilters";

export default ActiveFilters;
