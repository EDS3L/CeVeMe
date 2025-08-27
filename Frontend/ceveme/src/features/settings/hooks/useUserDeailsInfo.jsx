import React from "react";
import axios from "../../../../api";
import { toast } from "react-toastify";

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(";").shift();
}

// pobierz token JWT
const jwt = getCookie("jwt");

class UserDetailsInfo {
	async getUserDetailsInfo() {
		try {
			const resposne = await axios({
				url: `/api/users/userDetails`,
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
				method: "GET",
				withCredentials: true,
			});
			console.log(resposne.data);
			return resposne.data;
		} catch (error) {
			toast.error(error.response.data.message);
		}
	}

	async updateUserNameSurnameCity(data) {
		try {
			console.log(data);
			const resposne = await axios({
				url: `/api/users/cityAndNameAndSurname`,
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				method: "PATCH",
				withCredentials: true,
				data,
			});
			toast.success("Dane zapisane pomyślnie");
			return resposne.data;
		} catch (error) {
			toast.error(error.response?.data?.message);
		}
	}
}

export default UserDetailsInfo;
