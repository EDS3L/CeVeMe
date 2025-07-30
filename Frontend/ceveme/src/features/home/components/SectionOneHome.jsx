import HomeNavBar from "../components/HomeNavBar";

function SectionOneHome() {
	return (
		<div className="h-screen flex flex-col">
			<HomeNavBar />
			<div className="flex-1 bg-manilla flex items-center justify-center">
				<div className="w-5/6 h-8/12 md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2 bg-cloudlight border-2 rounded-4xl border-black flex justify-center items-center">
					<p className="text-center">Witaj</p>
				</div>
			</div>
		</div>
	);
}

export default SectionOneHome;
