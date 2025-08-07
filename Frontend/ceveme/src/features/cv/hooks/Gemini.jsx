import axios from 'axios';

class ApiService {
  async generateCv(email, link) {
    try {
      const response = await axios({
        url: 'http://localhost:8080/api/ai/geminiByLink',
        method: 'POST',
        data: {
          email,
          link,
        },
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
