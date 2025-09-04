import { Keyframes } from '@emotion/react';
import { keyframes, styled } from '@mui/material';

import { CoreDataCardProps } from '.';
type DataCardStyleProps = Omit<CoreDataCardProps, 'title' | 'value'>;

type CardAnimation = `${Keyframes} ${number}ms ease-in-out forwards`;

// keyframe animation rules
const cardFadeIn = keyframes`
  from {
    transform: translateX(15px);
    opacity: 0.1;
  } 
  to {  
    transform: translateX(0px);
    opacity: 1
  }
`;

const StyledDataCardWrap = styled('div')<DataCardStyleProps>(({ width, height, margin, colors, index = 1, theme }) => {
	// actual animation settings
	const cardAnimation: CardAnimation = `${cardFadeIn} ${index * 1200}ms ease-in-out forwards`;

	return {
		width,
		height,
		margin,
		// minHeight: '80px',
		minWidth: '80px',
		// display: 'flex',
		// justifyContent: 'center',
		// flexDirection: 'column',
		padding: '10px 0',
		borderRadius: '16px',
		flex: '1',
		backgroundColor: theme.mode === 'light' ? colors?.backgroundColor : '#161C24',
		fontSize: '14px',
		fontWeight: 600,
		animation: cardAnimation,
		color: theme.mode === 'light' ? colors?.color : '#fff',
		textAlign: 'center',
	};
});

const StyledDataCardValue = styled('div')(() => ({
	color: 'currentColor',
	fontSize: '32px',
	lineHeight: '48px',
	textAlign: 'center',
}));

export { StyledDataCardWrap, StyledDataCardValue };
