import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	X,
	Building2,
	MapPin,
	Bookmark,
	Briefcase,
	Clock,
	ClockFading,
	ScrollText,
} from 'lucide-react';
import Modal from '../ui/Modal';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export default function JobModal({ open, onClose, job }) {
	const nav = useNavigate();
	if (!open || !job) return null;

	const formatDate = (d) => (d ? new Date(d).toLocaleDateString('pl-PL') : '—');

	const renderHtml = (html, wordLimit = null) => {
		const cleanHtml = sanitizeHtml(html || '');
		if (!cleanHtml) return { __html: '<p>Brak danych.</p>' };

		if (!wordLimit) return { __html: cleanHtml };

		const parser = new DOMParser();
		const doc = parser.parseFromString(cleanHtml, 'text/html');
		let wordCount = 0;

		const truncateNode = (node) => {
			if (wordCount >= wordLimit) {
				node.remove();
				return;
			}
			if (node.nodeType === Node.TEXT_NODE) {
				const words = node.textContent.split(/\s+/);
				if (wordCount + words.length > wordLimit) {
					node.textContent =
						words.slice(0, wordLimit - wordCount).join(' ') + '...';
					wordCount = wordLimit;
				} else {
					wordCount += words.length;
				}
			} else {
				Array.from(node.childNodes).forEach(truncateNode);
			}
		};

		Array.from(doc.body.childNodes).forEach(truncateNode);
		return { __html: doc.body.innerHTML };
	};

	const jobTags = [
		job.experienceLevel
			? job.experienceLevel.charAt(0).toUpperCase() +
			  job.experienceLevel.slice(1)
			: '',
		job.employmentType
			? job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)
			: '',
	].filter(Boolean);

	return (
		<Modal
			open={open}
			onClose={onClose}
			modalCss='max-w-6xl overflow-hidden rounded-xl'
			backdropClassName='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4'
		>
			{/* Close button */}
			<button
				onClick={onClose}
				className='absolute cursor-pointer right-4 top-4 p-2 rounded-full text-gray-500 bg-white hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 shadow-md'
				aria-label='Zamknij szczegóły'
			>
				<X className='w-6 h-6' />
			</button>

			<div className='p-6 md:p-10 max-h-[90vh] overflow-y-auto'>
				<div className='max-w-4xl mx-auto'>
					<div className='space-y-8'>
						{/* HEADER */}
						<header className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6'>
							<div className='flex flex-col gap-2'>
								<h3 className='text-3xl font-bold text-gray-900'>
									{job.title}
								</h3>
								<div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-lg'>
									<span className='inline-flex items-center gap-1.5 font-medium'>
										<Building2 className='w-5 h-5 text-baseblack' />
										{job.company || '—'}
									</span>
									<span className='inline-flex items-center gap-1.5 font-medium'>
										<MapPin className='w-5 h-5 text-baseblack' />
										{job.location?.city
											? job.location.city +
											  (job.location?.street ? `, ${job.location.street}` : '')
											: 'Lokalizacja zdalna'}
									</span>

									{job.salary && (
										<span className='inline-flex items-center gap-1.5 font-medium'>
											<Briefcase className='w-5 h-5 text-baseblack' />
											<span className='font-bold'>{job.salary}</span>
										</span>
									)}
								</div>
								<div className=' flex flex-wrap gap-2'>
									{jobTags.map((tag, index) => (
										<span
											key={index}
											className='px-3 py-1 text-sm font-medium bg-kraft text-basewhite rounded-full shadow-sm'
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							<div className='flex-shrink-0 flex items-center gap-2 mt-4 mr-4 sm:mt-0 self-start sm:self-auto'>
								<a
									href={job.link}
									target='_blank'
									rel='noopener noreferrer'
									className='px-6 py-3 text-base font-semibold text-basewhite bg-bookcloth rounded-lg hover:opacity-90 transition-colors focus:outline-none focus:ring-4 focus:ring-manilla shadow-lg hover:shadow-xl'
								>
									Zobacz ofertę
								</a>
								<button
									aria-label='Zapisz'
									className='p-3 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm'
								>
									<Bookmark className='w-5 h-5' />
								</button>
							</div>
						</header>

						{/* SECTIONS */}
						<div className='space-y-8'>
							<JobSummarySection
								dateAdded={formatDate(job.dateAdded)}
								dateEnding={formatDate(job.dateEnding)}
							/>

							<JobSection
								title='Opis stanowiska'
								htmlContent={renderHtml(job.responsibilities, 35)}
							/>
							<JobSection
								title='Wymagania'
								htmlContent={renderHtml(job.requirements, 35)}
							/>
							{job.niceToHave && (
								<JobSection
									title='Mile widziane'
									htmlContent={renderHtml(job.niceToHave, 15)}
								/>
							)}
							{job.benefits && (
								<JobSection
									title='Benefity'
									htmlContent={renderHtml(job.benefits, 15)}
								/>
							)}

							<aside className='mt-4'>
								<button
									className='w-full cursor-pointer inline-flex font-bold items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-linear-to-r from-bookcloth  to-manilla hover:via-kraft hover:to-kraft'
									onClick={() => nav('/cv', { state: { offerLink: job.link } })}
								>
									Wygeneruj CV <ScrollText className='w-4 h-4' />
								</button>
							</aside>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}

function JobSummarySection({ dateAdded, dateEnding }) {
	const Card = ({ icon, label, value }) => (
		<div className='flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-200 shadow-md'>
			<div className='p-3 bg-blue-50 rounded-full text-black shadow-inner'>
				{React.createElement(icon, { className: 'w-6 h-6' })}
			</div>
			<div>
				<p className='text-sm text-gray-500 font-medium'>{label}</p>
				<p className='text-lg font-bold text-gray-800'>{value}</p>
			</div>
		</div>
	);

	return (
		<section>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
				<Card icon={Clock} label='Data dodania' value={dateAdded} />
				<Card icon={ClockFading} label='Ważna do' value={dateEnding} />
			</div>
		</section>
	);
}

function JobSection({ title, htmlContent }) {
	if (!htmlContent || htmlContent.__html === '') return null;
	return (
		<section>
			<h4 className='text-xl font-semibold text-gray-900 mb-3 border-b pb-2'>
				{title}
			</h4>
			<div
				className=' text-gray-700 leading-relaxed'
				dangerouslySetInnerHTML={htmlContent}
			/>
		</section>
	);
}
