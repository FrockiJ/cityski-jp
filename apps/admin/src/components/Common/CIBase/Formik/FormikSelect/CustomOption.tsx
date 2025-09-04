import { components } from 'react-select';

import { StyledMenuItem, StyledMultiTextMenuItem } from './styles';

const { Option } = components;
const CustomOption = (props: any) => {
	const { isSelected, isDisabled, data, selectProps } = props;

	if (selectProps.className.includes('multi-text')) {
		selectProps.return(
			<Option {...props}>
				<StyledMultiTextMenuItem isHidden={data.hidden}>{data.label}</StyledMultiTextMenuItem>
			</Option>,
		);
	}
	return (
		<Option {...props}>
			<StyledMenuItem disableRipple isSelected={isSelected} isDisabled={isDisabled} isHidden={data.hidden}>
				{data.label}
			</StyledMenuItem>
		</Option>
	);
};

export default CustomOption;
