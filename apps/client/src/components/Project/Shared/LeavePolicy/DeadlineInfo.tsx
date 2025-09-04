import React from 'react';

interface DeadlineInfoProps {
	days: number | string;
	condition: string;
	fee: string;
}

const DeadlineInfo = ({ days, condition, fee }: DeadlineInfoProps) => {
	return (
		<div className='flex flex-wrap gap-5 py-3 w-full border-b last:border-b-0 border-solid border-b-gray-200 max-xs:max-w-full'>
			<div className='flex gap-1 items-center my-auto whitespace-nowrap w-[120px]'>
				{days && (
					<>
						<span className='self-stretch my-auto'>課程前</span>
						<span className='self-stretch my-auto text-xl font-medium leading-snug'>{days}</span>
					</>
				)}
				<span className='self-stretch my-auto'>{condition}</span>
			</div>
			<div className='w-[auto] leading-[28px]'>{fee}</div>
		</div>
	);
};

export default DeadlineInfo;
