import React, { useEffect, useState } from 'react';

import ToastErrorIcon from '@/components/Icon/ToastErrorIcon';
import ToastSuccessIcon from '@/components/Icon/ToastSuccessIcon';

import { useFormContext } from '../Context/FormContext';

interface PhoneInputFieldProps {
	id: string;
	label: string;
	onSendCode?: (phone: string) => Promise<boolean>;
	onVerify?: (code: string, phone: string) => Promise<boolean>;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({ id, label, onSendCode, onVerify }) => {
	const [isSent, setIsSent] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const formik = useFormContext();
	const [verificationStatus, setVerificationStatus] = useState<{
		error?: string;
		success?: boolean;
		isLoading?: boolean;
	}>({});

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;
		if (countdown > 0) {
			timer = setInterval(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		} else if (countdown === 0 && isSent && !verificationStatus.success) {
			setVerificationStatus({
				error: '驗證碼逾期',
			});
		}

		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, [countdown, isSent, verificationStatus.success]);

	useEffect(() => {
		if (!formik.values[`${id}Code`]) {
			formik.setFieldValue(`${id}Code`, '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const handleSendCode = async () => {
		try {
			if (onSendCode && formik.values[id]) {
				const success = await onSendCode(formik.values[id]);
				if (success) {
					setIsSent(true);
					setCountdown(60);
					setTimeout(() => {
						document.getElementById(`${id}Code`)?.focus();
					}, 0);
				}
			}
		} catch (error) {
			setVerificationStatus({
				error: error instanceof Error ? error.message : '發送驗證碼失敗',
			});
			setIsSent(false);
			setCountdown(0);
		}
	};

	const handleVerify = async () => {
		try {
			setVerificationStatus({ isLoading: true });
			if (onVerify && formik.values[`${id}Code`] && formik.values[id]) {
				const success = await onVerify(formik.values[`${id}Code`], formik.values[id]);
				if (success) {
					setVerificationStatus({ success: true });
					setCountdown(0);
				}
			}
		} catch (err) {
			setVerificationStatus({
				error: err instanceof Error ? err.message : '驗證碼錯誤',
			});
		} finally {
			setVerificationStatus((prev) => ({ ...prev, isLoading: false }));
		}
	};

	return (
		<div className='relative'>
			<div
				className={`relative rounded-lg ${
					(formik.touched[id] && formik.errors[id]) || (formik.touched[`${id}Code`] && formik.errors[`${id}Code`])
						? 'border border-red-500'
						: 'border border-gray-300 focus-within:border-2 focus-within:border-black'
				}`}
			>
				<div className='relative'>
					<input
						type='tel'
						id={id}
						name={id}
						value={formik.values[id]}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && formik.values[id] && !isSent && !verificationStatus.success) {
								e.preventDefault();
								handleSendCode();
							}
						}}
						disabled={verificationStatus.success}
						className={`peer flex-1 h-14 px-4 pt-3 w-full text-base focus:outline-none rounded-lg
							${verificationStatus.success ? 'bg-gray-100 text-gray-500' : ''}`}
						placeholder=' '
					/>
					<label
						htmlFor={id}
						className='absolute left-4 top-4 text-zinc-400 transition-all duration-200 
							peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-zinc-500
							peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-xs'
					>
						{label}
					</label>
					<button
						type='button'
						onClick={handleSendCode}
						disabled={!formik.values[id] || (formik.touched[id] && !!formik.errors[id])}
						className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3 text-xs leading-6
							${
								isSent && countdown > 0
									? 'text-gray-500 cursor-not-allowed'
									: 'text-zinc-700 cursor-pointer rounded-lg border border-zinc-700 hover:bg-gray-100'
							}
							${verificationStatus.success ? 'hidden' : ''}`}
					>
						{isSent ? (countdown > 0 ? `已發送OTP 請檢視簡訊 (${formatTime(countdown)})` : '重發驗證碼') : '發送驗證碼'}
					</button>
				</div>

				{isSent && (
					<>
						<div className='mx-4 border-t border-dashed border-gray-300'></div>
						<div className='relative'>
							<input
								type='text'
								inputMode='numeric'
								pattern='[0-9]*'
								maxLength={6}
								id={`${id}Code`}
								name={`${id}Code`}
								autoComplete='off'
								disabled={verificationStatus.success}
								value={formik.values[`${id}Code`]}
								onChange={(e) => {
									const value = e.target.value.replace(/\D/g, '');
									e.target.value = value;
									formik.handleChange(e);
									setVerificationStatus({});
								}}
								onKeyDown={(e) => {
									if (
										e.key === 'Enter' &&
										countdown > 0 &&
										!verificationStatus.error &&
										!verificationStatus.isLoading &&
										formik.values[`${id}Code`]?.length === 6
									) {
										e.preventDefault();
										handleVerify();
									}
								}}
								onBlur={formik.handleBlur}
								className={`peer flex-1 h-14 px-4 pt-3 w-full text-base focus:outline-none rounded-lg
									${verificationStatus.success ? 'bg-gray-100 text-gray-500' : ''}`}
								placeholder=' '
							/>
							<label
								htmlFor={`${id}Code`}
								className='absolute left-4 top-4 text-zinc-400 transition-all duration-200 
									peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-zinc-500
									peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-xs'
							>
								手機驗證碼
							</label>
							{countdown > 0 && !verificationStatus.error ? (
								<button
									type='button'
									onClick={handleVerify}
									disabled={
										verificationStatus.isLoading ||
										!formik.values[`${id}Code`] ||
										formik.values[`${id}Code`].length !== 6
									}
									className='absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3 text-sm leading-6
										text-zinc-700 cursor-pointer rounded-lg border border-zinc-700 hover:bg-gray-100
										disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300 disabled:hover:bg-transparent'
								>
									{verificationStatus.isLoading ? '驗證中...' : '確認驗證'}
								</button>
							) : (
								<span
									className={`absolute right-2 top-[55%] -translate-y-1/2 h-10 px-3 text-sm leading-6 
									${verificationStatus.success ? 'text-green-500' : 'text-red-500'}
									flex items-center gap-1`}
								>
									{verificationStatus.success ? (
										<>
											<ToastSuccessIcon />
											驗證成功
										</>
									) : (
										<>
											<ToastErrorIcon />
											{verificationStatus.error || '驗證碼逾期'}
										</>
									)}
								</span>
							)}
						</div>
					</>
				)}
			</div>
			{formik.touched[id] && formik.errors[id] && (
				<p className='mt-1 text-xs text-red-500'>{formik.errors[id] as string}</p>
			)}
			{formik.touched[`${id}Code`] && formik.errors[`${id}Code`] && (
				<p className='mt-1 text-xs text-red-500'>{formik.errors[`${id}Code`] as string}</p>
			)}
		</div>
	);
};

export default PhoneInputField;
