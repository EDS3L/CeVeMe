import { Link } from "react-router-dom";
import SectionOneHome from "../components/SectionOneHome";
import { useEffect, useState } from "react";

export default function Home() {
	const [showNavigation, setShowNavigation] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowNavigation(window.scrollY > 150);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div>
			<SectionOneHome />
			<div className="h-screen w-screen bg-black">s</div>
			{showNavigation && (
				<div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
					<div className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-red-700 transition">
						Danger
					</div>
				</div>
			)}
		</div>
	);
}
