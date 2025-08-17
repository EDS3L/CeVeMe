import { useCallback, useEffect, useMemo, useState } from 'react';
import api from './ApiService';

// const parseSalaryNumber = (s) => {
//   if (!s) return null;
//   const m = s.replace(/\s/g, '').match(/(\d[\d]*)/);
//   return m ? parseInt(m[1], 10) : null;
// };

const DEFAULT_PAGE = 50;

const mapUiSort = (key) => {
  switch (key) {
    case 'newest':
      return 'newest';
    case 'endingSoon':
      return 'endingSoon';
    case 'companyAsc':
      return 'companyAsc';
    case 'titleAsc':
      return 'titleAsc';
    case 'cityAsc':
      return 'cityAsc';
    case 'salaryAsc':
    case 'salaryDesc':
    default:
      return 'newest';
  }
};

export default function useJobs() {
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [pageSize] = useState(DEFAULT_PAGE);
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // UI state
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    experience: '',
    employmentType: '',
    company: '',
  });
  const [sort, setSort] = useState('newest');

  const fetchPage = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError('');

        const serverSort = mapUiSort(sort);
        const hasFilters =
          (filters.city && filters.city.trim()) ||
          (filters.experience && filters.experience.trim()) ||
          (filters.employmentType && filters.employmentType.trim()) ||
          (filters.company && filters.company.trim());

        let page;

        if (hasFilters) {
          page = await api.serachJobsBy({
            filters: {
              city: filters.city || undefined,
              experienceLevel: filters.experience || undefined,
              employmentType: filters.employmentType || undefined,
              company: filters.company || undefined,
              title: query || undefined,
            },
            pageNumber: currentPage,
            size: pageSize,
            sort: serverSort,
            signal,
          });
        } else if ((query || '').trim()) {
          page = await api.serachJobs({
            q: query.trim(),
            pageNumber: currentPage,
            size: pageSize,
            sort: serverSort,
            signal,
          });
        } else {
          page = await api.getJobs({
            pageNumber: currentPage,
            size: pageSize,
            sort: serverSort,
            signal,
          });
        }

        const items = Array.isArray(page?.content) ? page.content : [];
        let arranged = items.slice();

        setRaw(arranged);
        setTotalPages(page?.totalPages || 1);
        setTotalElements(page?.totalElements ?? arranged.length);
      } catch (e) {
        if (e?.name === 'AbortError') return;
        setError('Nie udało się pobrać ofert. Spróbuj ponownie.');
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, filters, query, sort]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchPage(controller.signal);
    return () => controller.abort();
  }, [fetchPage]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const gridTop = document.getElementById('jobs-grid-top');
    if (gridTop) gridTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jobs = useMemo(() => raw, [raw]);

  // Podpowiedzi – liczone z aktualnej strony (dla wydajności)
  const suggestions = useMemo(() => {
    const cityCount = {};
    const techCount = {};
    raw.forEach((j) => {
      const city = (j.location?.city || '').trim();
      if (city) cityCount[city] = (cityCount[city] || 0) + 1;

      (j.requirements || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((t) => {
          techCount[t] = (techCount[t] || 0) + 1;
        });
    });

    const cities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ type: 'city', label: name, count }));

    const techs = Object.entries(techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ type: 'tech', label: name, count }));

    return { cities, techs };
  }, [raw]);

  return {
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
  };
}
