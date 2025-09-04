import { Keyframes } from '@emotion/react';
import { keyframes, styled, TableContainer, TableContainerProps } from '@mui/material';

// keyframe animation rules
const fadeIn = keyframes`
  from {
    transform: scaleY(0.98) translateY(-30px);
    opacity: 0.1;
  } 
  to {
    transform: scaleY(1) translateY(0px);
    opacity: 1
  }
`;

interface TableContainerAnimatedProps extends TableContainerProps {
	component: any;
	elevation: number;
}

type Animation = `${Keyframes} ${number}ms ease-in-out forwards`;

// actual animation settings
const animation: Animation = `${fadeIn} 640ms ease-in-out forwards`;

/**
 * Animated version of MUI's TableContainer
 *
 * Note: This version of the animation was originally for the demo in October 2023 - please
 * review the implementation before actual use.
 */
const TableContainerAnimated = styled(TableContainer)<TableContainerAnimatedProps>(() => ({
	animation,
}));

export { TableContainerAnimated };
