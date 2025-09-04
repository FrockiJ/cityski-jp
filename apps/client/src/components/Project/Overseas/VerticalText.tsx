import React from 'react';

type Props = {
	text: string;
};

export const VerticalText = ({ text }: Props) => {
	const segments = text.match(/[a-zA-Z]+|[^a-zA-Z]/g) || [];

	return (
		<div className='flex flex-col relative'>
			{segments.map((segment, index) =>
				/[a-zA-Z]/.test(segment) ? (
					<div key={index} className='relative w-[1em] h-[3.5em]'>
						<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap origin-center'>
							{segment}
						</div>
					</div>
				) : (
					[...segment].map((char, charIndex) => (
						<div key={`${index}-${charIndex}`} className='-mt-[0.3em] first:-mt-0'>
							{char}
						</div>
					))
				),
			)}
		</div>
	);
};
