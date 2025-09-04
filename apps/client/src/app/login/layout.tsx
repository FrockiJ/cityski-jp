import React from 'react';

interface Props {
	children: React.ReactNode; // Add children prop
}

const LoginLayout = ({ children }: Props) => {
	return <div className='max-xs:px-5 max-xs:pt-12 pt-[72px] max-w-[1440px] mx-auto'>{children}</div>;
};

export default LoginLayout;
