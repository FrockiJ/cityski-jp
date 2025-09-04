import { components, OptionProps } from 'react-select';
import { SelectOption } from '@repo/shared';

const CustomOption = (props: OptionProps<SelectOption>) => {
	const { data } = props;

	return <components.Option {...props}>{data.label}</components.Option>;
};

export default CustomOption;
