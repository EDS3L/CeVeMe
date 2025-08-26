import axios from '../../../../api';
import React from 'react';

const jwt = document.cookie.replace('jwt=', '');

class CvGenerator {
  async createCvByJobOffer(email, link) {
    const resposne = await axios({
      url: `/api/ai/geminiByLink`,
      data: {
        email,
        link,
      },
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      withCredentials: true,
    });
    return resposne.data;
  }
  catch(error) {
    console.error(error);
    throw error;
  }
}

export default CvGenerator;
