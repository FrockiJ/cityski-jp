'use client';
import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { AlignLeftIcon } from 'lucide-react';

import { CourseCard } from './CourseCard';
import { CourseType } from './types';

export function CourseGrid() {
	const courses: CourseType[] = [
		{
			id: 1,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f9284527c26e4424669a57022823cbf7a0f846ed',
			type: '私人班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
		{
			id: 2,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e57ae6a6b782a0ed01f83b4223248d65330e1d65',
			type: '團體班',
			title: '苗場神樂2025冬日海外教學',
			price: 57500,
		},
		{
			id: 3,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f9284527c26e4424669a57022823cbf7a0f846ed',
			type: '私人班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
		{
			id: 4,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9deb01eadbd31d847623e18500fbb35fe506caf3',
			type: '團體班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
		{
			id: 5,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f9cd1ec534acad40ba93c78cb3e84100debfe7c2',
			type: '私人班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
		{
			id: 6,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9ec3e8bd56524bd7321fb10623cabbd7813e8595',
			type: '團體班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
		{
			id: 7,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/8805c918379837c8883edc3fbe9ab25a598a7f3a',
			type: '團體班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
		{
			id: 8,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6c2a6b79b8389b497670fced86c748c79ec1c58b',
			type: '私人班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
		{
			id: 9,
			image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/736f9486a9925ee34445de0e4310b47c03c9036e',
			type: '團體班',
			title: '輕井澤2025冬日海外教學',
			price: 57500,
		},
	];

	return (
		<div className='box-border flex-1 p-0 m-0'>
			<div className='box-border flex justify-between items-center p-0 m-0 mb-4'>
				<div className='box-border flex gap-0.5 items-center p-0 m-0 text-lg text-zinc-800'>
					<span className='box-border p-0 m-0'>36</span>
					<span className='box-border p-0 m-0 text-base'>個課程</span>
				</div>
				<div className='box-border flex gap-1 items-center p-0 m-0 text-base text-zinc-800'>
					<div aria-hidden='true'>
						<AlignLeftIcon />
					</div>
					<button className='flex items-center gap-1' aria-label='排序方式'>
						<span className='box-border p-0 m-0'>最新上架</span>
						<div aria-hidden='true'>
							<ChevronDownIcon />
						</div>
					</button>
				</div>
			</div>
			<div className='box-border grid gap-4 p-0 m-0 grid-cols-[repeat(3,1fr)] max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]'>
				{courses.map((course) => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>
		</div>
	);
}
