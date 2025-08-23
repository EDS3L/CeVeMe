import { toast } from 'react-toastify';
import axios from '../../../../api';
import React from 'react';

class EmploymentInfoCreate {
  async createLanguage(id, email, name, level, employmentInfoId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/language`,
        data: {
          id,
          email,
          name,
          level,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async createCertificate(
    id,
    email,
    name,
    dateOfCertificate,
    employmentInfoId
  ) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/certificate`,
        data: {
          id,
          email,
          name,
          dateOfCertificate,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async createExperience(
    id,
    email,
    companyName,
    startingDate,
    endDate,
    currently,
    positionName,
    jobDescription,
    jobAchievements,
    employmentInfoId
  ) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/experience`,
        data: {
          id,
          email,
          companyName,
          startingDate,
          endDate,
          currently,
          positionName,
          jobDescription,
          jobAchievements,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async createCourse(
    id,
    email,
    courseName,
    dateOfCourse,
    courseDescription,
    employmentInfoId
  ) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/course`,
        data: {
          id,
          email,
          courseName,
          dateOfCourse,
          courseDescription,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async createSkill(id, email, name, type, employmentInfoId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/skill`,
        data: {
          id,
          email,
          name,
          type,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async createPortfolio(id, email, title, description, employmentInfoId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/portfolioItem`,
        data: {
          id,
          email,
          title,
          description,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async createLink(id, email, title, link, employmentInfoId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/link`,
        data: {
          id,
          email,
          title,
          link,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  async createEducation(
    id,
    email,
    schoolName,
    degree,
    fieldOfStudy,
    startingDate,
    endDate,
    currently,
    employmentInfoId
  ) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/education`,
        data: {
          id,
          email,
          schoolName,
          degree,
          fieldOfStudy,
          startingDate,
          endDate,
          currently,
          employmentInfoId,
        },
        method: 'POST',
        withCredentials: true,
      });
      return resposne.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }
}

export default EmploymentInfoCreate;
