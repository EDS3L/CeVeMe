import axios from '../../../../api';
class EmploymentInfoEdit {
  async editCertificate(id, name, dateOfCertificate) {
    const response = await axios({
      url: `/api/employmentInfo/edit/certificate`,
      method: 'PATCH',
      withCredentials: true,
      data: { id, name, dateOfCertificate },
    });
    return response.data;
  }

  async editCourse(id, courseName, dateOfCourse, courseDescription) {
    const response = await axios({
      url: `/api/employmentInfo/edit/course`,
      method: 'PATCH',
      withCredentials: true,
      data: { id, courseName, dateOfCourse, courseDescription },
    });
    return response.data;
  }

  async editExperience(
    id,
    companyName,
    startingDate,
    endDate,
    currently,
    positionName,
    jobDescription,
    jobAchievements
  ) {
    const response = await axios({
      url: `/api/employmentInfo/edit/experience`,
      method: 'PATCH',
      withCredentials: true,
      data: {
        id,
        companyName,
        startingDate,
        endDate,
        currently,
        positionName,
        jobDescription,
        jobAchievements,
      },
    });
    return response.data;
  }

  async editLanguage(id, name, level) {
    const response = await axios({
      url: `/api/employmentInfo/edit/language`,
      method: 'PATCH',
      withCredentials: true,
      data: { id, name, level },
    });
    return response.data;
  }

  async editSkill(id, name, type) {
    const response = await axios({
      url: `/api/employmentInfo/edit/skill`,
      method: 'PATCH',
      withCredentials: true,
      data: { id, name, type },
    });
    return response.data;
  }

  async editPortfolioItem(id, title, description, url) {
    const response = await axios({
      url: `/api/employmentInfo/edit/portfolioItem`,
      method: 'PATCH',
      withCredentials: true,
      data: { id, title, description, url },
    });
    return response.data;
  }

  async editLink(id, title, link) {
    const response = await axios({
      url: `/api/employmentInfo/edit/link`,
      method: 'PATCH',
      withCredentials: true,
      data: { id, title, link },
    });
    return response.data;
  }

  async editEducation(
    id,
    schoolName,
    degree,
    fieldOfStudy,
    startingDate,
    endDate,
    currently
  ) {
    const response = await axios({
      url: `/api/employmentInfo/edit/education`,
      method: 'PATCH',
      withCredentials: true,
      data: {
        id,
        schoolName,
        degree,
        fieldOfStudy,
        startingDate,
        endDate,
        currently,
      },
    });
    return response.data;
  }
}

export default EmploymentInfoEdit;
