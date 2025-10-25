import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ensureGoogleFontPreview } from './googleFontsLoader';

/**
 * FontSelect (JSX)
 * props:
 *  - options: [{label, family, stack}]
 *  - valueStack: string
 *  - weight: number
 *  - italic: boolean
 *  - onChange: (stack, optionObj) => void
 *  - sample?: string
 *  - className?: string
 */
export default function FontSelect({
	options = [],
	valueStack = '',
	weight = 400,
	italic = false,
	onChange,
	className = '',
	sample = 'Ważne Żółte Źdźbła 123',
}) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const btnRef = useRef(null);
	const listRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [pos, setPos] = useState({ top: 0, left: 0, width: 448 }); // 28rem

	const selected = useMemo(
		() => options.find((o) => o.stack === valueStack) || null,
		[options, valueStack]
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return options;
		return options.filter(
			(o) =>
				o.label.toLowerCase().includes(q) || o.family.toLowerCase().includes(q)
		);
	}, [options, query]);

	// Pozycjonowanie listy (portal + fixed)
	const updatePosition = () => {
		const el = btnRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const desiredWidth = Math.max(r.width, 448);
		const margin = 8;

		let left = Math.min(
			Math.max(margin, r.left),
			Math.max(margin, window.innerWidth - desiredWidth - margin)
		);

		// domyślnie pod przyciskiem
		let top = r.bottom + 6;

		// jeśli zabraknie miejsca na dole – przesuń wyżej
		const maxTop = window.innerHeight - margin - 40;
		if (top > maxTop) top = Math.max(margin, r.top - 6 - 320); // 320px zapasu

		setPos({ top, left, width: desiredWidth });
	};

	useEffect(() => {
		if (!open) return;
		updatePosition();
		const onScroll = () => updatePosition();
		const onResize = () => updatePosition();
		window.addEventListener('scroll', onScroll, true);
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('scroll', onScroll, true);
			window.removeEventListener('resize', onResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// Ładowanie subsetów podglądu po otwarciu
	useEffect(() => {
		if (!open) return;
		let cancelled = false;
		const chunkSize = 12;

		(async () => {
			for (let i = 0; i < filtered.length && !cancelled; i += chunkSize) {
				const slice = filtered.slice(i, i + chunkSize);
				await Promise.all(
					slice.map((opt) =>
						ensureGoogleFontPreview(opt.family, {
							weight,
							italic,
							text: `${opt.label} ${sample}`,
						})
					)
				);
				await new Promise((r) => setTimeout(r, 0));
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [open, filtered, weight, italic, sample]);

	useEffect(() => {
		if (open) {
			const idx = filtered.findIndex((f) => f.stack === valueStack);
			setActiveIndex(Math.max(0, idx));
		}
	}, [open, filtered, valueStack]);

	// Klik poza -> zamknij (działa mimo portalu)
	useEffect(() => {
		if (!open) return;
		const onDocClick = (e) => {
			const target = e.target;
			if (btnRef.current && btnRef.current.contains(target)) return;
			if (listRef.current && listRef.current.contains(target)) return;
			setOpen(false);
		};
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	}, [open]);

	const choose = (opt) => {
		onChange && onChange(opt.stack, opt);
		setOpen(false);
	};

	const onKeyDown = (e) => {
		if (!open) {
			if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				setOpen(true);
			}
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			setOpen(false);
			return;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveIndex((i) => Math.max(0, i - 1));
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			const opt = filtered[activeIndex];
			if (opt) choose(opt);
		}
	};

	return (
		<div className={`relative ${className}`} onKeyDown={onKeyDown}>
			{/* Przycisk */}
			<button
				type='button'
				ref={btnRef}
				className='w-64 flex items-center justify-between gap-2 px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:bg-slate-50 outline-none'
				onClick={() => setOpen((v) => !v)}
				aria-haspopup='listbox'
				aria-expanded={open}
				title='Czcionka'
			>
				<span
					className='truncate'
					style={{
						fontFamily: selected ? selected.stack : 'Inter, Arial, sans-serif',
					}}
				>
					{selected ? selected.label : '(system)'}
				</span>
				<svg width='16' height='16' viewBox='0 0 20 20' aria-hidden>
					<path d='M5 7l5 5 5-5H5z' />
				</svg>
			</button>

			{/* Lista jako PORTAL (zawsze nad wszystkim) */}
			{open &&
				createPortal(
					<div
						ref={listRef}
						role='listbox'
						tabIndex={-1}
						style={{
							position: 'fixed',
							top: pos.top,
							left: pos.left,
							width: pos.width,
							maxHeight: '80vh',
							overflow: 'auto',
							zIndex: 2147483647, // zawsze na wierzchu
							background: 'white',
							borderRadius: '0.75rem',
							boxShadow: '0 20px 45px rgba(0,0,0,.15)',
							border: '1px solid rgba(0,0,0,.1)',
						}}
					>
						<div className='sticky top-0 bg-white border-b border-black/10 p-2'>
							<input
								className='w-full px-2 py-2 rounded-lg border border-black/15 text-sm outline-none focus:ring-2 focus:ring-blue-500/30'
								placeholder='Szukaj czcionki…'
								autoFocus
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
						</div>

						{filtered.map((opt, idx) => {
							const isActive = idx === activeIndex;
							const isSelected = opt.stack === valueStack;
							return (
								<button
									key={opt.label}
									type='button'
									onMouseEnter={() => setActiveIndex(idx)}
									onClick={() => choose(opt)}
									className={`w-full text-left px-3 py-2 border-b border-black/5 hover:bg-slate-50 ${
										isActive ? 'bg-slate-50' : ''
									} ${isSelected ? 'ring-1 ring-blue-500/30' : ''}`}
									role='option'
									aria-selected={isSelected}
									title={opt.label}
								>
									<div className='flex items-center justify-between gap-3'>
										<div
											className='truncate text-base'
											style={{
												fontFamily: opt.stack,
												fontWeight: weight || 400,
												fontStyle: italic ? 'italic' : 'normal',
											}}
										>
											{sample}
										</div>
										<div className='shrink-0 text-xs text-slate-500'>
											{opt.label}
										</div>
									</div>
								</button>
							);
						})}
						{filtered.length === 0 && (
							<div className='p-4 text-sm text-slate-500'>Brak wyników…</div>
						)}
					</div>,
					document.body
				)}
		</div>
	);
}
