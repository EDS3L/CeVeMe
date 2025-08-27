import { useState, useEffect } from "react";
import PersonalData from "./PersonalData";
import PasswordDetails from "./PasswordDetails";
import EmailAndPhone from "./EmailAndPhone";
import UserNavBar from "./UserNavBar";
import DeleteAccount from "./DeleteAccount";
import Limits from "./Limits";

import UserDetailsInfo from "../hooks/useUserDeailsInfo";

function UserDetails() {
	const [userData, setUserData] = useState(null);
	const userDatails = new UserDetailsInfo();

	useEffect(() => {
		async function fetchData() {
			const data = await userDatails.getUserDetailsInfo();
			setUserData(data);
		}
		fetchData();
	}, []);

	if (!userData) return <p>Ładowanie danych...</p>;
	return (
		<div className="min-h-dvh bg-ivorylight text-slatedark">
			<UserNavBar />
			<div className="flex w-full justify-center">
				<div className="flex flex-col w-5/6">
					<PersonalData data={userData} />
					<EmailAndPhone data={userData} />
					<PasswordDetails />
					<DeleteAccount />
					<Limits />
				</div>
			</div>
		</div>
	);
}

export default UserDetails;
