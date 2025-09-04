import * as React from 'react';

export interface EmailClientButtonProps {
	icon: string;
	clientName: string;
	url: string;
}

function EmailClientButton({ icon, clientName, url }: EmailClientButtonProps) {
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			className='flex overflow-hidden flex-1 shrink gap-2 justify-center items-center self-stretch px-[26px] py-2.5 my-auto bg-white rounded-lg border border-solid basis-0 border-zinc-300 hover:border-zinc-400 max-xs:px-[10px]'
			aria-label={`Open ${clientName}`}
		>
			<img
				loading='lazy'
				src={icon}
				alt={`${clientName} icon`}
				className='object-contain shrink-0 self-stretch my-auto w-5 aspect-square'
			/>
			<div className='flex gap-1 items-end self-stretch my-auto text-sm max-xs:text-[13px]'>
				<span>開啟</span>
				<span>{clientName}</span>
			</div>
		</a>
	);
}

export default EmailClientButton;
