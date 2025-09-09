import React from 'react';
import axios from '../../../../api';
import { toast } from 'react-toastify';
class UserDetailsInfo {
  async getUserDetailsInfo() {
    try {
      const resposne = await axios({
        url: `/api/users/userDetails`,
        method: 'GET',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async getUseLimitsInfo() {
    try {
      const resposne = await axios({
        url: `/api/users/limit`,
        method: 'GET',
        withCredentials: true,
      });
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

  async changePassowrd(email, newPassword, confirmPassword) {
    const response = await axios({
      url: `/api/users/password`,
      method: 'PATCH',
      data: {
        email,
        newPassword,
        confirmPassword,
      },
      withCredentials: true,
    });
    toast.success(response.data?.message);
    return response.data;
  }
}

export default UserDetailsInfo;
