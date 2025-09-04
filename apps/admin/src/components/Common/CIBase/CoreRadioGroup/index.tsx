import React, { useMemo } from 'react';
import { FormControl, RadioGroup, RadioGroupProps, RadioProps, SxProps, Tooltip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import InfoIcon from '@/components/Common/Icon/InfoIcon';

import { StyledFormControlLabel, StyledRadio, StyledTitle } from './styles';

interface CoreRadioGroupProps extends RadioGroupProps {
	value?: string | number;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
	classNames?: {
		radioGroup?: string;
		label?: string;
		radio?: string;
	};
	radios: Array<{
		value: string | number;
		label: string;
		description?: string;
	}>;
	placement?: 'start' | 'end' | 'top' | 'bottom';
	color?: RadioProps['color'];
	direction?: 'row' | 'column';
	info?: string;
	title?: string;
	width?: string;
	margin?: string;
	isRequired?: boolean;
	isCustomLabel?: boolean;
	disabled?: boolean;
	wrapperSxProps?: SxProps;
	labelSxProps?: SxProps;
	clear?: number;
}

const CoreRadioGroup = ({
	value,
	onChange,
	classNames = {
		radioGroup: 'core-radio-group',
		label: 'core-radio-group-label',
		radio: 'core-radio-group-radio',
	},
	radios,
	placement,
	color,
	direction = 'row',
	info,
	title,
	width,
	margin,
	defaultValue,
	isCustomLabel,
	disabled,
	wrapperSxProps,
	labelSxProps,
	clear,
}: CoreRadioGroupProps) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const key = useMemo(() => uuidv4(), [clear]);

	return (
		<FormControl
			sx={{
				width: width ? width : 'initial',
				margin: margin ? margin : '0 0 20px 0',
				...wrapperSxProps,
			}}
		>
			{title && (
				<StyledTitle>
					{title}
					{info && (
						<Tooltip title={info}>
							<span style={{ display: 'inherit' }}>
								<InfoIcon color='info' sx={{ ml: 1 }} />
							</span>
						</Tooltip>
					)}
				</StyledTitle>
			)}
			<RadioGroup
				key={key}
				row={direction === 'row'}
				value={value}
				onChange={onChange}
				className={classNames.radioGroup}
				defaultValue={defaultValue}
				sx={{ gap: 1 }}
			>
				{radios.map((radio, index) => (
					<StyledFormControlLabel
						key={index}
						className={classNames.label}
						value={radio.value}
						label={radio.label}
						labelPlacement={placement}
						control={<StyledRadio color={color} className={classNames.radio} />}
						disabled={disabled}
						isCustomLabel={isCustomLabel}
						isChecked={String(radio.value) === value}
						hasDescription={Boolean(radio.description)}
						slotProps={{
							...(radio.description && {
								typography: {
									sx: {
										'&:after': {
											content: `"${radio.description}"`,
											display: 'block',
											color: 'text.disabled',
											fontSize: 12,
										},
									},
								},
							}),
						}}
						componentsProps={{
							typography: {
								sx: {
									fontSize: 14,
								},
							},
						}}
						sx={{
							...labelSxProps,
						}}
					/>
				))}
			</RadioGroup>
		</FormControl>
	);
};

export default CoreRadioGroup;
