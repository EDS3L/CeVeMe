import React, { useState, useEffect } from "react";

export default function OrbitCard({ description }) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<div
			className={`max-w-sm bg-slatemedium rounded-xl shadow-lg p-4
        transition-all duration-300 ease-out transform
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
		>
			<p className="text-cloudmedium text-sm leading-relaxed whitespace-normal break-words">
				{description}
			</p>
		</div>
	);
}
