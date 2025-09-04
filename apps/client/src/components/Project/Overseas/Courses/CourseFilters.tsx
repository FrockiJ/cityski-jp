'use client';
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { UsersIcon } from 'lucide-react';

import { RegionFilter } from './RegionFilter';

export function CourseFilters() {
	return (
		<aside className='box-border p-0 m-0 w-80 max-md:w-full'>
			<h2 className='box-border p-0 m-0 mb-4 text-xl font-medium text-zinc-800'>海外教學</h2>
			<div className='box-border flex flex-col gap-3 p-0 m-0'>
				<button
					className='box-border px-6 py-4 m-0 rounded-xl border border-solid border-zinc-300 text-left w-full'
					aria-label='選擇日期'
				>
					<div className='box-border flex gap-2 items-center p-0 m-0'>
						<div aria-hidden='true'>
							<CalendarIcon />
						</div>
						<div className='box-border p-0 m-0 text-base text-zinc-800'>選擇日期</div>
					</div>
				</button>
				<button
					className='box-border px-6 py-4 m-0 rounded-xl border border-solid border-zinc-300 text-left w-full'
					aria-label='選擇人數'
				>
					<div className='box-border flex gap-2 items-center p-0 m-0'>
						<div aria-hidden='true'>
							<UsersIcon />
						</div>
						<div className='box-border p-0 m-0 text-base text-zinc-800'>選擇人數</div>
					</div>
				</button>
				<RegionFilter />
			</div>
		</aside>
	);
}
