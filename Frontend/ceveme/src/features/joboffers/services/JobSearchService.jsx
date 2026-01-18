import axios from "../../../../api";

class JobSearchService {
  async search(criteria) {
    const params = {
      ...criteria,
      q: criteria.q || undefined,
      company: criteria.company || undefined,
      city: criteria.city || undefined,
      experienceLevel: criteria.experienceLevel || undefined,
      employmentType: criteria.employmentType || undefined,
      title: criteria.title || undefined,
      dateAddedFrom: criteria.dateAddedFrom || undefined,
      dateAddedTo: criteria.dateAddedTo || undefined,
      salaryMin: criteria.salaryMin || undefined,
      salaryMax: criteria.salaryMax || undefined,
      salaryType: criteria.salaryType || undefined,
    };

    Object.keys(params).forEach((key) => {
      if (
        params[key] === undefined ||
        params[key] === "" ||
        params[key] === null
      ) {
        delete params[key];
      }
    });

    const response = await axios.get("/api/jobOffer/search", {
      params,
      paramsSerializer: { indexes: null },
    });

    return response.data;
  }

  async generateCv(email, link) {
    const response = await axios.post("/api/ai/geminiByLink", { email, link });
    return response.data;
  }
}

export default new JobSearchService();
