import React from 'react';
import { a, useTrail } from '@react-spring/web';

interface CoreTrailProps {
	open: boolean;
	children: React.ReactNode;
	color?: string;
	height?: string | number;
}

const CoreTrail = ({ open, children, color, height }: CoreTrailProps) => {
	const items = React.Children.toArray(children);
	const trail = useTrail(items.length, {
		config: { mass: 5, tension: 2000, friction: 200 },
		opacity: open ? 1 : 0,
		x: open ? 0 : 20,
		height: open ? (height ? height : 18) : 0,
		from: { opacity: 0, x: 20, height: 0 },
	});

	return (
		<div>
			{trail.map(({ height, ...style }, index) => (
				<a.div
					key={index}
					style={{
						position: 'relative',
						width: '100%',
						color,
						fontFamily: 'Mulish',
						overflow: 'hidden',
						...style,
					}}
				>
					<a.div style={{ height }}>{items[index]}</a.div>
				</a.div>
			))}
		</div>
	);
};

export default CoreTrail;
