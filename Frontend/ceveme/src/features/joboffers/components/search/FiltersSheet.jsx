import React, { useState, useEffect, useMemo } from "react";
import { X, Banknote, Clock, Calendar as CalendarIcon } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";

const SALARY_MIN = 0;
const SALARY_MAX_MONTHLY = 50000;
const SALARY_MAX_HOURLY = 500;
const SALARY_STEP_MONTHLY = 500;
const SALARY_STEP_HOURLY = 10;

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
    locationCity: "",
    radiusKm: "",
    salaryMin: null,
    salaryMax: null,
    salaryType: "",
  });

  const salaryConfig = useMemo(() => {
    const isHourly = local.salaryType === "HOURLY";
    return {
      max: isHourly ? SALARY_MAX_HOURLY : SALARY_MAX_MONTHLY,
      step: isHourly ? SALARY_STEP_HOURLY : SALARY_STEP_MONTHLY,
      unit: isHourly ? "/godz." : "/mies.",
      label: isHourly ? "Stawka godzinowa" : "Wynagrodzenie miesięczne",
    };
  }, [local.salaryType]);

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
        locationCity: criteria.locationCity || "",
        radiusKm: criteria.radiusKm || "",
        salaryMin: criteria.salaryMin || null,
        salaryMax: criteria.salaryMax || null,
        salaryType: criteria.salaryType || "",
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
      locationCity: "",
      radiusKm: "",
      salaryMin: null,
      salaryMax: null,
      salaryType: "",
    };
    setLocal(cleared);
  };

  const handleSalaryTypeChange = (e) => {
    const newType = e.target.value;
    setLocal((prev) => ({
      ...prev,
      salaryType: newType,
      salaryMin: null,
      salaryMax: null,
    }));
  };

  const formatSalary = (value) => {
    if (value === null || value === undefined) return "—";
    return new Intl.NumberFormat("pl-PL").format(value);
  };

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-slatedark/60 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl animate-slideDown my-auto">
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
                  <option value="INTER">Staż</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid</option>
                  <option value="SENIOR">Senior</option>
                  <option value="EXPERT">Expert</option>
                  <option value="C_LEVEL">C-Level</option>
                  <option value="DYREKTOR">Dyrektor</option>
                  <option value="KIEROWNIK">Kierownik</option>
                  <option value="MANAGER">Manager</option>
                  <option value="LEAD">Lead</option>
                  <option value="PRACOWNIK_FIZYCZNY">Pracownik fizyczny</option>
                  <option value="UNKNOWN">Nieokreślone</option>
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
                  <option value="UOP">Umowa o pracę</option>
                  <option value="B2B">B2B</option>
                  <option value="UOD">Umowa o dzieło</option>
                  <option value="STAZ">Staż</option>
                  <option value="OTHER">Inne</option>

                </Select>
              </div>

              {/* Sekcja wynagrodzenia */}
              <div className="sm:col-span-2">
                <div className="bg-gradient-to-br from-bookcloth/5 to-kraft/5 p-4 rounded-xl border border-bookcloth/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Banknote className="w-5 h-5 text-bookcloth" />
                    <label className="text-sm font-semibold text-slatedark">
                      Wynagrodzenie
                    </label>
                  </div>

                  {/* Typ wynagrodzenia */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-clouddark mb-2">
                      Typ stawki
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleSalaryTypeChange({ target: { value: "" } })
                        }
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          local.salaryType === ""
                            ? "bg-bookcloth text-white shadow-md"
                            : "bg-white border border-cloudlight text-slatedark hover:border-bookcloth/50"
                        }`}
                      >
                        Wszystkie
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSalaryTypeChange({
                            target: { value: "MONTHLY" },
                          })
                        }
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                          local.salaryType === "MONTHLY"
                            ? "bg-bookcloth text-white shadow-md"
                            : "bg-white border border-cloudlight text-slatedark hover:border-bookcloth/50"
                        }`}
                      >
                        <CalendarIcon className="w-4 h-4" />
                        Miesięczne
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSalaryTypeChange({
                            target: { value: "HOURLY" },
                          })
                        }
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                          local.salaryType === "HOURLY"
                            ? "bg-bookcloth text-white shadow-md"
                            : "bg-white border border-cloudlight text-slatedark hover:border-bookcloth/50"
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Godzinowe
                      </button>
                    </div>
                  </div>

                  {/* Suwaki zakresu wynagrodzenia */}
                  {local.salaryType && (
                    <div className="space-y-4">
                      {/* Wyświetlanie aktualnego zakresu */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-clouddark">Zakres:</span>
                        <span className="font-semibold text-bookcloth">
                          {formatSalary(local.salaryMin || SALARY_MIN)} PLN —{" "}
                          {formatSalary(local.salaryMax || salaryConfig.max)}{" "}
                          PLN
                          <span className="text-clouddark font-normal ml-1">
                            {salaryConfig.unit}
                          </span>
                        </span>
                      </div>

                      {/* Suwak minimalny */}
                      <div>
                        <label className="block text-xs font-medium text-clouddark mb-2">
                          Minimalne wynagrodzenie
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min={SALARY_MIN}
                            max={salaryConfig.max}
                            step={salaryConfig.step}
                            value={local.salaryMin || SALARY_MIN}
                            onChange={(e) =>
                              setLocal({
                                ...local,
                                salaryMin: parseFloat(e.target.value),
                              })
                            }
                            className="w-full h-2 bg-cloudlight rounded-lg appearance-none cursor-pointer accent-bookcloth"
                          />
                          <div className="flex justify-between text-xs text-clouddark mt-1">
                            <span>{formatSalary(SALARY_MIN)} PLN</span>
                            <span className="font-medium text-bookcloth">
                              {formatSalary(local.salaryMin || SALARY_MIN)} PLN
                            </span>
                            <span>{formatSalary(salaryConfig.max)} PLN</span>
                          </div>
                        </div>
                      </div>

                      {/* Suwak maksymalny */}
                      <div>
                        <label className="block text-xs font-medium text-clouddark mb-2">
                          Maksymalne wynagrodzenie
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min={SALARY_MIN}
                            max={salaryConfig.max}
                            step={salaryConfig.step}
                            value={local.salaryMax || salaryConfig.max}
                            onChange={(e) =>
                              setLocal({
                                ...local,
                                salaryMax: parseFloat(e.target.value),
                              })
                            }
                            className="w-full h-2 bg-cloudlight rounded-lg appearance-none cursor-pointer accent-kraft"
                          />
                          <div className="flex justify-between text-xs text-clouddark mt-1">
                            <span>{formatSalary(SALARY_MIN)} PLN</span>
                            <span className="font-medium text-kraft">
                              {formatSalary(
                                local.salaryMax || salaryConfig.max,
                              )}{" "}
                              PLN
                            </span>
                            <span>{formatSalary(salaryConfig.max)} PLN</span>
                          </div>
                        </div>
                      </div>

                      {/* Szybkie opcje */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-cloudlight">
                        <span className="text-xs text-clouddark">
                          Szybki wybór:
                        </span>
                        {local.salaryType === "MONTHLY"
                          ? [5000, 10000, 15000, 20000, 30000].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() =>
                                  setLocal({ ...local, salaryMin: val })
                                }
                                className="px-2 py-1 text-xs rounded-md bg-white border border-cloudlight text-slatedark hover:border-bookcloth hover:bg-bookcloth/5 transition-colors"
                              >
                                od {formatSalary(val)}
                              </button>
                            ))
                          : [50, 100, 150, 200, 300].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() =>
                                  setLocal({ ...local, salaryMin: val })
                                }
                                className="px-2 py-1 text-xs rounded-md bg-white border border-cloudlight text-slatedark hover:border-bookcloth hover:bg-bookcloth/5 transition-colors"
                              >
                                od {formatSalary(val)}
                              </button>
                            ))}
                      </div>
                    </div>
                  )}

                  {!local.salaryType && (
                    <p className="text-xs text-clouddark text-center py-2">
                      Wybierz typ stawki, aby ustawić zakres wynagrodzenia
                    </p>
                  )}
                </div>
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
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slatedark mb-2">
                  Dystans
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={local.locationCity}
                    onChange={(e) =>
                      setLocal({ ...local, locationCity: e.target.value })
                    }
                    placeholder="Miasto"
                  />

                  <Select
                    value={local.radiusKm}
                    onChange={(e) =>
                      setLocal({ ...local, radiusKm: e.target.value })
                    }
                    placeholder="Promień w km"
                  >
                    <option value="">Wszystkie</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                    <option value="30">30 km</option>
                  </Select>
                </div>

                <p className="text-xs text-cloudmedium mt-2">
                  Znajdź oferty w podanym promieniu od wybranego miasta
                </p>
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
