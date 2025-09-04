'use client';
import { forwardRef, ReactElement, Ref } from 'react';
import { Zoom } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const TransitionZoom = forwardRef(function Transition(
	props: TransitionProps & { children: ReactElement<any, any> },
	ref: Ref<unknown>,
) {
	return <Zoom ref={ref} {...props} />;
});

export default TransitionZoom;
