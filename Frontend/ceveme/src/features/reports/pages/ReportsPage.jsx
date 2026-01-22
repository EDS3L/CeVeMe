import { useEffect, useCallback } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import useReports from "../hooks/useReports";
import DateAddedChart from "../components/DateAddedChart";
import ExperiencePerCityChart from "../components/ExperiencePerCityChart";
import ExperiencePerVoivodeshipChart from "../components/ExperiencePerVoivodeshipChart";
import SalaryPerCityChart from "../components/SalaryPerCityChart";
import SalaryPerExperienceChart from "../components/SalaryPerExperienceChart";
import SalaryPerVoivodeshipChart from "../components/SalaryPerVoivodeshipChart";

const ReportsPage = () => {
  const {
    dateAddedData,
    experiencePerCityData,
    experiencePerVoivodeshipData,
    salaryPerCityData,
    salaryPerExperienceData,
    salaryPerVoivodeshipData,
    loading,
    fetchDateAddedReport,
    fetchExperiencePerCityReport,
    fetchExperiencePerVoivodeshipReport,
    fetchSalaryPerCityReport,
    fetchSalaryPerExperienceReport,
    fetchSalaryPerVoivodeshipReport,
    fetchAllReports,
  } = useReports();

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const handleDateAddedFilter = useCallback(
    (experience, fromDate, toDate) => {
      fetchDateAddedReport(experience, fromDate, toDate);
    },
    [fetchDateAddedReport],
  );

  const handleExperiencePerCityFilter = useCallback(
    (city, experience) => {
      fetchExperiencePerCityReport(city, experience);
    },
    [fetchExperiencePerCityReport],
  );

  const handleExperiencePerVoivodeshipFilter = useCallback(
    (experience, voivodeship) => {
      fetchExperiencePerVoivodeshipReport(experience, voivodeship);
    },
    [fetchExperiencePerVoivodeshipReport],
  );

  const handleSalaryPerCityFilter = useCallback(
    (city) => {
      fetchSalaryPerCityReport(city);
    },
    [fetchSalaryPerCityReport],
  );

  const handleSalaryPerExperienceFilter = useCallback(
    (experience) => {
      fetchSalaryPerExperienceReport(experience);
    },
    [fetchSalaryPerExperienceReport],
  );

  const handleSalaryPerVoivodeshipFilter = useCallback(
    (voivodeship) => {
      fetchSalaryPerVoivodeshipReport(voivodeship);
    },
    [fetchSalaryPerVoivodeshipReport],
  );

  const isAnyLoading = Object.values(loading).some(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] via-[var(--color-basewhite)] to-[var(--color-ivorymedium)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-kraft)] to-[var(--color-bookcloth)] flex items-center justify-center shadow-lg">
                <BarChart3
                  size={28}
                  className="text-[var(--color-basewhite)]"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-slatedark)]">
                  Dashboard Raportów
                </h1>
                <p className="text-[var(--color-clouddark)] mt-1">
                  Analiza rynku pracy i wynagrodzeń w Polsce
                </p>
              </div>
            </div>
            <button
              onClick={fetchAllReports}
              disabled={isAnyLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-bookcloth)] text-[var(--color-basewhite)] rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw
                size={18}
                className={isAnyLoading ? "animate-spin" : ""}
              />
              Odśwież wszystko
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="lg:col-span-2">
            <DateAddedChart
              data={dateAddedData}
              loading={loading.dateAdded}
              onFilterChange={handleDateAddedFilter}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalaryPerExperienceChart
            data={salaryPerExperienceData}
            loading={loading.salaryPerExperience}
            onFilterChange={handleSalaryPerExperienceFilter}
          />
          <SalaryPerCityChart
            data={salaryPerCityData}
            loading={loading.salaryPerCity}
            onFilterChange={handleSalaryPerCityFilter}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ExperiencePerCityChart
            data={experiencePerCityData}
            loading={loading.experiencePerCity}
            onFilterChange={handleExperiencePerCityFilter}
          />
          <ExperiencePerVoivodeshipChart
            data={experiencePerVoivodeshipData}
            loading={loading.experiencePerVoivodeship}
            onFilterChange={handleExperiencePerVoivodeshipFilter}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SalaryPerVoivodeshipChart
            data={salaryPerVoivodeshipData}
            loading={loading.salaryPerVoivodeship}
            onFilterChange={handleSalaryPerVoivodeshipFilter}
          />
        </div>

        <div className="mt-8 p-4 bg-[var(--color-basewhite)] rounded-xl border border-[var(--color-ivorydark)] shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-clouddark)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
              <span>Junior</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#60a5fa]" />
              <span>Mid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span>Senior</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span>Lead</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span>Expert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
