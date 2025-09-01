import React, { useState, useEffect } from 'react';
import ApplicationHistoryCard from '../components/ApplicationHistoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

import { ClipboardList } from 'lucide-react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplicationHistories from '../hooks/useApplicationHistories';
import Navbar from '../../../components/Navbar';

export default function ApplicationHistoryPage() {
  const applicationHistoriesApi = new ApplicationHistories();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistories = async () => {
      try {
        const data = await applicationHistoriesApi.getApplicationHistories();
        setHistories(data);
      } catch (error) {
        console.error('Nie udało się załadować historii aplikacji:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistories();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const originalHistories = [...histories];
    const updatedHistories = histories.map((history) =>
      history.id === id ? { ...history, status: newStatus } : history
    );
    setHistories(updatedHistories);

    try {
      // todo: zorbic api zmainy statusu
    } catch (error) {
      console.error(
        `Nie udało się zaktualizować statusu dla aplikacji ${id}`,
        error
      );
      setHistories(originalHistories);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (histories.length === 0) {
      return <EmptyState />;
    }
    return (
      <div className="space-y-6">
        {histories.map((history) => (
          <ApplicationHistoryCard
            key={history.id}
            history={history}
            onStatusChange={(newStatus) =>
              handleStatusChange(history.id, newStatus)
            }
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br bg-ivorylight to-teal-50 font-sans ">
        <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-teal-600 mb-2">
              Historia Aplikacji
            </h1>
            <p className="text-slate-600 text-lg">
              Śledź i zarządzaj wszystkimi swoimi aplikacjami w jednym miejscu.
            </p>
          </header>
          <main>{renderContent()}</main>
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
