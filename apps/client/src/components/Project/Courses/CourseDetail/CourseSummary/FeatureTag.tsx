import React from 'react';

interface FeatureTagProps {
	icon: React.ReactNode;
	text: React.ReactNode;
}

export const FeatureTag = ({ icon, text }: FeatureTagProps) => {
	return (
		<div className='flex gap-1.5 items-center py-1.5 pr-3.5 pl-2 bg-[#e4f1fc] rounded-3xl'>
			{icon}
			<div className='self-stretch my-auto'>{text}</div>
		</div>
	);
};
