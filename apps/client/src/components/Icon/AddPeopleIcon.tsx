'use client';

export default function AddPeopleIcon({ disabled }: { disabled?: boolean }) {
	return (
		<svg
			className={`${disabled ? 'opacity-[0.3]' : ''}`}
			width='32'
			height='32'
			viewBox='0 0 32 32'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<rect x='0.5' y='0.5' width='31' height='31' rx='15.5' stroke='#C1C1C1' />
			<path d='M11 16H21M16 11L16 21' stroke='#565656' strokeWidth='1.4' strokeLinecap='round' />
		</svg>
	);
}
