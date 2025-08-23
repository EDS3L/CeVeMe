import React, { useState, useEffect, useRef } from "react";
import OrbitCard from "./OrbitCard";

export default function OrbitingIcon({
	iconData,
	ellipseRadii,
	isPaused,
	onMouseEnter,
	onMouseLeave,
	isOpen,
	onIconClick,
}) {
	const [angle, setAngle] = useState(iconData.initialAngle);
	const animationFrameId = useRef();
	const timeoutRef = useRef();
	const loopSpeed = 0.05;

	useEffect(() => {
		if (!isPaused) {
			const animate = () => {
				setAngle((prevAngle) => (prevAngle + loopSpeed) % 360);
				animationFrameId.current = requestAnimationFrame(animate);
			};
			animationFrameId.current = requestAnimationFrame(animate);
		}
		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [isPaused]);

	useEffect(() => {
		if (isOpen) {
			timeoutRef.current = setTimeout(() => {
				onIconClick(null);
			}, 4000);
		}
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isOpen, onIconClick]);

	const x = ellipseRadii.x * Math.cos((angle * Math.PI) / 180);
	const y = ellipseRadii.y * Math.sin((angle * Math.PI) / 180);

	// czy ikona jest w górnej części orbity
	const isOnTop = y < 0;

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
			{isOpen ? (
				<div
					className={`absolute left-1/2 z-[100] -translate-x-1/2 
      ${isOnTop ? "bottom-full mb-2" : "top-full -mt-2"}`}
				>
					<OrbitCard description={iconData.description} />
				</div>
			) : (
				<div
					className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white border-1 border-gray-400 rounded-full relative z-10 transition-scale duration-100 hover:shadow-xl/30 shadow-${iconData.color} hover:scale-125 hover:cursor-pointer`}
					onClick={() => onIconClick(iconData.id)}
				>
					<span
						className={`text-2xl md:text-3xl font-bold ${iconData.letterColor}`}
					>
						{iconData.letter}
					</span>
				</div>
			)}
		</div>
	);
}
