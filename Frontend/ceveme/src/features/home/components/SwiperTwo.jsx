import React, { useEffect, useState } from "react";

const items = [
	{ title: "Tytuł 1", description: "Opis 1" },
	{ title: "Tytuł 2", description: "Opis 2" },
	{ title: "Tytuł 3", description: "Opis 3" },
	{ title: "Tytuł 4", description: "Opis 4" },
	{ title: "Tytuł 5", description: "Opis 5" },
	{ title: "Tytuł 6", description: "Opis 6" },
];

const radius = 250;

const SwiperTwo = () => {
	const [angle, setAngle] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setAngle((prev) => prev + 60); // 360* / 6 elementów
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative w-full h-screen flex justify-center items-center bg-gray-100">
			<div className="relative w-[400px] h-[400px]">
				{items.map((item, i) => {
					// kąt z przesunięciem o 90*, liczba 90 jest istotna dal item angle oraz dla isActive
					const itemAngle = (i * 60 + angle + 90) % 360;
					const rad = (itemAngle * Math.PI) / 180;
					const x = radius * Math.cos(rad);
					const y = radius * Math.sin(rad);

					const isActive = itemAngle % 360 === 90;

					return (
						<div
							key={i}
							className={`absolute transition-all duration-500 ${
								isActive ? "z-10 scale-125" : "z-0 opacity-70"
							}`}
							style={{
								left: `calc(50% + ${x}px - 64px)`,
								top: `calc(50% + ${y}px - 64px)`,
							}}
						>
							<div className="w-32 h-32 bg-white rounded-full shadow-xl flex flex-col justify-center items-center text-center p-2">
								<p className="text-sm font-bold">{item.title}</p>
								<p className="text-xs text-gray-500">{item.description}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SwiperTwo;
