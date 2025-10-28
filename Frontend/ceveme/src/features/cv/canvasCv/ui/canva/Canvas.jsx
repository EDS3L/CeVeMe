/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	useRef,
	useMemo,
	useEffect,
	useState,
	useCallback,
} from 'react';
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

const LAYER_Z = {
	page: 0,
	nodes: 10,
	groupOverlay: 950,
	guides: 1000,
	handles: 1100,
	marquee: 1200,
	loading: 2000,
};

function bboxOfFrames(frames) {
	if (!frames.length) return null;
	const xs = frames.map((f) => f.x);
	const ys = frames.map((f) => f.y);
	const xe = frames.map((f) => f.x + f.w);
	const ye = frames.map((f) => f.y + f.h);
	const x = Math.min(...xs);
	const y = Math.min(...ys);
	const w = Math.max(...xe) - x;
	const h = Math.max(...ye) - y;
	return { x, y, w, h, rotation: 0 };
}

/** anti-gap dla Y: jeżeli [y,y+h] przecina granicę strony, przesuń na górę lub dół (mniejszy ruch) */
function snapYAwayFromPageGaps(y, h, pageH) {
	if (h >= pageH - 0.1) return { y, applied: false };
	if (h <= 0) return { y, applied: false };
	const kStart = Math.floor((y + 1e-6) / pageH);
	const kEnd = Math.floor((y + h - 1e-6) / pageH);
	if (kStart === kEnd) return { y, applied: false };
	const k = kStart + 1;
	const boundary = k * pageH;
	const shiftUp = y + h - boundary;
	const shiftDown = boundary - y;
	if (Math.abs(shiftUp) <= Math.abs(shiftDown)) {
		return { y: y - shiftUp, applied: true };
	}
	return { y: y + shiftDown, applied: true };
}

const genId = () => 'n_' + Math.random().toString(36).slice(2, 10);

