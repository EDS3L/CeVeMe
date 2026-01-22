import { useState, useCallback } from "react";
import ReportsService from "../services/ReportsService";

const useReports = () => {
  const [dateAddedData, setDateAddedData] = useState([]);
  const [experiencePerCityData, setExperiencePerCityData] = useState([]);
  const [experiencePerVoivodeshipData, setExperiencePerVoivodeshipData] =
    useState([]);
  const [salaryPerCityData, setSalaryPerCityData] = useState([]);
  const [salaryPerExperienceData, setSalaryPerExperienceData] = useState([]);
  const [salaryPerVoivodeshipData, setSalaryPerVoivodeshipData] = useState([]);

  const [loading, setLoading] = useState({
    dateAdded: false,
    experiencePerCity: false,
    experiencePerVoivodeship: false,
    salaryPerCity: false,
    salaryPerExperience: false,
    salaryPerVoivodeship: false,
  });

  const [errors, setErrors] = useState({
    dateAdded: null,
    experiencePerCity: null,
    experiencePerVoivodeship: null,
    salaryPerCity: null,
    salaryPerExperience: null,
    salaryPerVoivodeship: null,
  });

  const fetchDateAddedReport = useCallback(
    async (experience = "%", fromDate = "%", toDate = "%") => {
      setLoading((prev) => ({ ...prev, dateAdded: true }));
      setErrors((prev) => ({ ...prev, dateAdded: null }));
      try {
        const data = await ReportsService.getDateAddedReport(
          experience,
          fromDate,
          toDate,
        );
        setDateAddedData(data);
      } catch (error) {
        setErrors((prev) => ({ ...prev, dateAdded: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, dateAdded: false }));
      }
    },
    [],
  );

  const fetchExperiencePerCityReport = useCallback(
    async (city = "%", experience = "%") => {
      setLoading((prev) => ({ ...prev, experiencePerCity: true }));
      setErrors((prev) => ({ ...prev, experiencePerCity: null }));
      try {
        const data = await ReportsService.getExperiencePerCityReport(
          city,
          experience,
        );
        setExperiencePerCityData(data);
      } catch (error) {
        setErrors((prev) => ({ ...prev, experiencePerCity: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, experiencePerCity: false }));
      }
    },
    [],
  );

  const fetchExperiencePerVoivodeshipReport = useCallback(
    async (experience = "%", voivodeship = "%") => {
      setLoading((prev) => ({ ...prev, experiencePerVoivodeship: true }));
      setErrors((prev) => ({ ...prev, experiencePerVoivodeship: null }));
      try {
        const data = await ReportsService.getExperiencePerVoivodeshipReport(
          experience,
          voivodeship,
        );
        setExperiencePerVoivodeshipData(data);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          experiencePerVoivodeship: error.message,
        }));
      } finally {
        setLoading((prev) => ({ ...prev, experiencePerVoivodeship: false }));
      }
    },
    [],
  );

  const fetchSalaryPerCityReport = useCallback(async (city = "%") => {
    setLoading((prev) => ({ ...prev, salaryPerCity: true }));
    setErrors((prev) => ({ ...prev, salaryPerCity: null }));
    try {
      const data = await ReportsService.getSalaryPerCityReport(city);
      setSalaryPerCityData(data);
    } catch (error) {
      setErrors((prev) => ({ ...prev, salaryPerCity: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, salaryPerCity: false }));
    }
  }, []);

  const fetchSalaryPerExperienceReport = useCallback(
    async (experience = "%") => {
      setLoading((prev) => ({ ...prev, salaryPerExperience: true }));
      setErrors((prev) => ({ ...prev, salaryPerExperience: null }));
      try {
        const data =
          await ReportsService.getSalaryPerExperienceReport(experience);
        setSalaryPerExperienceData(data);
      } catch (error) {
        setErrors((prev) => ({ ...prev, salaryPerExperience: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, salaryPerExperience: false }));
      }
    },
    [],
  );

  const fetchSalaryPerVoivodeshipReport = useCallback(
    async (voivodeship = "%") => {
      setLoading((prev) => ({ ...prev, salaryPerVoivodeship: true }));
      setErrors((prev) => ({ ...prev, salaryPerVoivodeship: null }));
      try {
        const data =
          await ReportsService.getSalaryPerVoivodeshipReport(voivodeship);
        setSalaryPerVoivodeshipData(data);
      } catch (error) {
        setErrors((prev) => ({ ...prev, salaryPerVoivodeship: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, salaryPerVoivodeship: false }));
      }
    },
    [],
  );

  const fetchAllReports = useCallback(async () => {
    await Promise.all([
      fetchDateAddedReport(),
      fetchExperiencePerCityReport(),
      fetchExperiencePerVoivodeshipReport(),
      fetchSalaryPerCityReport(),
      fetchSalaryPerExperienceReport(),
      fetchSalaryPerVoivodeshipReport(),
    ]);
  }, [
    fetchDateAddedReport,
    fetchExperiencePerCityReport,
    fetchExperiencePerVoivodeshipReport,
    fetchSalaryPerCityReport,
    fetchSalaryPerExperienceReport,
    fetchSalaryPerVoivodeshipReport,
  ]);

  return {
    dateAddedData,
    experiencePerCityData,
    experiencePerVoivodeshipData,
    salaryPerCityData,
    salaryPerExperienceData,
    salaryPerVoivodeshipData,
    loading,
    errors,
    fetchDateAddedReport,
    fetchExperiencePerCityReport,
    fetchExperiencePerVoivodeshipReport,
    fetchSalaryPerCityReport,
    fetchSalaryPerExperienceReport,
    fetchSalaryPerVoivodeshipReport,
    fetchAllReports,
  };
};

export default useReports;
