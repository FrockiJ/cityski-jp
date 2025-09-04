import React from 'react';

import { CourseType } from './types';

interface CourseCardProps {
	course: CourseType;
}

export function CourseCard({ course }: CourseCardProps) {
	return (
		<article className='box-border overflow-hidden p-0 m-0 rounded-2xl border border-solid border-zinc-300'>
			<div className='box-border p-0 m-0 h-[180px]'>
				<img src={course.image} className='box-border object-cover p-0 m-0 size-full' alt={`${course.title} course`} />
			</div>
			<div className='box-border px-4 pt-3 pb-4 m-0'>
				<div className='box-border p-1.5 m-0 mb-1 text-sm text-cyan-600 bg-sky-100 rounded w-fit'>{course.type}</div>
				<h3 className='box-border p-0 mx-0 mt-1 mb-2 h-12 text-base text-zinc-800'>{course.title}</h3>
				<div className='box-border flex gap-0.5 items-center p-0 m-0'>
					<span className='box-border p-0 m-0 text-sm font-semibold text-zinc-800'>
						${course.price.toLocaleString()}
					</span>
					<span className='box-border p-0 m-0 text-sm text-zinc-800'>起</span>
				</div>
			</div>
		</article>
	);
}
