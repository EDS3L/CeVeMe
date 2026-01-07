import React, { useState, useCallback, useMemo } from "react";
import { Briefcase } from "lucide-react";
import { useSearchState } from "../hooks/useSearchState";
import { useJobSearch } from "../hooks/useJobSearch";
import SearchInput from "../components/search/SearchInput";
import ActiveFilters from "../components/search/ActiveFilters";
import FiltersSheet from "../components/search/FiltersSheet";
import Select from "../components/ui/Select";
import JobCard from "../components/jobs/JobCard";
import JobModal from "../components/jobs/JobModal";
import SkeletonCard from "../components/jobs/SkeletonCard";
import EmptyState from "../components/jobs/EmptyState";
import ErrorAlert from "../components/ui/ErrorAlert";
import Pagination from "../components/ui/Pagination";

export default function JobsPage() {
  const { criteria, updateCriteria, resetCriteria, hasActiveFilters } =
    useSearchState();
  const { data, loading, error, retry } = useJobSearch(criteria);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  const handleSortChange = useCallback(
    (e) => {
      updateCriteria({ sort: e.target.value });
    },
    [updateCriteria]
  );

  const handleSearchChange = useCallback(
    (value) => {
      updateCriteria({ q: value });
    },
    [updateCriteria]
  );

  const handlePageChange = useCallback(
    (page) => {
      updateCriteria({ pageNumber: page - 1 });

      setTimeout(() => {
        const element = document.getElementById("jobs-grid-top");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    [updateCriteria]
  );

  const handleFilterRemove = useCallback(
    (field) => {
      updateCriteria({ [field]: "" });
    },
    [updateCriteria]
  );

  const handleClearAll = useCallback(() => {
    resetCriteria();
  }, [resetCriteria]);

  const jobs = useMemo(() => data?.content || [], [data]);
  const totalPages = useMemo(() => data?.totalPages || 0, [data]);
  const totalElements = useMemo(() => data?.totalElements || 0, [data]);
  const currentDisplayPage = useMemo(
    () => (criteria.pageNumber || 0) + 1,
    [criteria.pageNumber]
  );

  return (
    <div className="min-h-screen bg-ivorylight">
      <header className="bg-gradient-to-br from-white via-ivorylight to-white border-b border-kraft/20 sticky top-0 z-20 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bookcloth to-kraft flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-bookcloth via-kraft to-manilla bg-clip-text text-transparent mb-2">
              CeVeMe
            </h1>
            <p className="text-lg text-clouddark font-medium">
              ✨ Znajdź swoją wymarzoną ofertę pracy ✨
            </p>
          </div>

          {/* Search Input */}
          <SearchInput
            value={criteria.q}
            onChange={handleSearchChange}
            loading={loading}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="mb-6">
          <ActiveFilters
            criteria={criteria}
            onRemove={handleFilterRemove}
            onClear={handleClearAll}
            onOpenFilters={() => setFiltersOpen(true)}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-clouddark">
            {totalElements > 0 && (
              <>
                Znaleziono{" "}
                <strong className="text-slatedark">{totalElements}</strong>{" "}
                {totalElements === 1
                  ? "ofertę"
                  : totalElements < 5
                  ? "oferty"
                  : "ofert"}
                .
                {totalPages > 1 && (
                  <>
                    {" "}
                    Strona{" "}
                    <strong className="text-slatedark">
                      {currentDisplayPage}
                    </strong>{" "}
                    z <strong className="text-slatedark">{totalPages}</strong>.
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-clouddark">
              Sortuj:
            </label>
            <Select id="sort" value={criteria.sort} onChange={handleSortChange}>
              <option value="newest">Najnowsze</option>
              <option value="oldest">Najstarsze</option>
              <option value="endingSoon">Kończące się</option>
              <option value="companyAsc">Firma A-Z</option>
              <option value="companyDesc">Firma Z-A</option>
              <option value="titleAsc">Stanowisko A-Z</option>
              <option value="titleDesc">Stanowisko Z-A</option>
              <option value="cityAsc">Miasto A-Z</option>
              <option value="cityDesc">Miasto Z-A</option>
            </Select>
          </div>
        </div>

        <div id="jobs-grid-top" />

        {error && <ErrorAlert error={error} onRetry={retry} />}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[600px]">
          {loading && (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          )}

          {!loading && jobs.length === 0 && !error && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={handleClearAll}
              />
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onOpen={setActiveJob} />
              ))}
            </>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              current={currentDisplayPage}
              total={totalPages}
              onChange={handlePageChange}
            />
          </div>
        )}
      </main>

      {filtersOpen && (
        <FiltersSheet
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          criteria={criteria}
          onUpdateCriteria={updateCriteria}
        />
      )}

      {activeJob && (
        <JobModal
          open={!!activeJob}
          onClose={() => setActiveJob(null)}
          job={activeJob}
        />
      )}
    </div>
  );
}
