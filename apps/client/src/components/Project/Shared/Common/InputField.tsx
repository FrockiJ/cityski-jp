import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { useFormContext } from '../Context/FormContext';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	id: string;
	name?: string;
	type?: string;
	placeholder?: string;
	error?: string;
	showError?: boolean;
}

function InputField({
	label,
	type = 'text',
	id,
	name = id,
	placeholder = label,
	error,
	onChange,
	onBlur,
	value,
	showError = true,
	...props
}: InputFieldProps) {
	const formik = useFormContext();
	const [showPassword, setShowPassword] = React.useState(false);
	const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

	const handleBirthdayInput = (e: React.FormEvent<HTMLInputElement>) => {
		const input = e.currentTarget;
		const cursorPosition = input.selectionStart ?? 0;
		const previousValue = input.value;
		let value = input.value.replace(/\D/g, ''); // Remove all non-numeric characters

		// Limit length to 8 (YYYYMMDD)
		if (value.length > 8) {
			value = value.slice(0, 8);
		}

		// Format the value
		let formatted = value;
		if (value.length >= 4) {
			formatted = value.slice(0, 4) + '/';
			if (value.length >= 6) {
				formatted += value.slice(4, 6) + '/' + value.slice(6);
			} else {
				formatted += value.slice(4);
			}
		}

		// Handle backspace logic
		const isBackspace = previousValue.length > formatted.length;
		if (isBackspace && previousValue[cursorPosition - 1] === '/') {
			const newValue = value.slice(0, -1);
			if (newValue.length >= 6) {
				formatted = newValue.slice(0, 4) + '/' + newValue.slice(4, 6) + '/' + newValue.slice(6);
			} else if (newValue.length >= 4) {
				formatted = newValue.slice(0, 4) + '/' + newValue.slice(4);
			} else {
				formatted = newValue;
			}
		}

		// Update the input value
		input.value = formatted;

		// Adjust the cursor position
		let newPosition = cursorPosition;
		if (!isBackspace && value.length === 4 && formatted.length > previousValue.length) {
			newPosition = cursorPosition + 1; // Move cursor after the slash
		} else if (isBackspace && previousValue[cursorPosition - 1] === '/') {
			newPosition = cursorPosition - 1; // Move cursor before the slash
		}

		// Set the cursor position after the update
		setTimeout(() => {
			input.setSelectionRange(newPosition, newPosition);
		}, 0);
	};

	const validationProps = formik
		? {
				name: id,
				value: formik.values[id],
				onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
					if (id === 'birthday') {
						handleBirthdayInput(e);
					}
					formik.handleChange(e);
				},
				onBlur: formik.handleBlur,
				error: formik.touched[id] && (formik.errors[id] as string),
			}
		: {
				name,
				value,
				onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
					if (id === 'birthday') {
						handleBirthdayInput(e);
					}
					if (onChange) onChange(e);
				},
				onBlur,
				error,
			};

	return (
		<div className='relative flex flex-col w-full'>
			<div className='relative'>
				<input
					type={inputType}
					id={id}
					placeholder=' '
					className={`peer flex-1 shrink p-4 pt-6 w-full h-[56px] bg-white rounded-lg border 
						${
							validationProps.error
								? '[&]:border-red-500 [&:focus]:border-red-500 [&:focus]:border-[1px]'
								: 'border-zinc-300 [&:focus]:border-black [&:focus]:border-2'
						}
						peer-[:not(:placeholder-shown)]:pt-6
						${type === 'password' ? 'pr-12' : ''}
						outline-none`}
					aria-label={label}
					maxLength={id === 'birthday' ? 10 : undefined}
					onInput={id === 'birthday' ? handleBirthdayInput : undefined}
					{...validationProps}
					{...props}
				/>
				<label
					htmlFor={id}
					className='absolute left-4 top-4 text-zinc-400 transition-all duration-200 
						peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-zinc-500
						peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-xs'
				>
					{placeholder}
				</label>
				{type === 'password' && (
					<button
						type='button'
						tabIndex={-1}
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-500 transition-colors'
						aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
					>
						{showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
					</button>
				)}
			</div>
			{showError && validationProps.error && typeof validationProps.error === 'string' && (
				<span className={`mt-1 text-xs text-red-500 ${type === 'checkbox' ? 'ml-8' : ''}`}>
					{validationProps.error}
				</span>
			)}
		</div>
	);
}

export default InputField;
