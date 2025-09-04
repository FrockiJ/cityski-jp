import React from 'react';

interface Props {
	children: React.ReactNode; // Add children prop
}

const CoursesLayout = ({ children }: Props) => {
	return <div className='py-[72px] max-w-[1440px] mx-auto max-xs:py-[48px]'>{children}</div>;
};

export default CoursesLayout;
