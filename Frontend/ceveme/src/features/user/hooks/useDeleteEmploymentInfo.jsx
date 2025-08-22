import { toast } from 'react-toastify';
import axios from '../../../../api';
import React from 'react';

const jwt = document.cookie.replace('jwt=', '');

class EmploymentInfoDelete {
  async deleteLanguage(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/language`,
        data: {
          itemId,
        },
        method: 'DELETE',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async deleteCertificate(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/certificate`,
        data: {
          itemId,
        },
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async deleteExperience(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/experience`,
        data: {
          itemId,
        },
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async deleteCourse(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/course`,
        data: {
          itemId,
        },
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async deleteSkill(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/skill`,
        data: {
          itemId,
        },
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async deletePortfolio(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/portfolioItem`,
        data: {
          itemId,
        },
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async deleteLink(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/link`,
        data: {
          itemId,
        },
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async deleteEducation(itemId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/delete/education`,
        data: {
          itemId,
        },
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }
}

export default EmploymentInfoDelete;
