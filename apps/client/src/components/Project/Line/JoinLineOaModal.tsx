'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

import AddLineButton from '@/components/Icon/AddLineButton';
import AddLineOaHero from '@/components/Icon/AddLineOaHero';
import GreenTick from '@/components/Icon/GreenTick';
import { selectUserInfo } from '@/state/slices/authSlice';

import Modal from '../Shared/Common/Modal';

const JoinLineOaModal = () => {
	const userInfo = useSelector(selectUserInfo);
	const [isOpen, setIsOpen] = useState(
		(userInfo?.type === 'L' && userInfo?.lineOa === null) ||
			(userInfo?.type === 'E' && userInfo?.lineId !== null && userInfo?.lineOa === null),
	);
	const handleClose = () => {
		setIsOpen(false);
	};
	return (
		<Modal isOpen={isOpen} onClose={handleClose} closeOnOutsideClick={false}>
			<div className='flex flex-col items-center w-full h-[606px] max-xs:h-[478px] relative'>
				<X
					size={24}
					color='#565656'
					className='absolute top-4 right-2 z-50 cursor-pointer object-contain shrink-0 w-10 aspect-square hover:opacity-100 transition-opacity opacity-70'
					onClick={handleClose}
				/>
				<AddLineOaHero />
				<div className='absolute w-full px-6'>
					<div className='flex flex-col border border-solid border-zinc-800 items-center bg-white rounded-xl text-center pt-8 px-6 pb-10 mt-[150px] w-full shadow-md'>
						<p className='text-xl font-medium leading-snug text-zinc-800'>
							加入<span className='font-bold'>LINE</span>好友取得折價優惠
						</p>
						<p className='text-sm font-normal leading-snug text-zinc-500 mt-1 mb-8 max-xs:hidden'>
							用手機掃描QR code進行加入
						</p>
						<p className='text-sm font-normal leading-snug text-zinc-500 mt-1 mb-8 xs:hidden'>更多好康等著你</p>
						<img
							src='/image/line/line-oa-qr-code.png'
							alt='line-oa-qr-code'
							className='w-[160px] h-[160px] max-xs:hidden'
						/>
						<div className='hidden max-xs:block'>
							<AddLineButton />
						</div>
					</div>
					<div className='flex flex-col items-center justify-center gap-2 mt-6'>
						<div className='flex items-center gap-2 text-sm font-normal leading-snug text-zinc-800'>
							<GreenTick />
							收到最新促銷優惠
						</div>
						<div className='flex items-center gap-2 text-sm font-normal leading-snug text-zinc-800'>
							<GreenTick />
							輕鬆訂購預約課程
						</div>
						<div className='flex items-center gap-2 text-sm font-normal leading-snug text-zinc-800'>
							<GreenTick />
							專人線上諮詢服務
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default JoinLineOaModal;
