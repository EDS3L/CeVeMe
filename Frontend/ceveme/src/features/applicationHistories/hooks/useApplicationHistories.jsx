import React from "react";
import axios from "../../../../api";
import { toast } from "react-toastify";

class ApplicationHistories {
	async getApplicationHistories() {
		try {
			const response = await axios({
				url: `/api/applicationHistory/`,
				method: "GET",
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			toast.error(error.response?.data?.message);
		}
	}

	async saveApplicationHistory(request) {
		try {
			const response = await axios({
				url: `/api/applicationHistory/save`,
				method: "POST",
				data: request,
				withCredentials: true,
			});
			toast.success(response.data.message);
			return response.data;
		} catch (error) {
			toast.error(error.response?.data?.message);
		}
	}

	async uploadCvFile(file, jobOfferLink) {
		try {
			const formData = new FormData();
			formData.append("multipartFile", file);
			formData.append("jobOfferLink", jobOfferLink);

			const response = await axios({
				url: `/api/users/upload/cvFile`,
				method: "POST",
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			});

			toast.success(response.data.message);
			return response.data;
		} catch (error) {
			toast.error(error.response?.data?.message);
		}
	}
}

export default ApplicationHistories;
