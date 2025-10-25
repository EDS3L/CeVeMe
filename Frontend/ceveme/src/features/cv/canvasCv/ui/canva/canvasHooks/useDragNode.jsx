import { useRef, useState, useCallback } from 'react';
import { mmRound } from '../../../utils/mmRound';
import { computeSmartGuides } from '../../../hooks/useSmartGuides';
import { A4 } from '../../../core/mm';

export default function useDragNode(
	doc,
	pxPerMm,
	scale,
	updateNode,
	pageHeightForGuidesMm
) {
	const dragRef = useRef(null);
	const dragTempRef = useRef({});
	const [dragPreview, setDragPreview] = useState({});
	const [guides, setGuides] = useState([]);

	const onMouseMoveDrag = useCallback(
		(e) => {
			const s = dragRef.current;
			if (!s) return;

			const dxMm = (e.clientX - s.mx) / (pxPerMm * scale);
			const dyMm = (e.clientY - s.my) / (pxPerMm * scale);

			const node = s.nodeRef();
			if (!node) return;

			const candidate = {
				...node,
				frame: {
					x: s.startX + dxMm,
					y: s.startY + dyMm,
					w: node.frame.w,
					h: node.frame.h,
					rotation: node.frame.rotation || 0,
				},
			};

			const { guides, snapOffset } = computeSmartGuides(
				candidate,
				s.allNodes(),
				{
					pageWidthMm: A4.widthMm,
					pageHeightMm: pageHeightForGuidesMm,
				}
			);

			setGuides(guides);

			const nx = mmRound(candidate.frame.x + (snapOffset.x || 0));
			const ny = mmRound(candidate.frame.y + (snapOffset.y || 0));

			dragTempRef.current = { x: nx, y: ny };
			setDragPreview({ [s.id]: { x: nx, y: ny } });
		},
		[pxPerMm, scale, pageHeightForGuidesMm]
	);

	const onMouseUpDrag = useCallback(() => {
		const s = dragRef.current;
		if (s && dragTempRef.current) {
			const node = s.nodeRef();
			if (node) {
				updateNode(s.id, {
					frame: {
						...node.frame,
						x: dragTempRef.current.x ?? node.frame.x,
						y: dragTempRef.current.y ?? node.frame.y,
					},
				});
			}
		}
		dragRef.current = null;
		dragTempRef.current = {};
		setDragPreview({});
		setGuides([]);
		window.removeEventListener('mousemove', onMouseMoveDrag);
		window.removeEventListener('mouseup', onMouseUpDrag);
	}, [updateNode, onMouseMoveDrag]);

	const startDrag = useCallback(
		(e, node, setSelectedId) => {
			e.stopPropagation();
			setSelectedId(node.id);

			dragRef.current = {
				id: node.id,
				mx: e.clientX,
				my: e.clientY,
				startX: node.frame.x, // globalna pozycja X
				startY: node.frame.y, // globalna pozycja Y
				nodeRef: () => doc.nodes.find((n) => n.id === node.id),
				allNodes: () => doc.nodes,
			};

			dragTempRef.current = { x: node.frame.x, y: node.frame.y };

			window.addEventListener('mousemove', onMouseMoveDrag);
			window.addEventListener('mouseup', onMouseUpDrag, { once: true });
		},
		[doc, onMouseMoveDrag, onMouseUpDrag]
	);

	return { dragPreview, guides, startDrag, onMouseMoveDrag, onMouseUpDrag };
}
