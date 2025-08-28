import React from 'react';
import axios from '../../../../api';
import { toast } from 'react-toastify';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// pobierz token JWT
const jwt = getCookie('jwt');

class UserDetailsInfo {
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

  async updateUserNameSurnameCity(newCity, newName, newSurname) {
    try {
      const resposne = await axios({
        url: `/api/users/cityAndNameAndSurname`,
        data: {
          newCity,
          newName,
          newSurname,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        method: 'PATCH',
        withCredentials: true,
      });
      toast.success(resposne.data.message);
      return resposne.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async uploadProfileImage(file, email) {
    if (!file) {
      toast.error('Brak pliku do przesłania');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('multipartFile', file);
      formData.append('email', email || '');

      const response = await axios({
        url: `/api/users/upload/profileImage`,
        method: 'POST',
        data: formData,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });

      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      const msg = error?.response?.data?.message || 'Błąd przesyłania zdjęcia';
      toast.error(msg);
      console.error('uploadProfileImage error:', error);
    }
  }

  async changePhoneNumber(phoneNumber) {
    try {
      const response = await axios({
        url: `/api/users/phone-number`,
        method: 'PATCH',
        data: { phoneNumber },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(msg);
      console.error('changePhoneNumber error:', error);
    }
  }

  async changeEmail(email) {
    try {
      const response = await axios({
        url: `/api/users/email`,
        method: 'PATCH',
        data: { email },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(msg);
      console.error('changeEmail error:', error);
    }
  }
}

export default UserDetailsInfo;
