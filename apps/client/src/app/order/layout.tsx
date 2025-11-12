'use client';

import React from 'react';

interface Props {
	children: React.ReactNode;
}

const OrderLayout = ({ children }: Props) => {
	return <div className='px-[120px] max-xs:px-[20px] py-[72px] max-w-[1440px] mx-auto'>{children}</div>;
};

export default OrderLayout;
