'use client';
import SimpleBar from 'simplebar-react';

import '@/styles/simplebar.css';

export default function ScrollBody({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SimpleBar style={{ height: 'calc(100vh)' }}>
			<div className='xs:min-w-[1280px] xs:max-w-[1920px] xs:m-auto'>{children}</div>
		</SimpleBar>
	);
}
