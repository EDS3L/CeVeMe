// src/hooks/useJobs.js
import { useCallback, useEffect, useMemo, useState } from "react";
import jobOfferApi from "../hooks/ApiService";

export default function useJobs() {
  const [query, setQueryState] = useState("");
  const [filters, setFiltersState] = useState({
    city: "",
    experience: "",
    employmentType: "",
    company: "",
    title: "",
    dateAddedFrom: undefined,
    dateAddedTo: undefined,
  });
  const [sort, setSortState] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const suggestions = [];
  const size = 50;

  const setQuery = useCallback((val) => {
    setQueryState(val);
    setCurrentPage(1);
  }, []);

  const setFilters = useCallback((val) => {
    setFiltersState(val);
    setCurrentPage(1);
  }, []);

  const setSort = useCallback((val) => {
    setSortState(val);
    setCurrentPage(1);
  }, []);

  const hasFilters = useMemo(() => {
    const f = filters || {};
    return !!(
      (f.city && f.city.trim()) ||
      (f.experience && f.experience.trim()) ||
      (f.employmentType && f.employmentType.trim()) ||
      (f.company && f.company.trim()) ||
      (f.title && f.title.trim()) ||
      f.dateAddedFrom ||
      f.dateAddedTo
    );
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        let res;
        if (hasFilters) {
          res = await jobOfferApi.serachJobsBy({
            filters: {
              company: filters.company || "",
              city: filters.city || "",
              experienceLevel: filters.experience || "",
              employmentType: filters.employmentType || "",
              title: filters.title || "",
              dateAddedFrom: filters.dateAddedFrom,
              dateAddedTo: filters.dateAddedTo,
            },
            pageNumber: currentPage,
            size,
            sort,
          });
        } else if (query && query.trim() !== "") {
          res = await jobOfferApi.serachJobs({
            q: query.trim(),
            pageNumber: currentPage,
            size,
            sort,
          });
        } else {
          if (sort === "salaryDesc") {
            res = await jobOfferApi.orderBySalaryDESC({
              pageNumber: currentPage,
            });
          } else if (sort === "salaryAsc") {
            res = await jobOfferApi.orderBySalaryASC({
              pageNumber: currentPage,
            });
          } else {
            res = await jobOfferApi.serachJobs({
              q: "",
              pageNumber: currentPage,
              size,
              sort,
            });
          }
        }
        if (!cancelled) {
          setJobs(res.content || []);
          setTotalPages(res.totalPages || 1);
          setTotalElements(res.totalElements || 0);
        }
      } catch {
        if (!cancelled)
          setError("Nie udało się pobrać ofert. Spróbuj ponownie.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [query, filters, sort, currentPage, hasFilters]);

  const goToPage = useCallback((p) => {
    setCurrentPage(p);
    setTimeout(() => {
      const el = document.getElementById("jobs-grid-top");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, []);

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
