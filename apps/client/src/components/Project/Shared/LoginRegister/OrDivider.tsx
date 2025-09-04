import React from 'react';

const OrDivider = () => {
	return (
		<div className='flex overflow-hidden items-center py-1 mt-6 w-full text-xs leading-none text-center whitespace-nowrap text-neutral-400 mb-6'>
			<div className='flex-1 h-px bg-zinc-300' />
			<div className='px-2 bg-white'>OR</div>
			<div className='flex-1 h-px bg-zinc-300' />
		</div>
	);
};

export default OrDivider;
