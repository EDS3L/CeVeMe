import axios from '../../../../api';
import React from 'react';
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// pobierz token JWT
const token = getCookie('jwt');
class ImploymentInfoGet {
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

  async delete(id, email) {
    const response = await axios({
      url: `/api/users/deleteUser`,
      method: 'DELETE',
      withCredentials: true,
      data: {
        email,
        id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export default ImploymentInfoGet;
