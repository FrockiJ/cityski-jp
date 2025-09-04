'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import GradientCurve from '@/components/Icon/GradientCurve';

interface Props {
	children: React.ReactNode;
}

const MemberLayout = ({ children }: Props) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const section = searchParams.get('section');

	const showGradient = pathname === '/member' && !section;

	return (
		<div className='px-[120px] max-xs:px-[20px] py-[72px] max-w-[1440px] mx-auto'>
			{showGradient && <GradientCurve />}
			{children}
		</div>
	);
};

export default MemberLayout;
