import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
	return (
		<button
			{...props}
			className='overflow-hidden gap-2.5 self-stretch px-6 py-5 mt-6 w-full text-base font-bold text-center text-white whitespace-nowrap rounded-lg bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)]'
		>
			{children}
		</button>
	);
};
