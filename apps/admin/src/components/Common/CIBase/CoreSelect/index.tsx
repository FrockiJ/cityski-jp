import { useId, useMemo } from 'react';
import ReactSelect, { ActionMeta, MenuPlacement } from 'react-select';
import { SxProps, useTheme } from '@mui/material';
import { SelectOption } from '@repo/shared';
import { v4 as uuidv4 } from 'uuid';

import { SizeBreakPoint } from '@/shared/types/general';

import CustomOption from './CustomOption';
import { customReactSelectStyles, StyledSelectWrapper } from './styles';

interface CoreSelectProps {
	options: SelectOption[];
	defaultValue?: SelectOption | SelectOption[];
	placeholder?: string;
	disabled?: boolean;
	isRequired?: boolean;
	autoFocus?: boolean;
	width?: string | number;
	menuPlacement?: MenuPlacement;
	size?: Exclude<SizeBreakPoint, 'large'>;
	sx?: SxProps;
	isMulti?: boolean;
	onChange: (option: SelectOption | SelectOption[], action: ActionMeta<SelectOption>) => void;
	margin?: string;
	menuPortal?: boolean;
	clear?: number;
	title?: string;
}

const CoreSelect = ({
	options,
	defaultValue,
	placeholder,
	disabled,
	width,
	menuPlacement = 'bottom',
	sx,
	isMulti,
	onChange,
	margin,
	menuPortal = false,
	clear,
	title,
}: CoreSelectProps) => {
	const uniqueId = useId();
	const theme = useTheme();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const key = useMemo(() => uuidv4(), [clear]);

	return (
		<StyledSelectWrapper width={width} margin={margin} disabled={disabled} sx={{ ...sx }}>
			{title && title}
			<ReactSelect
				key={key}
				isMulti={isMulti}
				className={`${isMulti ? 'multiple-select' : 'single-select'}`}
				instanceId={`react-select-${uniqueId}`} // this is to resolve "Warning: Prop 'id' did not match" error
				defaultValue={defaultValue}
				onChange={(newValue: any, actionMeta: ActionMeta<SelectOption>) => {
					if (onChange) onChange(newValue, actionMeta);
				}}
				placeholder={placeholder}
				isDisabled={disabled}
				styles={customReactSelectStyles(theme)}
				options={options}
				maxMenuHeight={300}
				menuPlacement={menuPlacement}
				openMenuOnFocus
				openMenuOnClick
				components={{
					Option: CustomOption,
				}}
				hideSelectedOptions={false}
				isClearable={false}
				isSearchable={false}
				{...(menuPortal &&
					typeof document !== 'undefined' && {
						menuPlacement: 'auto',
						menuPosition: 'fixed',
						menuPortalTarget: document?.body,
					})}
			/>
		</StyledSelectWrapper>
	);
};

export default CoreSelect;
