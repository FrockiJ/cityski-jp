import { BoxProps, useTheme } from '@mui/material';
import { DotPulse, DotSpinner, Ring } from '@uiball/loaders';

import { StyledLoaderWrapper, StyledText } from './styles';

interface CoreLoadersProps extends BoxProps {
	color?: string;
	type?: 'Ring' | 'DotPulse' | 'DotSpinner';
	text?: string;
	speed?: number;
	size?: number;
	lineWeight?: number;
	hasOverlay?: boolean;
}

const CoreLoaders = ({ type = 'Ring', color, text, sx, hasOverlay }: CoreLoadersProps) => {
	const theme = useTheme();
	const textColor = color || theme.palette.primary.main;

	const renderLoadingIcon = () => {
		switch (type) {
			case 'Ring':
				return <Ring size={40} lineWeight={5} speed={2} color={textColor} />;
			case 'DotPulse':
				return <DotPulse size={40} speed={1.3} color={textColor} />;
			case 'DotSpinner':
				return <DotSpinner size={40} speed={0.9} color={textColor} />;
		}
	};

	return (
		<StyledLoaderWrapper sx={sx} hasOverlay={hasOverlay}>
			{renderLoadingIcon()}
			{text && <StyledText>{text}</StyledText>}
		</StyledLoaderWrapper>
	);
};

export default CoreLoaders;
