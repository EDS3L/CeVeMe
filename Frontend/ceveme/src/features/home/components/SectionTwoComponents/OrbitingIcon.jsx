import React, { useState, useEffect, useRef } from "react";
import OrbitCard from "./OrbitCard";

export default function OrbitingIcon({
	iconData,
	ellipseRadii,
	isPaused,
	onMouseEnter,
	onMouseLeave,
	hoveredIconId,
}) {
	const [angle, setAngle] = useState(iconData.initialAngle);
	const animationFrameId = useRef();
	const loopSpeed = 0.05;

	// Animation effect for orbiting motion
	useEffect(() => {
		if (!isPaused) {
			const animate = () => {
				setAngle((prevAngle) => (prevAngle + loopSpeed) % 360);
				animationFrameId.current = requestAnimationFrame(animate);
			};
			animationFrameId.current = requestAnimationFrame(animate);
		}
		// Cleanup animation frame on component unmount or pause
		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [isPaused]);

	// Calculate position based on ellipse radii and angle
	const x = ellipseRadii.x * Math.cos((angle * Math.PI) / 180);
	const y = ellipseRadii.y * Math.sin((angle * Math.PI) / 180);

	return (
		<div
			className="absolute flex flex-col items-center justify-center transition-transform duration-100 ease-linear group"
			style={{
				top: "50%",
				left: "50%",
				transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
			}}
			onMouseEnter={() => onMouseEnter(iconData.id)}
			onMouseLeave={onMouseLeave}
		>
			<div
				className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white rounded-full relative z-10"
				style={{ boxShadow: `0 0 20px 5px ${iconData.color}` }}
			>
				<span
					className="text-2xl md:text-3xl font-bold"
					style={{ color: iconData.letterColor }}
				>
					{iconData.letter}
				</span>
			</div>

			{/* Render OrbitCard when icon is hovered */}
			{hoveredIconId === iconData.id && (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-full z-[100]">
					<OrbitCard
						title={`Litera ${iconData.letter}`}
						description={`Szczegóły dla litery ${iconData.letter}.`}
					/>
				</div>
			)}
		</div>
	);
}
