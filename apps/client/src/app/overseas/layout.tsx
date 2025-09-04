import React from 'react';
import Image from 'next/image';

interface Props {
	children: React.ReactNode; // Add children prop
}

const OverseasCoursesLayout = ({ children }: Props) => {
	return (
		<div className='relative min-h-screen bg-white bg-gradient-to-b from-[rgba(121,179,217,0.7)] from-[1.11%] via-[#E4EDF7] via-[90%]'>
			{/* Sticky snow background SVG */}
			<div className='fixed inset-0 w-full h-full pointer-events-none z-0'>
				<Image src='/image/overseas/snow-bg.svg' alt='' fill priority className='object-cover' aria-hidden='true' />
			</div>

			{/* Content container */}
			<div className='relative z-10 pt-[72px] mx-auto max-xs:py-[48px]'>{children}</div>
		</div>
	);
};

export default OverseasCoursesLayout;
