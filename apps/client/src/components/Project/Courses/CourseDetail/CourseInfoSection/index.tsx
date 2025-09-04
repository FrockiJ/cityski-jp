import React from 'react';

import InfoItem from './InfoItem';

interface CourseInfoSectionProps {
	title: string;
	items: {
		id: string;
		type: string;
		explanations: string[];
	}[];
}

const CourseInfoSection = ({ title, items }: CourseInfoSectionProps) => {
	const mappingTypeTitle = (type) => {
		switch (type) {
			case 'T':
				return '課程對象';
			case 'C':
				return '練習內容';
			case 'P':
				return '費用包含';
			default:
				return '';
		}
	};
	return (
		<section
			id='course-info'
			className='flex flex-col self-stretch pb-12 pt-9 border-b border-solid border-b-zinc-300 max-w-[780px]'
			aria-labelledby='course-info-title'
		>
			<h2
				id='course-info-title'
				className='text-2xl font-medium tracking-tight leading-loose text-zinc-800 max-xs:max-w-full'
			>
				{title}
			</h2>
			<div className='flex flex-col items-start mt-6 w-full text-base max-xs:max-w-full'>
				{items?.map((item, index) => (
					<InfoItem key={index} type={item.type} title={mappingTypeTitle(item.type)} explanations={item.explanations} />
				))}
			</div>
		</section>
	);
};

export default CourseInfoSection;
