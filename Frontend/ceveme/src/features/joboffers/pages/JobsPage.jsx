import React, { useState } from 'react';
import useJobs from '../hooks/useJobs';
import SearchHero from '../components/search/SearchHero';
import FiltersSheet from '../components/search/FiltersSheet';
import Chip from '../components/ui/Chip';
import Select from '../components/ui/Select';
import JobCard from '../components/jobs/JobCard';
import JobModal from '../components/jobs/JobModal';
import SkeletonCard from '../components/jobs/SkeletonCard';
import EmptyState from '../components/jobs/EmptyState';
import Pagination from '../components/ui/Pagination';
import { X, MapPin } from 'lucide-react';
import Navbar from '../../../components/Navbar';

export default function JobsPage() {
  const {
    jobs,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    goToPage,
    query,
    setQuery,
    filters,
    setFilters,
    sort,
    setSort,
    suggestions,
  } = useJobs();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  const handleSortChange = (valOrEvent) => {
    const value =
      valOrEvent && valOrEvent.target ? valOrEvent.target.value : valOrEvent;
    setSort(value);
  };

  return (
    <div className="min-h-screen bg-ivorylight">
      <Navbar />
      {/* HERO */}
      <SearchHero
        query={query}
        onQuery={setQuery}
        onOpenFilters={() => setFiltersOpen(true)}
        suggestions={suggestions}
        className="fixed z-20"
      />

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Aktywne filtry + sort */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.city && (
            <Chip onRemove={() => setFilters({ ...filters, city: '' })}>
              <MapPin className="w-4 h-4" /> {filters.city}
            </Chip>
          )}
          {filters.experience && (
            <Chip onRemove={() => setFilters({ ...filters, experience: '' })}>
              {filters.experience}
            </Chip>
          )}
          {filters.employmentType && (
            <Chip
              onRemove={() => setFilters({ ...filters, employmentType: '' })}
            >
              {filters.employmentType}
            </Chip>
          )}

          <div className="ml-auto">
            <label className="sr-only" htmlFor="sort">
              Sortowanie
            </label>
            <Select id="sort" value={sort} onChange={handleSortChange}>
              <option value="newest">Najnowsze</option>
              <option value="endingSoon">Kończące się</option>
              <option value="salaryDesc">Najwyższe wynagrodzenie</option>
              <option value="salaryAsc">Najniższe wynagrodzenie</option>
            </Select>
          </div>
        </div>

        {/* Statystyka */}
        <div className="mt-3 text-sm text-clouddark">
          {totalElements ? (
            <>
              Łącznie ofert:{' '}
              <strong className="text-slatedark">{totalElements}</strong>.
              Strona <strong className="text-slatedark">{currentPage}</strong> z{' '}
              <strong className="text-slatedark">{totalPages}</strong>.
            </>
          ) : null}
        </div>

        {/* Anchor do przewijania przy zmianie strony */}
        <div id="jobs-grid-top" />

        {/* GRID */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading &&
            Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          {!loading && jobs.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState />
            </div>
          )}
          {!loading &&
            jobs.map((job) => (
              <JobCard key={job.id} job={job} onOpen={setActiveJob} />
            ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl border border-feedbackerror/40 bg-feedbackerror/10 text-feedbackerror flex items-center justify-between">
            <span>{error}</span>
            <button
              className="rounded p-1 hover:bg-feedbackerror/10"
              onClick={() => window.location.reload()}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={goToPage}
          />
        )}
      </main>

      {/* Filtry */}
      {filtersOpen && (
        <FiltersSheet
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
        />
      )}

      {/* Modal szczegółów */}

      <JobModal
        open={!!activeJob}
        onClose={() => setActiveJob(null)}
        job={activeJob}
      />
    </div>
  );
}
