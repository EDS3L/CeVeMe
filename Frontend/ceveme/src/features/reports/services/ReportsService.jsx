import axios from "../../../../api";

class ReportsService {
  async getDateAddedReport(experience = "%", fromDate = "%", toDate = "%") {
    const response = await axios.get("/api/reports/date-added", {
      params: { experience, fromDate, toDate },
    });
    return response.data;
  }

  async getExperiencePerCityReport(city = "%", experience = "%") {
    const response = await axios.get("/api/reports/experience-per-city", {
      params: { city, experience },
    });
    return response.data;
  }

  async getExperiencePerVoivodeshipReport(experience = "%", voivodeship = "%") {
    const response = await axios.get(
      "/api/reports/experience-per-voivodeship",
      {
        params: { experience, voivodeship },
      },
    );
    return response.data;
  }

  async getSalaryPerCityReport(city = "%") {
    const response = await axios.get("/api/reports/salary-per-city", {
      params: { city },
    });
    return response.data;
  }

  async getSalaryPerExperienceReport(experience = "%") {
    const response = await axios.get("/api/reports/salary-per-experience", {
      params: { experience },
    });
    return response.data;
  }

  async getSalaryPerVoivodeshipReport(voivodeship = "%") {
    const response = await axios.get("/api/reports/salary-per-voivodeship", {
      params: { voivodeship },
    });
    return response.data;
  }
}

export default new ReportsService();
