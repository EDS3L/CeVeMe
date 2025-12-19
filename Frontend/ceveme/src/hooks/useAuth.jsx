import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function useAuth() {
	const [email, setEmail] = useState(null);

	useEffect(() => {
		const token = document.cookie
			.split("; ")
			.find((row) => row.startsWith("accessToken="))
			?.split("=")[1];

		if (token) {
			try {
				const decodedToken = decodeURIComponent(token);
				const decoded = jwtDecode(decodedToken);
				setEmail(decoded.sub);
			} catch (error) {
				console.error("Invalid JWT token:", error);
				console.error("Token value:", token);
				try {
					const decoded = jwtDecode(token);
					setEmail(decoded.email);
				} catch (secondError) {
					console.error("Second attempt failed:", secondError);
				}
			}
		}
	}, []);

	return { email };
}

export default useAuth;
