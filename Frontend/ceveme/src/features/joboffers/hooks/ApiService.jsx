// api/ApiService.js
import axios from '../../../../api';

class ApiService {
  async getJobs({ pageNumber = 1 }) {
    const res = await axios.get('/api/jobOffer/getJobs', {
      params: { pageNumber },
    });
    return res.data;
  }

   async serachJobs({ q = '', pageNumber = 1, size = 50, sort = 'newest' }) {
    const res = await axios.get('/api/jobOffer/search', {
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
      dateAddedFrom,
      dateAddedForm,
      dateAddedTo,
    } = filters;

    const from = dateAddedFrom || dateAddedForm || null;

    const params = {
      company,
      city,
      experienceLevel,
      employmentType,
      title,
      pageNumber,
      size,
      sort,
    };

    if (from) params.dateAddedFrom = from;
    if (dateAddedTo) params.dateAddedTo = dateAddedTo;

    const res = await axios.get('/api/jobOffer/searchBy', {
      params,
      paramsSerializer: { indexes: null },
    });
    return res.data;
  }

  async orderByDateAddedDESC({ pageNumber = 1 }) {
    const res = await axios.get('/api/jobOffer/orderByDateAddedDESC', {
      params: { pageNumber },
      paramsSerializer: { indexes: null },
    });
    return res.data;
  }

  async orderByDateAddedASC({ pageNumber = 1 }) {
    const res = await axios.get('/api/jobOffer/orderByDateAddedASC', {
      params: { pageNumber },
      paramsSerializer: { indexes: null },
    });
    return res.data;
  }

  async orderBySalaryDESC({ pageNumber = 1 }) {
    const res = await axios.get('/api/jobOffer/orderBySalaryDESC', {
      params: { pageNumber },
      paramsSerializer: { indexes: null },
    });
    return res.data;
  }

  async orderBySalaryASC({ pageNumber = 1 }) {
    const res = await axios.get('/api/jobOffer/orderBySalaryASC', {
      params: { pageNumber },
      paramsSerializer: { indexes: null },
    });
    return res.data;
  }


  async generateCv(email, link) {
    const res = await axios.post('/api/ai/geminiByLink', { email, link });
    return res.data;
  }
}

export default new ApiService();
