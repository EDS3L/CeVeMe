import axios from '../../../../api';
import React from 'react';

class EmploymentInfoCreate {
  async createLanguage(id, email, name, level, employmentInfoId) {
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
  }

  async createCertificate(
    id,
    email,
    name,
    dateOfCertificate,
    employmentInfoId
  ) {
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
  }

  async createCourse(
    id,
    email,
    courseName,
    dateOfCourse,
    courseDescription,
    employmentInfoId
  ) {
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
  }

  async createSkill(id, email, name, type, employmentInfoId) {
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
  }

  async createPortfolio(id, email, title, description, employmentInfoId) {
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
  }

  async createLink(id, email, title, link, employmentInfoId) {
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
  }

  catch(error) {
    console.error(error);
    throw error;
  }
}

export default EmploymentInfoCreate;
