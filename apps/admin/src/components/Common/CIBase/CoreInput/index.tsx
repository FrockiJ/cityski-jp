import { FocusEventHandler, forwardRef, KeyboardEventHandler, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Input, InputProps, SxProps } from '@mui/material';

import { SizeBreakPoint } from '@/shared/types/general';

import * as Styles from './style';

const CustomInput = forwardRef(function CustomInput(
	{
		variant,
		startNode,
		endNode,
		rootStyle,
		inputStyle,
		size,
		hasClearIcon,
		...restProps
	}: InputProps & {
		variant?: 'headerSearch';
		startNode: React.ReactNode;
		endNode: React.ReactNode;
		rootStyle?: React.CSSProperties;
		inputStyle?: React.CSSProperties;
		size?: Exclude<SizeBreakPoint, 'large'>;
		hasClearIcon?: boolean;
	},
	ref: React.ForwardedRef<HTMLInputElement>,
) {
	const slotProps = {
		root: {
			variant,
			rootStyle,
			size,
			hasClearIcon,
		},
		input: {
			variant,
			inputStyle,
			ref,
		},
	};

	return (
		<Styles.InputWrapper>
			{startNode && startNode}
			<Input slots={{ root: Styles.RootElement, input: Styles.InputElement }} slotProps={slotProps} {...restProps} />
			{endNode && endNode}
		</Styles.InputWrapper>
	);
});

const CoreInput = ({
	id,
	name,
	title,
	subTitle,
	startAdornment,
	endAdornment,
	placeholder = '',
	isError = false,
	isDisabled = false,
	isRequired = false,
	variant,
	size,
	defaultValue,
	hasClearIcon = true,
	startNode,
	endNode,
	rootStyle,
	inputStyle,
	wrapperSxProps,
	startAdornmentSxProps,
	endAdornmentSxProps,
	onChange,
	// value,
	autoFocus = false,
	onFocus,
	onBlur,
	onKeyDown,
	inputRef,
	...restProps
}: {
	id?: string;
	name?: string;
	title?: string;
	subTitle?: string;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
	placeholder?: string;
	isError?: boolean;
	isDisabled?: boolean;
	isRequired?: boolean;
	hasClearIcon?: boolean;
	variant?: 'headerSearch';
	rootStyle?: React.CSSProperties;
	inputStyle?: React.CSSProperties;
	startNode?: React.ReactNode;
	endNode?: React.ReactNode;
	size?: Exclude<SizeBreakPoint, 'large'>;
	defaultValue?: string;
	wrapperSxProps?: SxProps;
	startAdornmentSxProps?: SxProps;
	endAdornmentSxProps?: SxProps;
	onChange?: (value: string) => void;
	value?: unknown;
	autoFocus?: boolean;
	onFocus?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	inputRef?: React.ForwardedRef<HTMLInputElement>;
	onCompositionStart?: (event: React.CompositionEvent<HTMLInputElement>) => void;
	onCompositionEnd?: (event: React.CompositionEvent<HTMLInputElement>) => void;
}) => {
	const [showClearButton, setShowClearButton] = useState(false);
	const [value, setValue] = useState(defaultValue ?? '');

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setValue(event.target.value);

		if (onChange) onChange(event.target.value);
	};
	const handleClearInput = () => {
		setValue('');
		setShowClearButton(false);

		if (onChange) onChange('');
	};

	useEffect(() => {
		if (value) setValue(value);
	}, [value]);

	return (
		<Box sx={wrapperSxProps}>
			{title && <Styles.Title isRequired={isRequired}>{title}</Styles.Title>}
			<CustomInput
				id={id}
				name={name}
				variant={variant}
				placeholder={placeholder}
				error={isError}
				disabled={isDisabled}
				startNode={startNode}
				endNode={endNode}
				rootStyle={rootStyle}
				inputStyle={inputStyle}
				size={size}
				hasClearIcon={hasClearIcon}
				startAdornment={
					startAdornment && <Styles.StartAdornment sx={startAdornmentSxProps}>{startAdornment}</Styles.StartAdornment>
				}
				endAdornment={
					<>
						{endAdornment ? (
							<Styles.EndAdornment sx={endAdornmentSxProps}>{endAdornment}</Styles.EndAdornment>
						) : (!isDisabled && value) || showClearButton ? (
							<IconButton onClick={handleClearInput} size='small' sx={{ scale: '.8' }} aria-haspopup='true'>
								<CloseIcon />
							</IconButton>
						) : null}
					</>
				}
				onChange={handleOnChange}
				value={value}
				autoFocus={autoFocus}
				onFocus={onFocus}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				ref={inputRef}
				{...restProps}
			/>
			{subTitle && <Styles.SubTitle>{subTitle}</Styles.SubTitle>}
		</Box>
	);
};

export default CoreInput;
