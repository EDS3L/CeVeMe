import axios from '../../../../../api';

class ApiService {
  async generateCv(email, link) {
    try {
      const response = await axios({
        url: '/api/ai/geminiByLink',
        method: 'POST',
        data: { email, link },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error during CV generation:', error);
      throw error;
    }
  }
}

export default new ApiService();
