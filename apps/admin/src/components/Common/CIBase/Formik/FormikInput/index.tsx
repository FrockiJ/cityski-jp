import React, { useEffect, useMemo, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, FormControl, IconButton, SxProps } from '@mui/material';
import { useField } from 'formik';

import EyeIcon from '@/Icon/EyeIcon';
import { SizeBreakPoint } from '@/shared/types/general';

import { FormikErrorMessage } from '../common/FormikComponents';

import {
	StyledFormHelperText,
	StyledInput,
	StyledInputWrapper,
	StyledTextAdornment,
	StyledTextarea,
	StyledTitle,
	StyledTooltip,
} from './styles';

export type FormikInputProps = {
	name: string;
	value?: string;
	title?: string;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	isRequired?: boolean;
	isNumberOnly?: boolean; // 僅允許數字及空白
	isNumberWithOneDecimal?: boolean; // 僅允許數字、空白及一個小數點
	info?: string;
	type?: string;
	autoFocus?: boolean;
	wrapperSxProps?: SxProps;
	inputStyle?: React.CSSProperties;
	width?: string | number;
	size?: Exclude<SizeBreakPoint, 'large'>;
	margin?: string;
	maxLength?: number;
	defaultValue?: string;
	validate?: boolean;
	onInputChange?: (value: string) => void;
	onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
	iconType?: 'search';
	multiline?: boolean;
	rows?: number;
	helperText?: React.ReactNode;
	endText?: string;
	hasClearIcon?: boolean;
	textareaHeight?: string;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
} & (
	| {
			hasTextCountAdornment: true;
			textCount: number;
			maxTextCount: number;
	  }
	| {
			hasTextCountAdornment?: false;
			textCount?: number;
			maxTextCount?: number;
	  }
) &
	(
		| {
				multiline: true;
				onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
				onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
		  }
		| {
				multiline?: false;
				onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
				onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
		  }
	);