export default function Canvas({
	doc,
	selectedIds,
	setSelectedIds,
	activeGroupIds,
	setActiveGroupIds,
	setSelectedId,
	updateNode,
	removeNode,
	setDocument,
	pageRef,
	showGrid = false,
	onMetricsChange = () => {},
}) {
	const safeDoc = useMemo(() => {
		if (!doc || !Array.isArray(doc.nodes)) return { nodes: [] };
		return doc;
	}, [doc]);

	const nodes = safeDoc.nodes;

	const isGrouped = activeGroupIds?.length > 0;
	const groupSet = useMemo(
		() => new Set(isGrouped ? activeGroupIds : []),
		[isGrouped, activeGroupIds]
	);

	const groupNodes = useMemo(
		() => (isGrouped ? nodes.filter((n) => n && groupSet.has(n.id)) : []),
		[isGrouped, nodes, groupSet]
	);

	const wrapperRef = useRef(null);
	const contentRef = useRef(null);

	const { scale, pxPerMm } = useCanvasScale(A4, wrapperRef, { min: 1, max: 5 });
	const [viewZoom] = useZoom(wrapperRef, 0.5, 2, 0.1);

	const [layoutFrozen, setLayoutFrozen] = useState(false);
	const liveContentMaxY = useMemo(
		() => maxContentYMm(doc) || A4.heightMm,
		[doc]
	);
	const frozenState = useMemo(
		() => ({ contentMaxY: liveContentMaxY }),
		[liveContentMaxY]
	);
	const contentMaxY = layoutFrozen ? frozenState.contentMaxY : liveContentMaxY;

	const PAGE_GAP_MM = 8;
	const logicYToViewYmm = (yMm) =>
		yMm + Math.floor(yMm / A4.heightMm) * PAGE_GAP_MM;
	const mmToPxX = (mm) => mm * pxPerMm;
	const mmToPxY = (mm) => logicYToViewYmm(mm) * pxPerMm;
	const heightPxFromMmRect = useCallback(
		(yMm, hMm) => mmToPxY(yMm + hMm) - mmToPxY(yMm),
		[mmToPxY]
	);

	const pageCount = Math.max(1, Math.ceil(contentMaxY / A4.heightMm));
	const contentMaxYWithGaps = contentMaxY + (pageCount - 1) * PAGE_GAP_MM;
	const pages = Array.from({ length: pageCount }, (_, i) => i);

	// HOOKI: drag & resize
	const {
		dragPreview,
		guides: dragGuides,
		startDrag,
	} = useDragNode(
		doc,
		pxPerMm,
		scale,
		viewZoom,
		updateNode,
		contentMaxY,
		contentRef,
		PAGE_GAP_MM
	);
	const { resizePreview, startResize } = useResizeNode(
		pxPerMm,
		scale,
		viewZoom,
		updateNode,
		setLayoutFrozen,
		contentRef,
		PAGE_GAP_MM
	);

	// Wybierz co pokazać (drag ma pierwszeństwo, bo to „live”)
	const activeGuides = dragGuides;

	const displayFrameOf = useCallback(
		(n) => {
			if (!n) return null;
			return resizePreview[n.id] || dragPreview[n.id] || n.frame;
		},
		[dragPreview, resizePreview]
	);

	const groupBBox = useMemo(() => {
		if (!isGrouped) return null;
		const frames = groupNodes.map((n) => displayFrameOf(n)).filter(Boolean);
		return bboxOfFrames(frames);
	}, [isGrouped, groupNodes, displayFrameOf]);

	const toggleOrSingleSelect = (e, node) => {
		const isToggle = e.metaKey || e.ctrlKey || e.shiftKey;

		if (isToggle) {
			setSelectedIds((prev) => {
				const next = prev.includes(node.id)
					? prev.filter((id) => id !== node.id)
					: [...prev, node.id];

				setSelectedId && setSelectedId(node.id);
				setActiveGroupIds(next.length >= 2 ? next : null);
				return next;
			});
		} else {
			setSelectedIds([node.id]);
			setSelectedId && setSelectedId(node.id);
			setActiveGroupIds(null);
		}
	};

	const nodeInGroup = (id) => isGrouped && groupSet.has(id);

	const onMouseDownNode = (e, node) => {
		const isToggle = e.metaKey || e.ctrlKey || e.shiftKey;

		toggleOrSingleSelect(e, node);

		if (isToggle) {
			e.stopPropagation();
			return;
		}

		if (nodeInGroup(node.id)) {
			const frames = Object.fromEntries(
				groupNodes.map((n) => [n.id, { ...n.frame }])
			);
			const bbox = groupBBox || bboxOfFrames(groupNodes.map((n) => n.frame));
			startDrag(e, node, null, { ids: activeGroupIds, frames, bbox });
		} else {
			startDrag(e, node, () => {}, null);
		}
	};

	const onStartResize = (e, dir, selectedNode) => {
		if (isGrouped) {
			const frames = Object.fromEntries(
				groupNodes.map((n) => [n.id, { ...n.frame }])
			);
			const bbox = groupBBox || bboxOfFrames(groupNodes.map((n) => n.frame));
			startResize(e, dir, selectedNode, { ids: activeGroupIds, frames, bbox });
		} else {
			startResize(e, dir, selectedNode, null);
		}
	};

	const onChangeText = (id, text) => updateNode(id, { text });

	// Marquee
	const [marquee, setMarquee] = useState(null);
	const pageSpanMm = A4.heightMm + PAGE_GAP_MM;
	const clientToViewMm = (e) => {
		const el = contentRef?.current;
		if (!el) return { x: 0, y: 0 };
		const r = el.getBoundingClientRect();
		const xPx = e.clientX - r.left;
		const yPx = e.clientY - r.top;
		const denom = pxPerMm * scale * (viewZoom || 1);
		return { x: xPx / denom, y: yPx / denom };
	};
	const viewToLogicYmm = (yViewMm) => {
		const gapsBefore = Math.floor(yViewMm / pageSpanMm);
		return yViewMm - gapsBefore * PAGE_GAP_MM;
	};

	const onMouseDownBackground = (e) => {
		if (
			e.target !== contentRef.current &&
			contentRef.current &&
			!contentRef.current.contains(e.target)
		)
			return;

		const { x, y } = clientToViewMm(e);
		const yLogic = viewToLogicYmm(y);

		setSelectedIds([]);
		setSelectedId && setSelectedId(null);
		setActiveGroupIds(null);
		setMarquee({ x1: x, y1: yLogic, x2: x, y2: yLogic });

		const onMove = (me) => {
			const { x: mx, y: my } = clientToViewMm(me);
			setMarquee((prev) =>
				prev ? { ...prev, x2: mx, y2: viewToLogicYmm(my) } : null
			);
		};

		const onUp = () => {
			setMarquee((curr) => {
				if (curr) {
					const minx = Math.min(curr.x1, curr.x2);
					const maxx = Math.max(curr.x1, curr.x2);
					const miny = Math.min(curr.y1, curr.y2);
					const maxy = Math.max(curr.y1, curr.y2);

					const hit = nodes
						.filter((n) => {
							if (!n) return false;
							const f = n.frame;
							const nx1 = f.x,
								ny1 = f.y,
								nx2 = f.x + f.w,
								ny2 = f.y + f.h;
							return !(nx2 < minx || nx1 > maxx || ny2 < miny || ny1 > maxy);
						})
						.map((n) => n.id);

					setSelectedIds(hit);
					setSelectedId &&
						setSelectedId(hit.length ? hit[hit.length - 1] : null);
					setActiveGroupIds(hit.length >= 2 ? [...hit] : null);
				}
				return null;
			});

			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp, { once: true });
	};

	// Skróty grupowania
	useEffect(() => {
		const onKey = (e) => {
			const mod = e.metaKey || e.ctrlKey;
			if (!mod) return;
			if (e.key.toLowerCase() === 'g' && !e.shiftKey) {
				e.preventDefault();
				if (selectedIds.length >= 2) setActiveGroupIds([...selectedIds]);
			}
			if (e.key.toLowerCase() === 'g' && e.shiftKey) {
				e.preventDefault();
				setActiveGroupIds(null);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [selectedIds, setActiveGroupIds]);

	useEffect(() => {
		onMetricsChange({ scale, pxPerMm });
	}, [scale, pxPerMm, onMetricsChange]);

	// ====== COPY / PASTE / DELETE (global) ======
	const clipboardRef = useRef({ nodes: [], bump: 0 }); // bump – kolejny offset wklejenia
	const isEditable = (el) => {
		if (!el) return false;
		const tag = el.tagName?.toLowerCase();
		if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
		if (el.isContentEditable) return true;
		if (el.closest?.('[contenteditable="true"]')) return true;
		if (el.getAttribute?.('role') === 'textbox') return true;
		return false;
	};

	const getSelectionIds = () => {
		if (isGrouped) return [...activeGroupIds];
		if (selectedIds?.length)
			return [selectedIds[selectedIds.length - 1], ...selectedIds.slice(0, -1)];
		return [];
	};

	const handleGlobalKeys = useCallback(
		(e) => {
			const active = document.activeElement;
			if (isEditable(active)) return;

			const mod = e.metaKey || e.ctrlKey;

			// DELETE / BACKSPACE – usuń pojedynczy lub całą grupę
			if (e.key === 'Delete' || e.key === 'Backspace') {
				const ids = getSelectionIds();
				if (!ids.length) return;
				e.preventDefault();
				// usuń wszystkie zaznaczone
				for (const id of ids) removeNode(id);
				// wyczyść selekcję
				setSelectedIds([]);
				setActiveGroupIds(null);
				setSelectedId && setSelectedId(null);
				return;
			}

			// COPY
			if (mod && e.key.toLowerCase() === 'c') {
				const ids = getSelectionIds();
				if (!ids.length) return;
				e.preventDefault();
				const map = new Map(nodes.filter(Boolean).map((n) => [n.id, n]));
				const toCopy = ids
					.map((id) => map.get(id))
					.filter(Boolean)
					.map((n) => JSON.parse(JSON.stringify(n))); // deep-ish clone
				clipboardRef.current = { nodes: toCopy, bump: 0 };
				return;
			}

			// PASTE
			if (mod && e.key.toLowerCase() === 'v') {
				const clip = clipboardRef.current;
				if (!clip.nodes || clip.nodes.length === 0) return;
				e.preventDefault();

				const bump = (clip.bump || 0) + 1; // kolejne wklejenie = większy offset
				clipboardRef.current.bump = bump;

				const OFFSET_MM = 4 * bump;
				const newNodes = [];
				const newIds = [];

				const safeClone = (n) => {
					const id = genId();
					const frame = { ...n.frame };
					frame.x = (frame.x || 0) + OFFSET_MM;
					frame.y = (frame.y || 0) + OFFSET_MM;
					// anty-gap – każde wklejenie poprawiamy indywidualnie
					const fix = snapYAwayFromPageGaps(frame.y, frame.h, A4.heightMm);
					if (fix.applied) frame.y = fix.y;

					const cloned = {
						...n,
						id,
						frame,
					};
					return { id, node: cloned };
				};

				for (const n of clip.nodes) {
					const { id, node } = safeClone(n);
					newNodes.push(node);
					newIds.push(id);
				}

				// Zapis do dokumentu – dopisujemy na koniec (wyżej w z-index)
				setDocument((prev) => {
					const base = typeof prev === 'function' ? prev() : prev;
					return {
						...base,
						nodes: [...(base.nodes || []).filter(Boolean), ...newNodes],
					};
				});

				// Ustaw selekcję na właśnie wklejone (i grupa jeśli >1)
				setSelectedIds(newIds);
				setActiveGroupIds(newIds.length >= 2 ? [...newIds] : null);
				setSelectedId && setSelectedId(newIds[newIds.length - 1]);
				return;
			}
		},
		[
			nodes,
			isGrouped,
			selectedIds,
			activeGroupIds,
			removeNode,
			setDocument,
			setSelectedIds,
			setActiveGroupIds,
			setSelectedId,
		]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleGlobalKeys);
		return () => window.removeEventListener('keydown', handleGlobalKeys);
	}, [handleGlobalKeys]);

	const mmPageStyle = (hMm) => ({
		width: `${A4.widthMm}mm`,
		height: `${hMm}mm`,
		position: 'relative',
		background: 'white',
		boxShadow: `0 0 0 1px rgba(0,0,0,0.05)`,
		borderRadius: '4px',
		overflow: 'hidden',
		zIndex: LAYER_Z.page,
	});

	return (
		<div
			ref={wrapperRef}
			className='w-full h-full overflow-auto bg-slate-50 flex justify-center items-start'
		>
			<div
				style={{
					transform: `scale(${viewZoom})`,
					transformOrigin: 'top center',
				}}
			>
				<div
					ref={contentRef}
					onMouseDown={onMouseDownBackground}
					style={{
						position: 'relative',
						width: `${A4.widthMm}mm`,
						height: `${contentMaxYWithGaps}mm`,
					}}
				>
					{pages.map((pageIndex) => (
						<div
							key={`page-${pageIndex}`}
							className='absolute left-0'
							style={{
								top: `${pageIndex * (A4.heightMm + PAGE_GAP_MM)}mm`,
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

					{/* Nody */}
					{nodes.filter(Boolean).map((node) => {
						const df = displayFrameOf(node) || node.frame;
						if (!df) return null;
						return (
							<NodeView
								key={node.id}
								node={{ ...node, frame: { ...df, rotation: df.rotation || 0 } }}
								mmToPxX={mmToPxX}
								mmToPxY={mmToPxY}
								selected={selectedIds.includes(node.id)}
								onMouseDownNode={onMouseDownNode}
								onChangeText={onChangeText}
							/>
						);
					})}

					{/* Szara obwódka grupy + uchwyty */}
					{isGrouped && groupBBox && (
						<>
							<div
								onMouseDown={(e) => {
									e.stopPropagation();
									const any = nodes.find((n) => n && groupSet.has(n.id));
									const frames = Object.fromEntries(
										groupNodes.map((n) => [n.id, { ...n.frame }])
									);
									const bbox = groupBBox;
									startDrag(e, any, null, {
										ids: activeGroupIds,
										frames,
										bbox,
									});
								}}
								style={{
									position: 'absolute',
									left: mmToPxX(groupBBox.x),
									top: mmToPxY(groupBBox.y),
									width: mmToPxX(groupBBox.w),
									height: heightPxFromMmRect(groupBBox.y, groupBBox.h),
									cursor: 'move',
									background: 'transparent',
									border: '1px dashed rgba(100,116,139,.85)', // slate-500
									borderRadius: 2,
									zIndex: LAYER_Z.groupOverlay,
								}}
								title='Przeciągnij, aby przesunąć grupę'
							/>

							<Handles
								framePx={{
									x: mmToPxX(groupBBox.x),
									y: mmToPxY(groupBBox.y),
									w: mmToPxX(groupBBox.w),
									h: heightPxFromMmRect(groupBBox.y, groupBBox.h),
								}}
								rotation={0}
								onStartResize={(e, dir) => {
									const any = nodes.find((n) => n && groupSet.has(n.id));
									const frames = Object.fromEntries(
										groupNodes.map((n) => [n.id, { ...n.frame }])
									);
									const bbox = groupBBox;
									startResize(e, dir, any, {
										ids: activeGroupIds,
										frames,
										bbox,
									});
								}}
								zIndex={LAYER_Z.handles}
							/>
						</>
					)}

					{/* PROWADNICE */}
					{activeGuides && activeGuides.length > 0 && (
						<SmartGuidesSVG
							guides={activeGuides}
							pxPerMm={pxPerMm}
							pageWidthMm={A4.widthMm}
							pageHeightMm={contentMaxYWithGaps}
							yMapMm={logicYToViewYmm}
						/>
					)}

					{/* Uchwyty pojedynczego elementu */}
					{!isGrouped &&
						selectedIds.length === 1 &&
						(() => {
							const selectedNode = nodes.find(
								(n) => n && n.id === selectedIds[0]
							);
							if (!selectedNode || selectedNode.lock) return null;
							const df = displayFrameOf(selectedNode) || selectedNode.frame;
							return (
								<Handles
									framePx={{
										x: mmToPxX(df.x),
										y: mmToPxY(df.y),
										w: mmToPxX(df.w),
										h: heightPxFromMmRect(df.y, df.h),
									}}
									rotation={df.rotation || 0}
									onStartResize={(e, dir) =>
										onStartResize(e, dir, selectedNode)
									}
									zIndex={LAYER_Z.handles}
								/>
							);
						})()}

					{/* Marquee */}
					{marquee &&
						(() => {
							const x = Math.min(marquee.x1, marquee.x2);
							const y = Math.min(marquee.y1, marquee.y2);
							const w = Math.abs(marquee.x2 - marquee.x1);
							const h = Math.abs(marquee.y2 - marquee.y1);
							return (
								<div
									style={{
										position: 'absolute',
										left: mmToPxX(x),
										top: mmToPxY(y),
										width: mmToPxX(w),
										height: heightPxFromMmRect(y, h),
										border: '1px dashed rgba(37,99,235,.9)',
										background: 'rgba(59,130,246,.08)',
										pointerEvents: 'none',
										zIndex: LAYER_Z.marquee,
									}}
								/>
							);
						})()}
				</div>
			</div>
		</div>
	);
}
