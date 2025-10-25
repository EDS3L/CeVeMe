import { useEffect } from 'react';

export default function Modal({
	open,
	onClose,
	children,
	widthClass = 'w-[min(94vw,1000px)]',
}) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === 'Escape' && onClose();
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	useEffect(() => {
		if (open) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	if (!open) return null;

	const handleWrapperClick = (e) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-20 bg-slatedark/70'
			onClick={handleWrapperClick}
		>
			<div
				className={`relative ${widthClass} bg-ivorylight rounded-2xl border border-basewhite/50 shadow-2xl overflow-hidden`}
			>
				{children}
			</div>
		</div>
	);
}