const FormikInput = React.memo(
	({
		name,
		defaultValue,
		// value,
		title,
		placeholder = 'Enter',
		inputStyle,
		wrapperSxProps,
		width,
		size = 'small',
		disabled,
		readOnly,
		isRequired,
		isNumberOnly,
		isNumberWithOneDecimal,
		info,
		type = 'text',
		autoFocus,
		onChange,
		margin,
		onInputChange,
		onBlur,
		iconType,
		multiline,
		helperText,
		endText,
		hasClearIcon = true,
		rows = 4,
		hasTextCountAdornment,
		textCount = 0,
		maxTextCount = 0,
		textareaHeight,
		startAdornment,
		endAdornment,
		...restProps
	}: FormikInputProps) => {
		const [field, meta, helpers] = useField(name);
		const error = !!meta.error && !!meta.touched;

		useEffect(() => {
			if (defaultValue) {
				helpers.setValue(defaultValue);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useEffect(() => {
			if (onInputChange) {
				onInputChange(field.value);
			}
		}, [field.value, onInputChange]);

		const memoField = useMemo(() => {
			return field;
		}, [field]);

		const [showClearButton, setShowClearButton] = useState(false);
		const [showPassword, setShowPassword] = useState(false);

		const inputRef = useRef<(HTMLInputElement | HTMLTextAreaElement) | null>(null);

		const handleInputChangeValue = (e: React.ChangeEvent<any>) => {
			if (e.target.value.length > 0) {
				if (hasTextCountAdornment && e.target.value.length > maxTextCount) return;
				setShowClearButton(true);
			}
			if (e.target.value.length === 0) {
				setShowClearButton(false);
			}

			if (isNumberOnly && !/^(\s*|\d+)$/.test(e.target.value)) return;
			if (isNumberWithOneDecimal && !/^(\d{1,2})?([.]\d{0,1})?$/.test(e.target.value)) return;

			field.onChange(e);
			if (onChange) onChange(e);
		};

		const handleTextareaChangeValue = (e: React.ChangeEvent<any>) => {
			if (e.target.value.length > 0) {
				if (hasTextCountAdornment && e.target.value.length > maxTextCount) return;
				setShowClearButton(true);
			}
			if (e.target.value.length === 0) {
				setShowClearButton(false);
			}

			if (isNumberOnly && !/^(\s*|\d+)$/.test(e.target.value)) return;
			if (isNumberWithOneDecimal && !/^(\s*|\d+)$/.test(e.target.value)) return;

			field.onChange(e);
			if (onChange) onChange(e);
		};

		const handleClearInput = () => {
			helpers.setValue('');
			setShowClearButton(false);
			inputRef.current?.focus();
		};

		return (
			<FormControl
				sx={{
					width: width ? width : '320px',
					margin: margin ? margin : 'initial',
					maxWidth: '100%',
					...wrapperSxProps,
				}}
			>
				<Box display='flex' justifyContent='center' flexDirection='column'>
					{title && (
						<StyledTitle>
							{isRequired && (
								<Box component='span' sx={{ color: 'error.main', mr: 0.5 }}>
									*
								</Box>
							)}
							{title}
							{info && (
								<StyledTooltip title={info}>
									<InfoOutlinedIcon color='primary' sx={{ ml: 1 }} />
								</StyledTooltip>
							)}
						</StyledTitle>
					)}
					<StyledInputWrapper
						width={width}
						size={size}
						error={error}
						disabled={disabled}
						readOnly={readOnly}
						onMouseOver={() => field.value && setShowClearButton(true)}
						onMouseLeave={() => setShowClearButton(false)}
						onClick={() => inputRef.current?.focus()}
						hasClearIcon={hasClearIcon}
						hasTextCountAdornment={hasTextCountAdornment}
						multiline={multiline}
						inputStyle={inputStyle}
					>
						{startAdornment && startAdornment}
						{iconType && (
							<Box display='flex' marginRight='8px'>
								{
									{
										search: <SearchIcon sx={{ color: 'primary.basic' }} />,
									}[iconType]
								}
							</Box>
						)}
						{multiline ? (
							<StyledTextarea
								{...restProps}
								ref={inputRef as React.RefObject<HTMLTextAreaElement>}
								name={memoField.name}
								placeholder={disabled ? '' : placeholder}
								autoFocus={autoFocus}
								value={memoField.value}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextareaChangeValue(e)}
								onBlur={(e: React.FocusEvent<any>) => {
									memoField.onBlur;
									if (onBlur) onBlur(e);
								}}
								spellCheck='false'
								disabled={disabled}
								readOnly={readOnly}
								rows={rows}
								textareaHeight={textareaHeight}
							/>
						) : (
							<StyledInput
								{...restProps}
								ref={inputRef as React.RefObject<HTMLInputElement>}
								name={memoField.name}
								type={type !== 'password' ? type : !showPassword ? 'password' : 'text'}
								placeholder={disabled ? '' : placeholder}
								autoFocus={autoFocus}
								value={memoField.value}
								onChange={handleInputChangeValue}
								onBlur={(e: React.FocusEvent<any>) => {
									memoField.onBlur;
									if (onBlur) onBlur(e);
								}}
								spellCheck='false'
								disabled={disabled}
								readOnly={readOnly}
							/>
						)}
						{endText && (
							<Box
								sx={{
									display: 'flex',
									alignSelf: 'center',
									pr: '20px',
									color: 'text.quaternary',
									whiteSpace: 'nowrap',
								}}
							>
								{endText}
							</Box>
						)}
						{type !== 'password' && hasClearIcon && (
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									cursor: 'pointer',
									color: 'text.secondary',
									minWidth: '20px',
								}}
							>
								{!disabled && !readOnly && showClearButton && (
									<IconButton onClick={handleClearInput} size='small' sx={{ scale: '.8' }} aria-haspopup='true'>
										<CloseIcon />
									</IconButton>
								)}
							</Box>
						)}
						{type === 'password' && (
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									cursor: 'pointer',
									color: 'text.secondary',
									minWidth: '40px',
								}}
							>
								<IconButton
									onClick={() => {
										const cursorPos = inputRef.current?.selectionStart;
										setShowPassword(!showPassword);
										if (cursorPos) {
											setTimeout(() => {
												inputRef.current?.setSelectionRange(cursorPos, cursorPos);
											}, 0);
										}
									}}
									size='small'
									aria-haspopup='true'
								>
									<EyeIcon off={showPassword} />
								</IconButton>
							</Box>
						)}
						{endAdornment && endAdornment}
						{hasTextCountAdornment && (
							<>
								<StyledTextAdornment>{`${textCount}/${maxTextCount}`}</StyledTextAdornment>
							</>
						)}
					</StyledInputWrapper>
				</Box>

				{helperText && !disabled && !readOnly && <StyledFormHelperText>{helperText}</StyledFormHelperText>}

				<FormikErrorMessage name={field.name} />
			</FormControl>
		);
	},
);

FormikInput.displayName = 'FormikInput';
export default FormikInput;
