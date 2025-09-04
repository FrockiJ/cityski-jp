import React from 'react';

import CoreBlockRow from '@/components/Common/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';

type Props = {
	children: React.ReactNode;
	width?: string;
	height?: string;
	minHeight?: string;
	row?: boolean;
	px?: number;
	py?: number;
};

const BlockArea = ({ children, width, height, minHeight, row, px = 24, py = 16 }: Props) => {
	return (
		<CoreBlockRow
			row={row}
			sx={{
				display: 'inline-flex',
				flexWrap: 'wrap',
				padding: `${py}px ${px}px`,
				borderRadius: 2,
				backgroundColor: 'background.light',
				width,
				height,
				minHeight,
			}}
		>
			{children}
		</CoreBlockRow>
	);
};

export default BlockArea;
