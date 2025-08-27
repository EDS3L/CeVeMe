import React from 'react';
import axios from '../../../../api';
import { toast } from 'react-toastify';

const jwt = document.cookie.replace('jwt=', '');

class UserDetails {
  async getUserDetailsInfo() {
    try {
      const resposne = await axios({
        url: `/api/users/userDetails`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        method: 'GET',
        withCredentials: true,
      });
      console.log(resposne.data);
      return resposne.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
}

export default UserDetails;
