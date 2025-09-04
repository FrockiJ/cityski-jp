import React, { useEffect, useState } from 'react';

interface StableInputProps {
	name: string;
	placeholder?: string;
	width?: string;
	margin?: string;
	isRequired?: boolean;
	isNumberOnly?: boolean;
	value?: string;
	onChange?: (value: string) => void;
	startAdornment?: React.ReactNode;
	isDisabled?: boolean;
	hasError?: boolean;
	hasSubmitted?: boolean;
	isSavingDraft?: boolean;
}

export const StableInput: React.FC<StableInputProps> = ({
	name,
	placeholder = '',
	width = '100%',
	margin = '0',
	isRequired,
	isNumberOnly,
	value = '',
	onChange,
	startAdornment,
	isDisabled = false,
	hasError = false,
	hasSubmitted = false,
	isSavingDraft = false,
}) => {
	// Use a simple state to track the input value
	const [inputValue, setInputValue] = useState(value);
	const [showError, setShowError] = useState(false);

	// Handle input changes directly
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isDisabled) return;

		const newValue = e.target.value;

		// For number-only inputs, filter out non-numeric characters
		if (isNumberOnly) {
			const numericValue = newValue.replace(/[^0-9]/g, '');
			setInputValue(numericValue);

			if (onChange) {
				onChange(numericValue);
			}
		} else {
			setInputValue(newValue);

			if (onChange) {
				onChange(newValue);
			}
		}
	};

	// Update local state when prop value changes
	useEffect(() => {
		if (value !== inputValue) {
			setInputValue(value);
		}
	}, [value]);

	// Determine if input should show error state
	useEffect(() => {
		// Don't show errors if saving as draft
		if (isSavingDraft) {
			setShowError(false);
			return;
		}
		setShowError((isRequired && !inputValue && hasSubmitted) || hasError);
	}, [isRequired, inputValue, hasSubmitted, hasError, isSavingDraft]);

	const containerStyle = {
		display: 'inline-flex',
		alignItems: 'center',
		width,
		margin,
	};

	const inputStyle = {
		width: '100%',
		padding: '8px 12px',
		border: showError ? '1px solid #f44336' : '1px solid #ccc',
		borderRadius: '4px',
		fontSize: '14px',
		backgroundColor: isDisabled ? '#f5f5f5' : 'white',
		cursor: isDisabled ? 'not-allowed' : 'text',
	};

	return (
		<div style={containerStyle}>
			{startAdornment}
			<input
				type='text'
				name={name}
				placeholder={placeholder}
				value={inputValue}
				onChange={handleChange}
				required={false}
				style={inputStyle}
				disabled={isDisabled}
			/>
		</div>
	);
};
