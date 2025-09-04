import React from 'react';

type Props = {
	message: string;
	leaveSpace?: 'below' | 'above' | 'none';
};

const ErrorInfo = ({ message, leaveSpace = 'none' }: Props) => {
	return (
		<div
			className={`flex gap-2 items-center rounded-md h-11 bg-[#FDEBE6] pt-[7px] pr-[8px] pb-[7px] pl-[12px] ${leaveSpace === 'below' ? 'mb-6' : leaveSpace === 'above' ? 'mt-6' : ''}`}
		>
			<div className='textRed-500'>
				<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M11 8C11 8.55229 11.4477 9 12 9C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8Z'
						fill='#EE3309'
					/>
					<path
						d='M11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16Z'
						fill='#EE3309'
					/>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5Z'
						fill='#EE3309'
					/>
				</svg>
			</div>
			<div className='text-red-500'>{message}</div>
		</div>
	);
};

export default ErrorInfo;
