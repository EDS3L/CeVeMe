/* eslint-disable react-hooks/exhaustive-deps */
// src/components/search/FiltersSheet.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function FiltersSheet({
  open,
  onClose,
  filters,
  setFilters,
  sort,
  setSort,
}) {
  const [local, setLocal] = useState({
    city: "",
    experience: "",
    employmentType: "",
    company: "",
    title: "",
    dateAddedFrom: undefined,
    dateAddedTo: undefined,
    ...filters,
  });
  const [localSort, setLocalSort] = useState(sort);

  useEffect(() => setLocal({ ...local, ...filters }), [filters]);
  useEffect(() => setLocalSort(sort), [sort]);

  const apply = () => {
    setFilters(local);
    setSort(localSort);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-40 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-slatedark/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-10 w-[min(92vw,900px)] transition-transform ${
          open ? "translate-y-0" : "-translate-y-8"
        }`}
      >
        <Card className="relative top-20">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-2 rounded-lg text-slatedark hover:bg-ivorymedium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feedbackfocus"
            aria-label="Zamknij filtry"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-slatedark">
              Filtry i sortowanie
            </h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-clouddark mb-1">
                  Miasto
                </label>
                <Input
                  value={local.city || ""}
                  onChange={(e) => setLocal({ ...local, city: e.target.value })}
                  placeholder="np. Warszawa"
                />
              </div>
              <div>
                <label className="block text-sm text-clouddark mb-1">
                  Poziom doświadczenia
                </label>
                <Select
                  value={local.experience || ""}
                  onChange={(e) =>
                    setLocal({ ...local, experience: e.target.value })
                  }
                >
                  <option value="">Wszystkie</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-clouddark mb-1">
                  Forma zatrudnienia
                </label>
                <Select
                  value={local.employmentType || ""}
                  onChange={(e) =>
                    setLocal({ ...local, employmentType: e.target.value })
                  }
                >
                  <option value="">Wszystkie</option>
                  <option value="B2B">B2B</option>
                  <option value="Permanent">UoP / Permanent</option>
                  <option value="UZ">Umowa zlecenie</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-clouddark mb-1">
                  Firma
                </label>
                <Input
                  value={local.company || ""}
                  onChange={(e) =>
                    setLocal({ ...local, company: e.target.value })
                  }
                  placeholder="np. Google, Microsoft"
                />
              </div>

              <div>
                <label className="block text-sm text-clouddark mb-1">
                  Tytuł
                </label>
                <Input
                  value={local.title || ""}
                  onChange={(e) =>
                    setLocal({ ...local, title: e.target.value })
                  }
                  placeholder="np. Frontend Developer"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-clouddark mb-1">
                  Sortowanie
                </label>
                <Select
                  value={localSort}
                  onChange={(e) => setLocalSort(e.target.value)}
                >
                  <option value="newest">Najnowsze</option>
                  <option value="endingSoon">Kończące się</option>
                  <option value="salaryDesc">Najwyższe wynagrodzenie</option>
                  <option value="salaryAsc">Najniższe wynagrodzenie</option>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setLocal({
                    city: "",
                    experience: "",
                    employmentType: "",
                    company: "",
                    title: "",
                    dateAddedFrom: undefined,
                    dateAddedTo: undefined,
                  });
                  setLocalSort("newest");
                }}
              >
                Wyczyść
              </Button>
              <Button onClick={apply}>Zastosuj</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
