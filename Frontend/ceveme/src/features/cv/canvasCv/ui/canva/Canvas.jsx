import React, { useRef, useMemo, useEffect, useState } from 'react';
import useCanvasScale from '../../hooks/useCanvasScale';
import { A4 } from '../../core/mm';
import NodeView from './NodeView';
import Handles from './Handles';
import GridOverlay from './GridOverlay';
import SmartGuidesSVG from './SmartGuidesSVG';
import { maxContentYMm } from '../../utils/overflow';

import useDragNode from './canvasHooks/useDragNode';
import useResizeNode from './canvasHooks/useResizeNode';
import useZoom from './canvasHooks/useZoom';

export default function Canvas({
	doc,
	selectedId,
	setSelectedId,
	updateNode,
	pageRef,
	showGrid = false,
	onMetricsChange = () => {},
}) {
	const wrapperRef = useRef(null);
	const { scale, pxPerMm } = useCanvasScale(A4, wrapperRef, { min: 1, max: 5 });
	const [viewZoom] = useZoom(wrapperRef, 0.5, 2, 0.1);

	const [layoutFrozen, setLayoutFrozen] = useState(false);
	const liveContentMaxY = useMemo(
		() => maxContentYMm(doc) || A4.heightMm,
		[doc]
	);
	const frozenState = useMemo(
		() => ({
			contentMaxY: liveContentMaxY,
		}),
		[liveContentMaxY]
	);
	const contentMaxY = layoutFrozen ? frozenState.contentMaxY : liveContentMaxY;

	// --- Drag & Resize ---
	const { dragPreview, guides, startDrag } = useDragNode(
		doc,
		pxPerMm,
		scale,
		updateNode,
		contentMaxY
	);
	const { resizePreview, startResize } = useResizeNode(
		pxPerMm,
		scale,
		updateNode,
		setLayoutFrozen
	);

	const selectedNode = doc?.nodes?.find((n) => n.id === selectedId) || null;

	const pageCount = Math.max(1, Math.ceil(contentMaxY / A4.heightMm));
	const pages = Array.from({ length: pageCount }, (_, i) => i);

	// --- Helper do CSS w mm ---
	const mmPageStyle = (hMm) => ({
		width: `${A4.widthMm}mm`,
		height: `${hMm}mm`,
		position: 'relative',
		background: 'white',
		boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
		borderRadius: '4px',
		overflow: 'hidden',
	});

	const onChangeText = (id, text) => updateNode(id, { text });

	useEffect(() => {
		onMetricsChange({ scale, pxPerMm });
	}, [scale, pxPerMm, onMetricsChange]);

	return (
		<div
			ref={wrapperRef}
			className='w-full h-full overflow-auto bg-slate-50 flex justify-center items-start'
			onMouseDown={() => setSelectedId(null)}
		>
			{/* Skalowany wrapper zoomem */}
			<div
				style={{
					transform: `scale(${viewZoom})`,
					transformOrigin: 'top center',
				}}
			>
				{/* Dokument globalny */}
				<div
					style={{
						position: 'relative',
						width: `${A4.widthMm}mm`,
						height: `${contentMaxY}mm`,
					}}
				>
					{/* Strony */}
					{pages.map((pageIndex) => (
						<div
							key={`page-${pageIndex}`}
							className='absolute left-0'
							style={{
								top: `${pageIndex * A4.heightMm}mm`,
								width: `${A4.widthMm}mm`,
								height: `${A4.heightMm}mm`,
							}}
						>
							<div
								ref={pageIndex === 0 ? pageRef : null}
								className='relative w-full h-full'
								style={mmPageStyle(A4.heightMm)}
							>
								{showGrid && <GridOverlay show />}
							</div>
						</div>
					))}

					{/* Node’y */}
					{doc.nodes.map((node) => {
						const displayFrame =
							resizePreview[node.id] || dragPreview[node.id] || node.frame;
						return (
							<NodeView
								key={node.id}
								node={{
									...node,
									frame: {
										x: displayFrame.x,
										y: displayFrame.y,
										w: displayFrame.w,
										h: displayFrame.h,
										rotation: displayFrame.rotation || 0,
									},
								}}
								pxPerMm={pxPerMm}
								selected={selectedId === node.id}
								onMouseDownNode={(e) => startDrag(e, node, setSelectedId)}
								onChangeText={onChangeText}
							/>
						);
					})}

					{/* SmartGuides */}
					<SmartGuidesSVG
						guides={guides}
						pxPerMm={pxPerMm}
						pageWidthMm={A4.widthMm}
						pageHeightMm={contentMaxY}
					/>

					{/* Handles */}
					{selectedNode && !selectedNode.lock && (
						<Handles
							framePx={{
								x:
									(resizePreview[selectedNode.id]?.x ||
										dragPreview[selectedNode.id]?.x ||
										selectedNode.frame.x) * pxPerMm,
								y:
									(resizePreview[selectedNode.id]?.y ||
										dragPreview[selectedNode.id]?.y ||
										selectedNode.frame.y) * pxPerMm,
								w:
									(resizePreview[selectedNode.id]?.w || selectedNode.frame.w) *
									pxPerMm,
								h:
									(resizePreview[selectedNode.id]?.h || selectedNode.frame.h) *
									pxPerMm,
							}}
							rotation={selectedNode.frame.rotation || 0}
							onStartResize={(e, dir) => startResize(e, dir, selectedNode)}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
