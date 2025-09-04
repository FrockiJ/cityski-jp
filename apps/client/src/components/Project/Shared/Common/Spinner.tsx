'use client';

import React from 'react';

interface SpinnerProps {
	size?: number;
	color?: string;
	speed?: number;
	stroke?: number;
}

const Spinner = ({ size = 40, color = 'black', speed = 0.9, stroke = 5 }: SpinnerProps) => {
	return (
		<div
			style={
				{
					'--uib-size': `${size}px`,
					'--uib-color': color,
					'--uib-speed': `${speed}s`,
					'--uib-stroke': `${stroke}px`,
				} as React.CSSProperties
			}
			className={`
                relative flex items-center justify-start
                [--mask-size:calc(var(--uib-size)/2-var(--uib-stroke))]
                [height:var(--uib-size)]
                [width:var(--uib-size)]
                [-webkit-mask:radial-gradient(circle_var(--mask-size),transparent_99%,#000_100%)]
                [mask:radial-gradient(circle_var(--mask-size),transparent_99%,#000_100%)]
                [background-image:conic-gradient(transparent_25%,var(--uib-color))]
                animate-spin-custom
                rounded-full
            `}
		/>
	);
};

export default Spinner;
