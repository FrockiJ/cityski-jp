import React from 'react';

interface PolicyHeaderProps {
	title: string;
	description: string;
}

const PolicyHeader = ({ title, description }: PolicyHeaderProps) => {
	return (
		<header className='flex flex-col w-full whitespace-nowrap max-xs:max-w-full'>
			<h1
				id='leave-policy-title'
				className='text-2xl font-medium tracking-tight leading-loose text-[#2b2b2b] max-xs:max-w-full'
			>
				{title}
			</h1>
			<p className='mt-2 text-base text-zinc-500'>{description}</p>
		</header>
	);
};

export default PolicyHeader;
