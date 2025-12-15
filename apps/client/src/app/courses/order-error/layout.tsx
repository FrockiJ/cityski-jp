import React from 'react';

interface Props {
	children: React.ReactNode;
}

const OrderErrorLayout = ({ children }: Props) => {
	return <div className=''>{children}</div>;
};

export default OrderErrorLayout;
