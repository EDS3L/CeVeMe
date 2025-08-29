import HomeNavBar from "./SectionOneComponents/HomeNavBar";
import HomeNavBarScroll from "./SectionOneComponents/HomeNavBarScroll";
import Hero from "./SectionOneComponents/Hero";

function SectionOneHome() {
	return (
		<div className="h-screen flex flex-col">
			<HomeNavBar />
			<HomeNavBarScroll />
			<Hero />
		</div>
	);
}

export default SectionOneHome;
