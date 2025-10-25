import { useRef, useCallback, useState } from 'react';
import { mmRound } from '../../../utils/mmRound';

export default function useResizeNode(
	pxPerMm,
	scale,
	updateNode,
	setLayoutFrozen
) {
	const resizeRef = useRef(null);
	const resizeTempRef = useRef({});
	const [resizePreview, setResizePreview] = useState({});

	const onMouseMoveResize = useCallback(
		(e) => {
			const r = resizeRef.current;
			if (!r) return;

			const dxMm = (e.clientX - r.mx) / (pxPerMm * scale);
			const dyMm = (e.clientY - r.my) / (pxPerMm * scale);
			let { x, y, w, h } = r.frame;

			switch (r.dir) {
				case 'e':
					w = Math.max(5, r.frame.w + dxMm);
					break;
				case 's':
					h = Math.max(5, r.frame.h + dyMm);
					break;
				case 'se':
					w = Math.max(5, r.frame.w + dxMm);
					h = Math.max(5, r.frame.h + dyMm);
					break;
				case 'w':
					x = r.frame.x + dxMm;
					w = Math.max(5, r.frame.w - dxMm);
					break;
				case 'n':
					y = r.frame.y + dyMm;
					h = Math.max(5, r.frame.h - dyMm);
					break;
				case 'nw':
					x = r.frame.x + dxMm;
					y = r.frame.y + dyMm;
					w = Math.max(5, r.frame.w - dxMm);
					h = Math.max(5, r.frame.h - dyMm);
					break;
				case 'ne':
					y = r.frame.y + dyMm;
					w = Math.max(5, r.frame.w + dxMm);
					h = Math.max(5, r.frame.h - dyMm);
					break;
				case 'sw':
					x = r.frame.x + dxMm;
					w = Math.max(5, r.frame.w - dxMm);
					h = Math.max(5, r.frame.h + dyMm);
					break;
				default:
					break;
			}

			// zapisujemy tymczasowy stan do ref i stanu podglądu
			const preview = {
				x: mmRound(x),
				y: mmRound(y),
				w: mmRound(w),
				h: mmRound(h),
			};
			resizeTempRef.current = preview;
			setResizePreview({ [r.id]: preview });
		},
		[pxPerMm, scale]
	);

	const onMouseUpResize = useCallback(() => {
		const r = resizeRef.current;
		if (!r) return;

		// ostateczne zatwierdzenie
		updateNode(r.id, { frame: resizeTempRef.current });

		resizeRef.current = null;
		resizeTempRef.current = {};
		setResizePreview({});
		window.removeEventListener('mousemove', onMouseMoveResize);
		setLayoutFrozen(false);
	}, [updateNode, onMouseMoveResize, setLayoutFrozen]);

	const startResize = useCallback(
		(e, dir, node) => {
			e.stopPropagation();
			setLayoutFrozen(true);
			resizeRef.current = {
				id: node.id,
				dir,
				mx: e.clientX,
				my: e.clientY,
				frame: { ...node.frame },
			};
			resizeTempRef.current = { ...node.frame };
			window.addEventListener('mousemove', onMouseMoveResize);
			window.addEventListener('mouseup', onMouseUpResize, { once: true });
		},
		[onMouseMoveResize, onMouseUpResize, setLayoutFrozen]
	);

	return { startResize, resizePreview };
}
