import React, { useEffect, useRef, useState } from 'react';
import { Box, Tooltip } from '@mui/material';

import { StyledWrapper } from './styles';

interface CoreEllipsisTextWithTooltipProps extends React.ComponentPropsWithoutRef<typeof Box> {
	children: React.ReactNode;
	lines?: number;
}

const CoreEllipsisTextWithTooltip = ({ children, lines = 1, sx, ...restProps }: CoreEllipsisTextWithTooltipProps) => {
	const elementRef = useRef<HTMLDivElement>(null);
	const [isTextOverflow, setIsTextOverflow] = useState(false);

	// handle weather to display tooltip
	useEffect(() => {
		if (!elementRef.current) return;
		const element = elementRef.current;

		const resizeObserver = new ResizeObserver(() => {
			const { clientHeight, scrollHeight } = element;
			setIsTextOverflow(scrollHeight > clientHeight);
		});

		resizeObserver.observe(element);

		return () => {
			resizeObserver.unobserve(element);
		};
	}, []);

	return (
		<StyledWrapper ref={elementRef} lines={lines} sx={sx} {...restProps}>
			<Tooltip title={children} disableHoverListener={!isTextOverflow} followCursor>
				<span>{children}</span>
			</Tooltip>
		</StyledWrapper>
	);
};

export default CoreEllipsisTextWithTooltip;
