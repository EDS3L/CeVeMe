import React, { useState, useEffect } from "react";
import OrbitingIcon from "./OrbitingIcon"; // Importowanie podkomponentu
import OrbitCard from "./OrbitCard"; // Zakładam, że to osobny komponent

// Dane dla ikon, które będą krążyć
const orbitingIconsData = [
	{
		id: 1,
		letter: "C",
		letterColor: "#F472B6",
		initialAngle: 60,
		color: "rgb(204, 120, 92)",
	},
	{
		id: 2,
		letter: "E",
		letterColor: "#FBBF24",
		initialAngle: 120,
		color: "rgb(212, 162, 127)",
	},
	{
		id: 3,
		letter: "V",
		letterColor: "#60A5FA",
		initialAngle: 180,
		color: "rgb(97, 170, 242)",
	},
	{
		id: 4,
		letter: "E",
		letterColor: "#F87171",
		initialAngle: 240,
		color: "rgb(191, 77, 67)",
	},
	{
		id: 5,
		letter: "M",
		letterColor: "#22D3EE",
		initialAngle: 300,
		color: "rgb(97, 170, 242)",
	},
	{
		id: 6,
		letter: "E",
		letterColor: "#A78BFA",
		initialAngle: 360,
		color: "rgb(97, 170, 242)",
	},
];

export default function App() {
	const [ellipseRadii, setEllipseRadii] = useState({ x: 400, y: 200 }); // Domyślne wartości dla dużych ekranów
	const [isPaused, setIsPaused] = useState(false);
	const [hoveredIconId, setHoveredIconId] = useState(null);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setEllipseRadii({
					x: window.innerWidth * 0.4,
					y: window.innerWidth * 0.2,
				});
			} else if (window.innerWidth < 1024) {
				setEllipseRadii({ x: 300, y: 150 });
			} else {
				setEllipseRadii({ x: 400, y: 200 });
			}
		};

		handleResize(); // Ustawienie początkowych wymiarów
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleMouseEnter = (id) => {
		setIsPaused(true);
		setHoveredIconId(id);
	};

	const handleMouseLeave = () => {
		setIsPaused(false);
		setHoveredIconId(null);
	};

	return (
		<div className="font-sans flex flex-col items-center justify-center w-screen h-screen">
			<div
				className="relative flex items-center justify-center"
				style={{
					width: `${ellipseRadii.x * 2 + 100}px`,
					height: `${ellipseRadii.y * 2 + 250}px`,
				}}
			>
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cloudmedium/50 rounded-[50%]"
					style={{
						width: `${ellipseRadii.x * 2}px`,
						height: `${ellipseRadii.y * 2}px`,
					}}
				></div>

				{orbitingIconsData.map((iconData) => (
					<OrbitingIcon
						key={iconData.id}
						iconData={iconData}
						ellipseRadii={ellipseRadii}
						isPaused={isPaused}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						hoveredIconId={hoveredIconId}
					/>
				))}
			</div>
		</div>
	);
}
