import { useMemo } from 'react';
import { components } from 'react-select';
import { Box } from '@mui/material';
import { SelectOption } from '@repo/shared';

const { ValueContainer } = components;
const CustomValueContainer = (props: any) => {
	const { selectProps, isDisabled } = props;
	const values = useMemo<SelectOption[]>(() => {
		return props.getValue();
	}, [props]);

	const content = useMemo(() => {
		return values.map((item) => item.label).join(', ');
	}, [values]);

	if (selectProps.className.includes('multi-text') && content) {
		return (
			<ValueContainer {...props}>
				<Box
					display='flex'
					sx={
						isDisabled && {
							color: 'text.disabled',
						}
					}
				>
					{content}
					{props.children[1]}
				</Box>
			</ValueContainer>
		);
	}
	return <ValueContainer {...props}>{props.children}</ValueContainer>;
};

export default CustomValueContainer;
