import { forwardRef, ReactElement, Ref } from 'react';
import { Zoom } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const TransitionZoom = forwardRef(function Transition(
	props: TransitionProps & { children: ReactElement<any, any> },
	ref: Ref<unknown>,
) {
	return (
		<Zoom
			ref={ref}
			style={{
				transform: props.in ? 'scale(1)' : 'scale(0.9)',
				opacity: props.in ? 1 : 0.5,
			}}
			{...props}
		/>
	);
});

export default TransitionZoom;
