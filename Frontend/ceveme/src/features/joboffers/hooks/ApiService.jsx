// api/ApiService.js
import axios from 'axios';

class ApiService {
  constructor(baseURL = 'http://localhost:8080') {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
      headers: { Accept: '*/*' },
    });
  }

  async getJobs({ pageNumber = 1 }) {
    const res = await this.client.get('/api/jobOffer/getJobs', {
      params: { pageNumber },
    });
    return res.data;
  }

  async serachJobs({ q = '', pageNumber = 1, size = 50, sort = 'newest' }) {
    const res = await this.client.get('/api/jobOffer/search', {
      params: { q, pageNumber, size, sort },
      paramsSerializer: { indexes: null },
    });
    return res.data;
  }

  async serachJobsBy({
    filters = {},
    pageNumber = 1,
    size = 50,
    sort = 'newest',
  }) {
    const {
      company = '',
      city = '',
      experienceLevel = '',
      employmentType = '',
      title = '',
      dateAddedForm,
      dateAddedTo,
    } = filters;
    const params = {
      company,
      city,
      experienceLevel,
      employmentType,
      title,
      dateAddedForm,
      dateAddedTo,
      pageNumber,
      size,
      sort,
    };

    if (dateAddedForm) params.dateAddedForm = dateAddedForm;
    if (dateAddedTo) params.dateAddedTo = dateAddedTo;

    const res = await this.client.get('/api/jobOffer/searchBy', {
      params,
      paramsSerializer: { indexes: null },
    });
    console.log(res);
    return res.data;
  }

  async generateCv(email, link) {
    const res = await this.client.post('/api/ai/geminiByLink', { email, link });
    return res.data;
  }
}

export default new ApiService();
