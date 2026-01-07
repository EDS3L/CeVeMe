import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULT_CRITERIA = {
  q: "",
  company: "",
  city: "",
  experienceLevel: "",
  employmentType: "",
  title: "",
  dateAddedFrom: null,
  dateAddedTo: null,
  pageNumber: 0,
  size: 50,
  sort: "newest",
};

export const useSearchState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localCriteria, setLocalCriteria] = useState(() =>
    parseUrlToCriteria(searchParams)
  );

  const syncCriteriaToUrl = useCallback(
    (criteria) => {
      const params = new URLSearchParams();

      Object.entries(criteria).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== 0
        ) {
          params.set(key, String(value));
        }
      });

      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const newCriteria = parseUrlToCriteria(searchParams);
    setLocalCriteria(newCriteria);
  }, [searchParams]);

  const updateCriteria = useCallback(
    (updates) => {
      setLocalCriteria((prev) => {
        const updated = { ...prev, ...updates };

        if (Object.keys(updates).some((key) => key !== "pageNumber")) {
          updated.pageNumber = 0;
        }

        syncCriteriaToUrl(updated);
        return updated;
      });
    },
    [syncCriteriaToUrl]
  );

  const resetCriteria = useCallback(() => {
    const reset = { ...DEFAULT_CRITERIA };
    setLocalCriteria(reset);
    syncCriteriaToUrl(reset);
  }, [syncCriteriaToUrl]);

  const hasActiveFilters = useCallback(() => {
    return Object.keys(DEFAULT_CRITERIA).some((key) => {
      if (key === "pageNumber" || key === "size" || key === "sort")
        return false;
      return localCriteria[key] && localCriteria[key] !== DEFAULT_CRITERIA[key];
    });
  }, [localCriteria]);

  return {
    criteria: localCriteria,
    updateCriteria,
    resetCriteria,
    hasActiveFilters: hasActiveFilters(),
  };
};

function parseUrlToCriteria(searchParams) {
  const criteria = { ...DEFAULT_CRITERIA };

  const q = searchParams.get("q");
  if (q) criteria.q = q;

  const company = searchParams.get("company");
  if (company) criteria.company = company;

  const city = searchParams.get("city");
  if (city) criteria.city = city;

  const experienceLevel = searchParams.get("experienceLevel");
  if (experienceLevel) criteria.experienceLevel = experienceLevel;

  const employmentType = searchParams.get("employmentType");
  if (employmentType) criteria.employmentType = employmentType;

  const title = searchParams.get("title");
  if (title) criteria.title = title;

  const dateAddedFrom = searchParams.get("dateAddedFrom");
  if (dateAddedFrom) criteria.dateAddedFrom = dateAddedFrom;

  const dateAddedTo = searchParams.get("dateAddedTo");
  if (dateAddedTo) criteria.dateAddedTo = dateAddedTo;

  const pageNumber = searchParams.get("pageNumber");
  if (pageNumber) criteria.pageNumber = parseInt(pageNumber, 10);

  const size = searchParams.get("size");
  if (size) criteria.size = parseInt(size, 10);

  const sort = searchParams.get("sort");
  if (sort) criteria.sort = sort;

  return criteria;
}
