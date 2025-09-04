import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

import { showToast } from '../../Utils/Toast';
import Modal from '../Common/Modal';

import EmailClientButton from './EmailClientButton';

export interface ConfirmEmailModalProps {
	email: string;
	type: 'verify' | 'forgotPassword' | 'completeVerify';
	isOpen: boolean;
	onClose: () => void;
}

function ConfirmEmailModal({ email, type, isOpen, onClose }: ConfirmEmailModalProps) {
	// console.log('ConfirmEmailModal render:', { email, type, isOpen });
	const [countdown, setCountdown] = useState<number>(0);
	const [isResending, setIsResending] = useState<boolean>(false);

	// Reset countdown when modal closes
	useEffect(() => {
		if (!isOpen) {
			setCountdown(0);
		}
	}, [isOpen]);

	useEffect(() => {
		console.log('Current countdown:', countdown);
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			console.log('Starting interval timer');
			timer = setInterval(() => {
				console.log('Decrementing countdown');
				setCountdown((prev) => prev - 1);
			}, 1000);
		}
		return () => {
			if (timer) {
				console.log('Clearing timer');
				clearInterval(timer);
			}
		};
	}, [countdown]);

	const handleResendEmail = async () => {
		if (countdown > 0 || isResending) return;

		try {
			setIsResending(true);
			console.log('handleResendEmail triggered:', { email });
			console.log('Sending resend request...');
			const url =
				type === 'verify' || type === 'completeVerify'
					? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/resend-verification`
					: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/resend-forgot-password`;
			const response = await axios.post(url, {
				email,
			});
			console.log('Response:', response);
			if (response.status === 201) {
				showToast('連結已重新寄送', 'success');
				console.log('Setting countdown to 60');
				setCountdown(60);
			}
			// eslint-disable-next-line unused-imports/no-unused-vars
		} catch (error) {
			showToast('重新寄送連結失敗', 'error');
		} finally {
			setIsResending(false);
		}
	};

	const emailClients = [
		{
			icon: '/image/shared/gmail-icon.svg',
			clientName: 'Gmail',
			url: 'https://mail.google.com/mail/u/0/#inbox',
		},
		{
			icon: '/image/shared/outlook-icon.svg',
			clientName: 'Outlook',
			url: 'https://outlook.live.com/mail/0/',
		},
	];

	return (
		<Modal isOpen={isOpen} onClose={onClose} title='' closeOnOutsideClick={false}>
			<div className='flex overflow-hidden flex-col pt-2 bg-white rounded-3xl shadow-lg max-w-[400px]'>
				<section className='flex flex-col items-center pr-6 pl-6 w-full font-medium text-zinc-800'>
					<X
						size={24}
						color='#565656'
						className='object-contain cursor-pointer self-end shrink-0 aspect-square hover:opacity-100 transition-opacity opacity-70 mt-2'
						onClick={onClose}
					/>
					<img
						loading='lazy'
						src={type === 'completeVerify' ? '/image/shared/warning.svg' : '/image/shared/email-send.svg'}
						alt='Resend email illustration'
						className='object-contain mt-5 max-w-full aspect-square w-[132px]'
					/>
					<h1 className='mt-7 text-xl leading-snug text-center'>
						{type === 'verify' ? '確認您的電子郵件' : type === 'forgotPassword' ? '請重設密碼' : '帳號已被註冊'}
					</h1>
					<p className='font-normal mt-2 text-sm leading-6 text-center text-zinc-500'>
						{type === 'completeVerify' ? (
							<>
								我們發現你曾使用過電子郵件
								<br /> <strong className='font-semibold text-zinc-800'>{email}</strong> 註冊會員
								<br />
								請透過電子郵件中的連結登入。
							</>
						) : (
							<>
								我們已寄送電子郵件至 <strong className='font-semibold text-zinc-800'>{email}</strong> <br />
								請透過電子郵件中的連結登入。
							</>
						)}
					</p>
					<div className='font-normal text-sm leading-6 text-center mt-10 text-zinc-800'>
						<span>沒有收到連結嗎？</span>
						<button
							onClick={handleResendEmail}
							disabled={countdown > 0 || isResending}
							className={`ml-1 font-normal ${
								countdown > 0 || isResending
									? 'text-zinc-400 cursor-not-allowed'
									: 'text-blue-600 hover:text-blue-500 cursor-pointer'
							}`}
						>
							重新寄送連結 {countdown > 0 && <span className='ml-1'>({countdown}秒)</span>}
						</button>
					</div>
					<div className='flex gap-2 items-center self-start w-full mt-4'>
						{emailClients.map((client) => (
							<EmailClientButton
								key={client.clientName}
								icon={client.icon}
								clientName={client.clientName}
								url={client.url}
							/>
						))}
					</div>
				</section>
				{/* {type !== 'completeVerify' && (
						
					)} */}
				<footer className='flex flex-col justify-center px-28 py-4 mt-6 w-full text-sm leading-loose whitespace-nowrap bg-white border-t border-solid border-t-zinc-300 max-xs:px-20'>
					<div className='flex gap-2 items-center w-full'>
						<p className='self-stretch my-auto text-zinc-800'>錯誤的電子郵件？</p>
						<a
							href={type === 'verify' ? '/register' : '/login'}
							className='self-stretch my-auto font-medium text-blue-600 hover:text-blue-500'
							tabIndex={0}
						>
							{type === 'verify' || type === 'completeVerify' ? '返回註冊' : '返回登入'}
						</a>
					</div>
				</footer>
			</div>
		</Modal>
	);
}

export default ConfirmEmailModal;
