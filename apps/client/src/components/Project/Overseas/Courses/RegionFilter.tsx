'use client';
import React from 'react';
import { MapPinIcon } from 'lucide-react';

export function RegionFilter() {
	return (
		<div className='box-border p-6 m-0 rounded-xl border border-solid border-zinc-300'>
			<div className='box-border flex gap-2 items-center p-0 m-0 mb-4'>
				<div aria-hidden='true'>
					<MapPinIcon />
				</div>
				<div className='box-border p-0 m-0 text-base text-zinc-800'>地區與滑雪場</div>
			</div>
			<div className='box-border flex flex-col gap-4 p-0 m-0'>
				<RegionCheckbox label='北海道地區' />
				<RegionCheckbox label='東北地區' />
				<RegionCheckbox label='中部地區' />
				<RegionCheckbox label='關東地區' />
			</div>
		</div>
	);
}

function RegionCheckbox({ label }: { label: string }) {
	return (
		<div className='box-border flex gap-2 items-center p-0 m-0'>
			<input
				type='checkbox'
				id={`region-${label}`}
				className='box-border p-0 m-0 w-5 h-5 rounded border border-solid border-zinc-500 appearance-none cursor-pointer'
				aria-label={label}
			/>
			<label htmlFor={`region-${label}`} className='box-border flex-1 p-0 m-0 text-base text-zinc-800 cursor-pointer'>
				{label}
			</label>
			<button className='flex items-center justify-center' aria-label={`展開${label}選項`}>
				<div />
			</button>
		</div>
	);
}
