'use client';
import { forwardRef, ReactElement, Ref } from 'react';
import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const TransitionSlider = forwardRef(function Transition(
	props: TransitionProps & { children: ReactElement<any, any> },
	ref: Ref<unknown>,
) {
	return <Slide direction='left' ref={ref} {...props} />;
});

export default TransitionSlider;
