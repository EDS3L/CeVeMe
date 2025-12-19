import axios from '../../../../api';
import React from 'react';
import { toast } from 'react-toastify';

class Refinement {
	async refinementRequirements(text, label) {
		try {
			const resposne = await axios({
				url: `/api/ai/refinementText`,
				data: {
					text,
					label,
				},
				method: 'POST',
			});
			console.log(resposne.data);
			return resposne.data;
		} catch (error) {
			toast.error(error.response.data.message);
		}
	}

	async checkTimeout(endpointType) {
		try {
			const resposne = await axios({
				url: `/api/ai/timeout?endpointType=${endpointType}`,
				method: 'POST',
			});
			console.log(resposne.data);
			return resposne.data;
		} catch (error) {
			console.log(error);
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
