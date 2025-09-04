import React from 'react';
import { CoursePlanResponseDTO } from '@repo/shared';

import SuggestionIcon from '@/components/Icon/SuggestionIcon';

const SuggestComponent = () => (
	<div className='block xs:absolute xs:left-2/4 gap-1 self-start px-2.5 py-1.5 mt-2 xs:mt-0 text-sm font-medium text-center text-[#169b62] whitespace-nowrap rounded-3xl border border-[#169b62] border-solid xs:-translate-x-2/4 bottom-[-40px] translate-y-[0%]'>
		教練推薦
	</div>
);
export const CourseOption: React.FC<CoursePlanResponseDTO> = ({ name, price, number, suggestion, type }) => {
	return (
		<div
			className={`flex xs:flex-col flex-1 shrink justify-between xs:justify-center items-center self-stretch mx-5 my-auto py-5 xs:py-0 whitespace-nowrap border-b last:border-b-0 border-b-[#d7d7d7] xs:border-b-[0px] xs:border-r last:border-r-0 border-solid basis-0 xs:border-r-[#d7d7d7] ${suggestion ? 'relative' : ''}`}
		>
			<div className={`text-xl font-bold leading-tight ${suggestion ? 'text-[#169b62]' : 'text-[#2b2b2b]'}`}>
				<span className='font-bold text-[16px] xs:text-[20px]'>{type === 1 ? '單堂體驗課' : name + number + '堂'}</span>
				{suggestion && <SuggestComponent />}
			</div>

			<div className='flex flex-col justify-center items-center mt-1'>
				<div className='flex items-center font-medium text-[#2b2b2b]'>
					<div className='self-stretch my-auto text-base'>{(price * number).toLocaleString()}</div>
					<div className='self-stretch my-auto text-sm leading-loose'>元</div>
				</div>
				{number === 1 ? (
					<div className='self-stretch text-center text-sm min-h-[25px] text-[#818181]'>原價</div>
				) : (
					<div className='flex items-center text-[13px] text-[#818181] mt-[-4px]'>
						<span className='self-stretch my-auto tracking-tight leading-6'>{price?.toLocaleString()}</span>
						<span className='self-stretch my-auto'>元/堂</span>
					</div>
				)}
			</div>
			{suggestion && (
				<>
					<div className='hidden xs:block absolute -top-8 left-2/4 z-0 w-6 h-6 -translate-x-2/4 aspect-square translate-y-[0%]'>
						<SuggestionIcon />
					</div>
				</>
			)}
		</div>
	);
};
