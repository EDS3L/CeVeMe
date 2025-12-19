import React from 'react';
import Card from '../ui/Card';
import {
	Building2,
	MapPin,
	Briefcase,
	Calendar,
	ArrowUpRight,
} from 'lucide-react';

export default function JobCard({ job, onOpen }) {
	return (
		<Card
			role='button'
			tabIndex={0}
			onClick={() => onOpen(job)}
			onKeyDown={(e) => (e.key === 'Enter' ? onOpen(job) : null)}
			className='group relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-feedbackfocus hover:shadow-xl transition'
		>
			<div className='absolute inset-0 bg-gradient-to-r from-bookcloth to-kraft opacity-0 group-hover:opacity-[0.06] transition' />
			<div className='p-5'>
				<div className='flex items-start justify-between gap-3'>
					<div>
						<h3 className='text-lg font-semibold text-slatedark group-hover:underline underline-offset-4 decoration-bookcloth/50'>
							{job.title}
						</h3>
						<div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-clouddark'>
							<span className='inline-flex items-center gap-1'>
								<Building2 className='w-4 h-4' /> {job.company || '—'}
							</span>
							<span className='inline-flex items-center gap-1'>
								<MapPin className='w-4 h-4' /> {job.location?.city || '—'}
							</span>
							{job.employmentType && (
								<span className='inline-flex items-center gap-1'>
									<Briefcase className='w-4 h-4' /> {job.employmentType}
								</span>
							)}
						</div>
					</div>
					<a
						href={job.link}
						onClick={(e) => e.stopPropagation()}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-basewhite bg-gradient-to-r from-bookcloth to-kraft hover:to-manilla'
					>
						Zobacz <ArrowUpRight className='w-4 h-4' />
					</a>
				</div>

				<div className='mt-3 flex flex-wrap items-center gap-2'>
					{job.salary && (
						<span className='inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-bookcloth/10 text-slatedark border border-bookcloth/30'>
							{job.salary}
						</span>
					)}
					{job.experienceLevel && (
						<span className='inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-kraft/10 text-slatedark border border-kraft/30'>
							{job.experienceLevel}
						</span>
					)}
					{job.requirements && (
						<span className='inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-manilla/10 text-slatedark border border-manilla/30 truncate max-w-[60%]'>
							{job.requirements}
						</span>
					)}
				</div>

				<div className='mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-clouddark'>
					{job.dateAdded && (
						<span className='inline-flex items-center gap-1'>
							<Calendar className='w-4 h-4' /> Dodano:{' '}
							{new Date(job.dateAdded).toLocaleDateString()}
						</span>
					)}
					{job.dateEnding && (
						<span className='inline-flex items-center gap-1'>
							<Calendar className='w-4 h-4' /> Do:{' '}
							{new Date(job.dateEnding).toLocaleDateString()}
						</span>
					)}
				</div>
			</div>
		</Card>
	);
}
