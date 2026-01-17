import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function FiltersSheet({
  open,
  onClose,
  criteria,
  onUpdateCriteria,
}) {
  const [local, setLocal] = useState({
    city: "",
    experienceLevel: "",
    employmentType: "",
    company: "",
    title: "",
    dateAddedFrom: null,
    dateAddedTo: null,
  });

  useEffect(() => {
    if (open) {
      setLocal({
        city: criteria.city || "",
        experienceLevel: criteria.experienceLevel || "",
        employmentType: criteria.employmentType || "",
        company: criteria.company || "",
        title: criteria.title || "",
        dateAddedFrom: criteria.dateAddedFrom || null,
        dateAddedTo: criteria.dateAddedTo || null,
      });
    }
  }, [open, criteria]);

  const handleApply = () => {
    onUpdateCriteria(local);
    onClose();
  };

  const handleClear = () => {
    const cleared = {
      city: "",
      experienceLevel: "",
      employmentType: "",
      company: "",
      title: "",
      dateAddedFrom: null,
      dateAddedTo: null,
    };
    setLocal(cleared);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pt-10 px-4">
      <div
        className="absolute inset-0 bg-slatedark/60 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl animate-slideDown">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-lg text-slatedark hover:bg-ivorymedium transition-colors"
            aria-label="Zamknij filtry"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-slatedark mb-6">
              Zaawansowane filtry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slatedark mb-2">
                  Miasto
                </label>
                <Input
                  value={local.city}
                  onChange={(e) => setLocal({ ...local, city: e.target.value })}
                  placeholder="np. Warszawa, Kraków"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatedark mb-2">
                  Firma
                </label>
                <Input
                  value={local.company}
                  onChange={(e) =>
                    setLocal({ ...local, company: e.target.value })
                  }
                  placeholder="np. Google, Microsoft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatedark mb-2">
                  Stanowisko
                </label>
                <Input
                  value={local.title}
                  onChange={(e) =>
                    setLocal({ ...local, title: e.target.value })
                  }
                  placeholder="np. Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatedark mb-2">
                  Poziom doświadczenia
                </label>
                <Select
                  value={local.experienceLevel}
                  onChange={(e) =>
                    setLocal({ ...local, experienceLevel: e.target.value })
                  }
                >
                  <option value="">Wszystkie</option>
                  <option value="Staż">Staż</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Expert">Expert</option>
                  <option value="C-Level">C-Level</option>
                  <option value="Director">Dyrektor</option>
                  <option value="Kierownik">Kierownik</option>
                  <option value="Manger">Manager</option>
                  <option value="pracownik fizyczny">Pracownik fizyczny</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slatedark mb-2">
                  Forma zatrudnienia
                </label>
                <Select
                  value={local.employmentType}
                  onChange={(e) =>
                    setLocal({ ...local, employmentType: e.target.value })
                  }
                >
                  <option value="">Wszystkie</option>
                  <option value="B2B">B2B</option>
                  <option value="Permanent">UoP / Permanent</option>
                  <option value="UZ">Umowa zlecenie</option>
                  <option value="UoD">Umowa o dzieło</option>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slatedark mb-2">
                  Data dodania
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={local.dateAddedFrom || ""}
                    onChange={(e) =>
                      setLocal({ ...local, dateAddedFrom: e.target.value })
                    }
                    placeholder="Od"
                  />
                  <Input
                    type="date"
                    value={local.dateAddedTo || ""}
                    onChange={(e) =>
                      setLocal({ ...local, dateAddedTo: e.target.value })
                    }
                    placeholder="Do"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={handleClear}>
                Wyczyść filtry
              </Button>
              <Button onClick={handleApply}>Zastosuj filtry</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
