import axios from '../../../../api';
import React from 'react';

class ImploymentInfoEdit {
  async getEmploymentInfo(email) {
    const resposne = await axios({
      url: `/api/employmentInfo/create/${email}`,
      method: 'GET',
      withCredentials: true,
    });
    return resposne.data;
  }
  catch(error) {
    console.error(error);
    throw error;
  }
}

export default ImploymentInfoEdit;
