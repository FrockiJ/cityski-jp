import { ForwardedRef, forwardRef, ReactNode } from 'react';
import { BtnActionType } from '@repo/shared';

import CoreBlockHeader from '../CoreBlockHeader';
import { StyledBlock } from '../styles';

interface CoreBlockProps {
	title: string;
	children: ReactNode;
	buttonLabel?: string;
	buttonIconType?: (typeof BtnActionType)[keyof typeof BtnActionType];
	buttonIsLink?: boolean;
	handleClick?: () => void;
	isPlaceholder?: boolean;
	isError?: boolean;
}
const CoreBlock = forwardRef(function CoreBlock(
	{
		title,
		children,
		buttonLabel,
		handleClick,
		isPlaceholder = false,
		isError = false,
		buttonIsLink = false,
		buttonIconType = BtnActionType.MANAGE,
	}: CoreBlockProps,
	ref: ForwardedRef<unknown>,
) {
	return (
		<StyledBlock ref={ref} isPlaceholder={isPlaceholder} isError={isError}>
			<CoreBlockHeader
				title={title}
				buttonLabel={buttonLabel}
				buttonIconType={buttonIconType}
				handleClick={handleClick}
				buttonIsLink={buttonIsLink}
			/>
			{children}
		</StyledBlock>
	);
});

export default CoreBlock;
