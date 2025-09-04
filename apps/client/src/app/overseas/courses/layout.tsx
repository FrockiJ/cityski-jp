import React from 'react';

interface Props {
	children: React.ReactNode; // Add children prop
}

const OverseasCoursesLayout = ({ children }: Props) => {
	return (
		<div className='relative min-h-screen bg-white'>
			<div className='relative z-10 mx-auto max-xs:pb-[48px]'>{children}</div>
		</div>
	);
};

export default OverseasCoursesLayout;
