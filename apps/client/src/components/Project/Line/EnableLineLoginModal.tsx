'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

import { selectUserInfo } from '@/state/slices/authSlice';

import Modal from '../Shared/Common/Modal';

import EnableLineLoginButton from './EnableLineLoginButton';

const EnableLineLoginModal = () => {
	const userInfo = useSelector(selectUserInfo);
	// console.log('userInfo', userInfo?.type, userInfo?.lineId);
	const [isOpen, setIsOpen] = useState(userInfo?.type === 'E' && userInfo?.lineId === null);
	const handleClose = () => {
		setIsOpen(false);
	};
	return (
		<Modal isOpen={isOpen} onClose={handleClose} closeOnOutsideClick={false}>
			<div className='flex flex-col items-center w-full min-w-[400px] h-[436px] max-xs:h-[436px] max-xs:min-w-[335px]'>
				<X
					size={24}
					color='#565656'
					className='absolute top-4 right-2 z-50 cursor-pointer object-contain shrink-0 w-10 aspect-square hover:opacity-100 transition-opacity opacity-70'
					onClick={handleClose}
				/>
				<div className='w-full px-6'>
					<div className='flex flex-col items-center bg-white text-center pt-8 px-6 mt-[34px] w-full'>
						<img src='/image/line/line-connect.svg' alt='line-connect' />
						<p className='text-xl font-medium leading-snug text-zinc-800 mt-[26px]'>連結LINE帳號取得折價優惠</p>
						<p className='text-sm font-normal leading-6 text-zinc-500 mt-2 mb-12 w-[320px]'>
							將CitySki帳號連結您的LINE帳號後，只要加入好友就能取得折價優惠，還能用LINE快速登入
						</p>
						<EnableLineLoginButton />
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EnableLineLoginModal;
