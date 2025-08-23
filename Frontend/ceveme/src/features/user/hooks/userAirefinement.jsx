import axios from '../../../../api';
import React from 'react';
import { toast } from 'react-toastify';

const jwt = document.cookie.replace('jwt=', '');

class Refinement {
  async refinementRequirements(text, label) {
    try {
      const resposne = await axios({
        url: `/api/ai/refinementText`,
        data: {
          text,
          label,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        method: 'POST',
        withCredentials: true,
      });
      console.log(resposne.data);
      return resposne.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  //   async refinementPortfolioDescription(itemId) {
  //     try {
  //       const resposne = await axios({
  //         url: `/api/ai/refinementPortfolioDescription`,
  //         data: {
  //           itemId,
  //         },
  //         method: 'POST',
  //         withCredentials: true,
  //       });
  //       return resposne.data;
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //     }
  //   }
  //   async refinementJobAchievements(itemId) {
  //     try {
  //       const resposne = await axios({
  //         url: `/api/ai/refinementJobAchievements`,
  //         data: {
  //           itemId,
  //         },
  //         method: 'POST',
  //         withCredentials: true,
  //       });
  //       return resposne.data;
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //     }
  //   }
  //   async refinementCourseDescription(itemId) {
  //     try {
  //       const resposne = await axios({
  //         url: `/api/ai/refinementCourseDescription`,
  //         data: {
  //           itemId,
  //         },
  //         method: 'POST',
  //         withCredentials: true,
  //       });
  //       return resposne.data;
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //     }
  //   }
  // }
}

export default Refinement;
