import React from 'react';

interface Props {
	children: React.ReactNode; // Add children prop
}

const CourseDetailLayout = ({ children }: Props) => {
	return <div className=''>{children}</div>;
};

export default CourseDetailLayout;
