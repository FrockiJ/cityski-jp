import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary';
	children: React.ReactNode;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
}

function Button({
	variant = 'primary',
	children,
	onClick,
	className = 'h-10',
	type = 'button',
	disabled,
	...props
}: ButtonProps) {
	const baseStyles =
		'overflow-hidden gap-2.5 self-stretch px-5 flex items-center justify-center rounded-lg transition-colors duration-200';
	const variantStyles = {
		primary:
			'font-medium text-white bg-zinc-800 hover:bg-[#414141] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800',
		secondary:
			'bg-white border border-solid border-zinc-800 text-zinc-800 hover:bg-[#EDEDED] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
	};

	return (
		<button
			onClick={onClick}
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
			type={type}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
}

export default Button;
