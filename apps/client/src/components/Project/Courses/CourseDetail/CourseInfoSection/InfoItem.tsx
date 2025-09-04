import React from 'react';

import PracticeIcon from '@/components/Icon/PracticeIcon';
import PriceIcon from '@/components/Icon/PriceIcon';
import TargetIcon from '@/components/Icon/TargetIcon';

interface InfoItemProps {
	title: string;
	type: string;
	explanations: string[];
}

const InfoItem = ({ title, type, explanations }: InfoItemProps) => {
	return (
		<div className='mt-6 first:mt-0'>
			{/* <img loading='lazy' src={icon} alt='' className='w-6 aspect-square' /> */}

			<div className='flex gap-2 flex-1 items-center'>
				{type === 'T' && <TargetIcon />}
				{type === 'C' && <PracticeIcon />}
				{type === 'P' && <PriceIcon />}
				<div className='text-[#2b2b2b] font-medium'>{title}</div>
			</div>
			<div>
				<ul className='mt-2 pl-[44px] space-y-1 [&>li]:relative [&>li]:pl-1'>
					{explanations.map((point, index) => (
						<li
							key={index}
							className='text-[#818181] before:content-["•"] before:absolute before:left-[-1em] before:text-base before:top-[0.2em]'
						>
							{point}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default InfoItem;
