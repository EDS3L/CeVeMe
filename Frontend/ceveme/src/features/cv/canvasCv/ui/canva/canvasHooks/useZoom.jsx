import { useState, useEffect, useRef } from 'react';

export default function useZoom(
	wrapperRef,
	min = 0.5,
	max = 2,
	step = 0.1,
	smooth = 0.2
) {
	const [zoom, setZoom] = useState(1);
	const targetZoomRef = useRef(zoom);
	const animRef = useRef(null);

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const updateZoom = () => {
			setZoom((prev) => {
				const diff = targetZoomRef.current - prev;
				if (Math.abs(diff) < 0.001) return targetZoomRef.current;
				return prev + diff * smooth;
			});
			animRef.current = requestAnimationFrame(updateZoom);
		};

		animRef.current = requestAnimationFrame(updateZoom);

		return () => cancelAnimationFrame(animRef.current);
	}, [smooth, wrapperRef]);

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const handleWheel = (e) => {
			if (!e.ctrlKey) return;
			e.preventDefault();

			const rect = el.getBoundingClientRect();
			const cx = e.clientX - rect.left;
			const cy = e.clientY - rect.top;

			const currentZoom = targetZoomRef.current;
			let newZoom = currentZoom - Math.sign(e.deltaY) * step;
			newZoom = Math.max(min, Math.min(max, newZoom));

			const ratio = newZoom / currentZoom;

			el.scrollLeft = (el.scrollLeft + cx) * ratio - cx;
			el.scrollTop = (el.scrollTop + cy) * ratio - cy;

			targetZoomRef.current = newZoom;
		};

		el.addEventListener('wheel', handleWheel, { passive: false });
		return () => el.removeEventListener('wheel', handleWheel);
	}, [min, max, step, wrapperRef]);

	return [
		zoom,
		(value) => (targetZoomRef.current = Math.max(min, Math.min(max, value))),
	];
}
