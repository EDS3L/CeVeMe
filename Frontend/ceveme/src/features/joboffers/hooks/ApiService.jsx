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

    const res = await axios.get('/api/jobOffer/searchBy', {
      params,
      paramsSerializer: { indexes: null },
    });
    console.log(res);
    return res.data;
  }

  async generateCv(email, link) {
    const res = await axios.post('/api/ai/geminiByLink', { email, link });
    return res.data;
  }
}

export default new ApiService();
