import { ReactNode } from 'react';
import { FormControlLabelProps, SwitchProps } from '@mui/material';

import { StyledFormControlLabel, StyledSwitch } from './styles';

interface CoreSwitchProps extends SwitchProps {
	label?: string | ReactNode;
	labelPlacement?: FormControlLabelProps['labelPlacement'];
}

const CoreSwitch = ({ label, size = 'medium', labelPlacement = 'end', ...restProps }: CoreSwitchProps) => {
	return (
		<>
			{label ? (
				<StyledFormControlLabel
					control={<StyledSwitch size={size} {...restProps} />}
					label={label}
					labelPlacement={labelPlacement}
				/>
			) : (
				<StyledSwitch size={size} {...restProps} />
			)}
		</>
	);
};

export default CoreSwitch;
