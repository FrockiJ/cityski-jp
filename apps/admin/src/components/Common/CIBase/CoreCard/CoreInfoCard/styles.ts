import { Keyframes } from '@emotion/react';
import { keyframes, styled } from '@mui/material';

import { CoreInfoCardProps } from '.';

export const trendChoice = ['up', 'down'] as const;
type TrendType = typeof trendChoice;
type TrendChoice = TrendType[number];

type InfoCardStyleProps = Omit<CoreInfoCardProps, 'title' | 'value' | 'subtitle' | 'chart'>;

type InfoCardStyleIconProps = { trend: TrendChoice };

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

const StyledInfoCardWrap = styled('div')<InfoCardStyleProps>(({ width, height, margin, index = 1, theme }) => {
	// actual animation settings
	const cardAnimation: CardAnimation = `${cardFadeIn} ${index * 1200}ms ease-in-out forwards`;

	return {
		width,
		height,
		margin,
		minHeight: '80px',
		minWidth: '80px',
		display: 'flex',
		flex: '1 0 0',
		justifyContent: 'center',
		flexDirection: 'column',
		padding: '24px',
		borderRadius: '20px',
		backgroundColor: theme.mode === 'light' ? '#fff' : '#161C24',
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
		fontSize: '14px',
		fontWeight: 600,
		animation: cardAnimation,
		color: theme.palette.text.primary,
	};
});

const StyledInfoCardCoreWrap = styled('div')(() => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginTop: '16px',
}));

const StyledInfoCardValue = styled('div')(({ theme }) => ({
	color: theme.palette.text.primary,
	fontSize: '32px',
	lineHeight: '48px',
	fontFamily: 'Public Sans',
	fontWeight: 700,
}));

const StyledInfoCardTitle = styled('div')(() => ({
	color: '#212B36',
	fontSize: '14px',
	lineHeight: '22px',
	fontFamily: 'Public Sans',
	fontWeight: 600,
}));

const StyledInfoCardSubtitle = styled('div')(() => ({
	marginTop: '9px',
	display: 'flex',
	alignItems: 'center',
	fontSize: '14px',
	lineHeight: '22px',
	fontFamily: 'Public Sans',
	whiteSpace: 'nowrap',
}));
const StyledInfoCardSubtitlePercent = styled('div')(() => ({
	marginRight: '4px',
	fontWeight: 600,
}));
const StyledInfoCardSubtitleIcon = styled('div')<InfoCardStyleIconProps>(({ trend }) => ({
	borderRadius: '50px',
	backgroundColor: trend === trendChoice[0] ? 'rgba(54, 179, 126, 0.16)' : 'rgba(255, 86, 48, 0.16)',
	padding: '4px',
	marginRight: '4px',
	width: '29px',
	height: '29px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}));
const StyledInfoCardSubtitleDesc = styled('div')(() => ({
	color: '#637381',
	fontWeight: 400,
}));

const StyledInfoCardImage = styled('img')(() => ({
	width: '98px',
	height: '45px',
}));

export {
	StyledInfoCardWrap,
	StyledInfoCardValue,
	StyledInfoCardTitle,
	StyledInfoCardSubtitle,
	StyledInfoCardSubtitlePercent,
	StyledInfoCardSubtitleDesc,
	StyledInfoCardSubtitleIcon,
	StyledInfoCardImage,
	StyledInfoCardCoreWrap,
};
