import React, { useState, useEffect, useMemo } from 'react';
import ApplicationHistoryCard from '../components/cardView/ApplicationHistoryCard';
import LoadingSpinner from '../components/cardView/LoadingSpinner';
import EmptyState from '../components/cardView/EmptyState';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplicationHistories from '../hooks/useApplicationHistories';
import Navbar from '../../../components/Navbar';
import ViewToggle from '../components/ViewToggle';
import ApplicationHistoryTable from '../components/tableView/ApplicationHistoryTable';
import FiltersBar from '../components/FiltersBar';
import { STATUS_MAP } from '../constants/statusConfig';
import StatusBadge from '../components/StatusBadge';

// ⬇️ NOWE
import ApplicationHistoryAnalytics from '../components/Analytics/ApplicationHistoryAnalytics';

export default function ApplicationHistoryPage() {
  const applicationHistoriesApi = new ApplicationHistories();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // 'table' | 'card' | 'analytics'
  const [filters, setFilters] = useState({ status: 'ALL', from: '', to: '' });

  useEffect(() => {
    const loadHistories = async () => {
      try {
        const data = await applicationHistoriesApi.getApplicationHistories();
        setHistories(data || []);
      } catch (error) {
        console.error('Nie udało się załadować historii aplikacji:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const originalHistories = [...histories];
    const updatedHistories = histories.map((history) =>
      history.id === id
        ? {
            ...history,
            status: newStatus,
            dateOfLastModified: history.dateOfLastModified,
          }
        : history
    );
    setHistories(updatedHistories);
    const request = { applicationHistoriesID: id, status: newStatus };
    try {
      await applicationHistoriesApi.editApplicationHistories(request);
      const label = STATUS_MAP[newStatus]?.label || newStatus;
      toast.success(`Status został zaktualizowany na: ${label}`);
    } catch (error) {
      console.error(
        `Nie udało się zaktualizować statusu dla aplikacji ${id}`,
        error
      );
      setHistories(originalHistories);
    }
  };

  const filteredHistories = useMemo(() => {
    return histories.filter((h) => {
      const matchesStatus =
        filters.status === 'ALL' ? true : h.status === filters.status;
      const appDate = new Date(h.dateOfApplication);
      const fromOk = filters.from ? appDate >= new Date(filters.from) : true;
      const toOk = filters.to ? appDate <= new Date(filters.to) : true;
      return matchesStatus && fromOk && toOk;
    });
  }, [histories, filters]);

  const renderContent = () => {
    // ⬇️ Najpierw obsłuż widok wykresów – ma własne dane i loader
    if (view === 'analytics') {
      return <ApplicationHistoryAnalytics />;
    }

    if (loading) return <LoadingSpinner />;
    if (!histories.length) return <EmptyState />;

    if (view === 'table') {
      return (
        <ApplicationHistoryTable
          histories={filteredHistories}
          onStatusChange={handleStatusChange}
        />
      );
    }

    // domyślnie karty
    return (
      <div className="space-y-6">
        {filteredHistories.map((history) => (
          <ApplicationHistoryCard
            key={history.id}
            history={history}
            onStatusChange={(newStatus) =>
              handleStatusChange(history.id, newStatus)
            }
          />
        ))}
        {!filteredHistories.length && (
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/60 p-8 text-center text-slate-500">
            Brak wyników dla wybranych filtrów
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar showShadow={true} />
      <div className="min-h-screen bg-gradient-to-br bg-ivorylight to-teal-50 font-sans">
        <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-5">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-teal-600">
                  Historia Aplikacji
                </h1>
                <p className="text-slate-600 text-lg mt-2">
                  Śledź i zarządzaj wszystkimi swoimi aplikacjami w jednym
                  miejscu.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 w-full">
                <ViewToggle value={view} onChange={setView} />

                {/* ⬇️ Nie pokazujemy filtrów w trybie „Wykresy” */}
                {view !== 'analytics' && (
                  <FiltersBar
                    filters={filters}
                    onChange={setFilters}
                    onClear={() =>
                      setFilters({ status: 'ALL', from: '', to: '' })
                    }
                    resultsCount={filteredHistories.length}
                  />
                )}

                {view !== 'analytics' && filters.status !== 'ALL' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      Wybrany status:
                    </span>
                    <StatusBadge value={filters.status} />
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="space-y-6">{renderContent()}</main>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}
