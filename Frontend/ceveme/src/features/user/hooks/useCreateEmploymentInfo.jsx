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

  async createCertificate(name, dateOfCertificate) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/certificate`,
        data: {
          name,
          dateOfCertificate,
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

  async createCourse(courseName, dateOfCourse, courseDescription) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/course`,
        data: {
          courseName,
          dateOfCourse,
          courseDescription,
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

  async createSkill(name, type) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/skill`,
        data: {
          name,
          type,
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

  async createPortfolio(id, email, title, description, url, employmentInfoId) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/portfolioItem`,
        data: {
          id,
          email,
          title,
          description,
          url,
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
    schoolName,
    degree,
    fieldOfStudy,
    startingDate,
    endDate,
    currently
  ) {
    try {
      const resposne = await axios({
        url: `/api/employmentInfo/create/education`,
        data: {
          schoolName,
          degree,
          fieldOfStudy,
          startingDate,
          endDate,
          currently,
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
