import * as React from 'react';

import EmailClientButton from '../../Shared/LoginRegister/EmailClientButton';

export interface EmailData {
	userEmail: string;
}

function ResetPassword() {
	const emailData: EmailData = {
		userEmail: 'email123@example.com',
	};

	const emailClients = [
		{
			icon: '/images/shared/gmail-icon.svg',
			clientName: 'Gmail',
			url: 'https://mail.google.com/mail/u/0/#inbox',
		},
		{
			icon: '/images/shared/outlook-icon.svg',
			clientName: 'Outlook',
			url: 'https://outlook.live.com/mail/0/',
		},
	];

	return (
		<div className='flex overflow-hidden flex-col pt-2 bg-white rounded-3xl shadow-lg max-w-[400px]'>
			<section className='flex flex-col items-center pr-2 pl-6 w-full font-medium text-zinc-800'>
				<img
					loading='lazy'
					src='https://cdn.builder.io/api/v1/image/assets/TEMP/157e9cdd502b0e05c818111ec6e48d47c1377e38d5982ccb874e2abb2085a129?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f'
					alt=''
					className='object-contain self-end w-10 aspect-square'
				/>
				<img
					loading='lazy'
					src='/images/shared/email-send.svg'
					alt='Reset password illustration'
					className='object-contain mt-5 max-w-full aspect-square w-[132px]'
				/>
				<h1 className='mt-7 text-xl leading-snug text-center'>請重設密碼</h1>
				<p className='mt-2 text-sm leading-6 text-center'>
					我們已寄送電子郵件至 <strong className='font-semibold text-zinc-800'>{emailData.userEmail}</strong>{' '}
					請透過電子郵件中的連結重新設定密碼。
				</p>
				<div className='flex gap-2 items-center self-start mt-12 w-full'>
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
			<footer className='flex flex-col justify-center px-28 py-4 mt-6 w-full text-sm leading-loose whitespace-nowrap bg-white border-t border-solid border-t-zinc-300'>
				<div className='flex gap-2 items-center w-full'>
					<p className='self-stretch my-auto text-zinc-800'>錯誤的電子郵件？</p>
					<a href='#' className='self-stretch my-auto font-medium text-blue-600' tabIndex={0}>
						返回註冊
					</a>
				</div>
			</footer>
		</div>
	);
}

export default ResetPassword;
