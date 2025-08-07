import { Link } from "react-router-dom";
import SectionOneHome from "../components/SectionOneHome";
import SectionTwoHome from "../components/SectionTwoHome";

export default function Home() {
	return (
		<div>
			<SectionOneHome />
			<SectionTwoHome></SectionTwoHome>
			<div className="h-screen w-screen bg-blue">s</div>
		</div>
	);
}
