import React from 'react';

function Icon({ name }) {
	const common = {
		width: 16,
		height: 16,
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 2,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
	};

	switch (name) {
		case 'eye':
			return (
				<svg {...common}>
					<path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z' />
					<circle cx='12' cy='12' r='3' />
				</svg>
			);
		case 'eye-off':
			return (
				<svg {...common}>
					<path d='M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.78 21.78 0 0 1 5.06-5.94' />
					<path d='M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.83 21.83 0 0 1-3.87 4.94' />
					<path d='M1 1l22 22' />
				</svg>
			);
		case 'lock':
			return (
				<svg {...common}>
					<rect x='4' y='11' width='16' height='10' rx='2' />
					<path d='M8 11V7a4 4 0 0 1 8 0v4' />
				</svg>
			);
		case 'unlock':
			return (
				<svg {...common}>
					<rect x='4' y='11' width='16' height='10' rx='2' />
					<path d='M12 7a4 4 0 0 1 8 0v1' />
				</svg>
			);
		case 'up':
			return (
				<svg {...common}>
					<polyline points='6 15 12 9 18 15' />
				</svg>
			);
		case 'down':
			return (
				<svg {...common}>
					<polyline points='6 9 12 15 18 9' />
				</svg>
			);
		case 'top':
			return (
				<svg {...common}>
					<polyline points='6 15 12 9 18 15' />
					<line x1='4' y1='5' x2='20' y2='5' />
				</svg>
			);
		case 'bottom':
			return (
				<svg {...common}>
					<polyline points='6 9 12 15 18 9' />
					<line x1='4' y1='19' x2='20' y2='19' />
				</svg>
			);
		default:
			return null;
	}
}

function IconButton({ title, className = '', onClick, children }) {
	return (
		<button
			type='button'
			title={title}
			aria-label={title}
			onClick={onClick}
			className={`inline-grid place-items-center w-7 h-7 rounded-lg border border-black/10 bg-white hover:bg-slate-50 active:translate-y-px ${className}`}
		>
			{children}
		</button>
	);
}

export default function LayersPanel({
	nodes = [], // ✅ Default value prevents crash
	selectedId,
	setSelectedId,
	reorder,
	updateNode,
}) {
	const safeNodes = Array.isArray(nodes) ? nodes : [];

	if (safeNodes.length === 0) {
		return (
			<div>
				<div className='font-bold mb-2'>Warstwy</div>
				<div className='text-sm text-slate-500 italic'>
					Brak warstw do wyświetlenia
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className='font-bold mb-2'>Warstwy</div>
			<ul className='flex flex-col gap-2 m-0 p-0 list-none'>
				{safeNodes
					.slice()
					.reverse()
					.map((node) => {
						const isSelected = node.id === selectedId;
						const name = (
							node.text?.split('\n')[0] ||
							node.src ||
							node.id ||
							''
						).trim();
						const visible = node.visible !== false;

						return (
							<li
								key={node.id}
								onClick={() => setSelectedId(node.id)}
								className={`grid grid-cols-[1fr_auto] gap-2 items-center min-w-0 p-2 rounded-xl border border-black/10 bg-white ${
									isSelected ? 'outline-2 outline-blue-200 bg-blue-50' : ''
								}`}
							>
								<div className='flex items-center gap-2 min-w-0'>
									<span className='text-xs text-slate-600 w-14 flex-none lowercase'>
										{node.type}
									</span>
									<span
										className='text-xs text-slate-900 truncate'
										title={name}
									>
										{name}
									</span>
								</div>

								<div
									className='flex items-center gap-1 flex-wrap justify-end'
									onClick={(e) => e.stopPropagation()}
								>
									<IconButton
										title={visible ? 'Ukryj' : 'Pokaż'}
										onClick={() => updateNode(node.id, { visible: !visible })}
									>
										<Icon name={visible ? 'eye' : 'eye-off'} />
									</IconButton>

									<IconButton
										title={node.lock ? 'Odblokuj' : 'Zablokuj'}
										onClick={() => updateNode(node.id, { lock: !node.lock })}
									>
										<Icon name={node.lock ? 'unlock' : 'lock'} />
									</IconButton>

									<IconButton
										title='W górę'
										onClick={() => reorder(node.id, 'forward')}
									>
										<Icon name='up' />
									</IconButton>

									<IconButton
										title='W dół'
										onClick={() => reorder(node.id, 'backward')}
									>
										<Icon name='down' />
									</IconButton>

									<IconButton
										title='Na wierzch'
										className='hidden sm:inline-grid'
										onClick={() => reorder(node.id, 'front')}
									>
										<Icon name='top' />
									</IconButton>

									<IconButton
										title='Na spód'
										className='hidden sm:inline-grid'
										onClick={() => reorder(node.id, 'back')}
									>
										<Icon name='bottom' />
									</IconButton>
								</div>
							</li>
						);
					})}
			</ul>
		</div>
	);
}
