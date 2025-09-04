'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios, { isAxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';

import { selectToken, selectUserInfo } from '@/state/slices/authSlice';

import ConnectAccountButton from '../Line/ConnectAccountButton';
import JoinLineOaModal from '../Line/JoinLineOaModal';
import { showToast } from '../Utils/Toast';

import ChangePhoneModal from './ChangePhoneModal';

const PersonalInfo = () => {
	const userInfo = useSelector(selectUserInfo);
	const auth = useSelector(selectToken);
	const searchParams = useSearchParams();
	const checkLineOa = searchParams.get('checkLineOa');
	const [isChangePhoneModalOpen, setIsChangePhoneModalOpen] = useState(false);
	// console.log('checkLineOa', checkLineOa);

	// console.log('searchParams', searchParams.get('connected'));
	useEffect(() => {
		// get local storage connected
		const connected = localStorage.getItem('connected');
		if (connected) {
			showToast(connected === 'true' ? '已開啟LINE快速登入' : '已取消連結LINE帳號', 'success');
		}
		localStorage.removeItem('connected');
	}, []);

	const handleCancelLineLogin = async () => {
		// call api to cancel line login
		try {
			const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/member/line-unbind', {
				headers: {
					Authorization: `Bearer ${auth}`,
				},
			});
			// console.log('response', response);
			if (response.status === 200) {
				localStorage.setItem('connected', 'false');
				window.location.reload();
			} else {
				showToast('取消連結LINE帳號失敗', 'error');
			}
		} catch (err) {
			console.log('Error when attempting to cancel line login.');
			if (isAxiosError(err)) {
				console.log('Error:\n', err.response.data);
			}
			// handle error flow. Redirect? Popup?
			showToast('取消連結LINE帳號失敗', 'error');
			return;
		}
	};

	return (
		<main className='flex flex-col max-w-[856px] max-xs:ml-0 max-xs:w-full max-xs:h-[670px]'>
			<div className='flex flex-col grow justify-center p-8 w-full bg-white rounded-2xl border border-solid border-zinc-300 max-xs:mt-0 max-xs:max-w-full max-xs:border-none max-xs:p-0'>
				<h2 className='self-start text-2xl font-medium tracking-tight leading-loose text-zinc-800 max-xs:hidden'>
					個人資料
				</h2>
				<div className='flex flex-col mt-6 w-full max-xs:max-w-full max-xs:mt-0'>
					<div className='flex flex-wrap gap-10 justify-between items-center py-4 w-full whitespace-nowrap bg-white border-b border-solid border-b-zinc-300 min-h-[72px] max-xs:max-w-full'>
						<div className='flex gap-10 items-center self-stretch my-auto text-base max-xs:flex-col max-xs:gap-2'>
							<div className='self-stretch my-auto text-zinc-500 w-[100px] max-xs:w-full'>會員姓名</div>
							<div className='self-stretch my-auto font-medium text-zinc-800'>{userInfo?.name}</div>
						</div>
					</div>
					<div className='flex flex-wrap gap-10 justify-between items-center py-4 w-full whitespace-nowrap bg-white border-b border-solid border-b-zinc-300 min-h-[72px] max-xs:max-w-full'>
						<div className='flex gap-10 items-center self-stretch my-auto text-base min-w-[240px] max-xs:flex-col max-xs:gap-2'>
							<div className='self-stretch my-auto text-zinc-500 w-[100px] max-xs:w-full'>生日</div>
							<div className='self-stretch my-auto font-medium text-zinc-800'>
								{userInfo?.birthday
									? new Date(userInfo.birthday)
											.toLocaleDateString('zh-TW', {
												year: 'numeric',
												month: '2-digit',
												day: '2-digit',
												timeZone: 'Asia/Taipei',
											})
											.replace(/\//g, '/')
									: ''}
							</div>
						</div>
					</div>
					<div className='flex gap-10 items-center py-4 w-full bg-white border-b border-solid border-b-zinc-300 min-h-[72px] max-xs:max-w-full'>
						<div className='flex gap-10 items-center self-stretch my-auto min-w-[240px] max-xs:flex-col max-xs:gap-2 max-xs:max-w-full'>
							<div className='self-stretch my-auto text-base text-zinc-500 w-[100px] max-xs:w-full'>等級</div>
							<div className='flex items-center self-stretch my-auto font-medium min-w-[240px]'>
								<div className='self-stretch my-auto text-base text-zinc-800'>
									單板第{userInfo?.snowboard}級 / 雙板第{userInfo?.skis}級
								</div>
								<button className='flex overflow-hidden gap-1 items-center self-stretch px-3 py-2 my-auto text-sm leading-6 text-center text-blue-600 whitespace-nowrap rounded-lg'>
									<img
										loading='lazy'
										src='https://cdn.builder.io/api/v1/image/assets/TEMP/2854f16019e0ede7a960774d86e8f9deb537742aa708811e0aacbf6d05c51ef9?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f'
										alt=''
										className='object-contain shrink-0 self-stretch my-auto w-5 aspect-square'
									/>
									<span className='self-stretch my-auto'>等級說明</span>
								</button>
							</div>
						</div>
					</div>
					<div className='flex flex-wrap gap-10 justify-between items-center py-4 w-full whitespace-nowrap bg-white border-b border-solid border-b-zinc-300 min-h-[72px] max-xs:max-w-full'>
						<div className='flex gap-10 items-center self-stretch my-auto text-base max-xs:flex-col max-xs:gap-2'>
							<div className='self-stretch my-auto text-zinc-500 w-[100px] max-xs:w-full'>會員編號</div>
							<div className='self-stretch my-auto font-medium text-zinc-800'>{userInfo?.no}</div>
						</div>
					</div>
					<div className='flex flex-wrap gap-10 justify-between items-center py-4 w-full whitespace-nowrap bg-white border-b border-solid border-b-zinc-300 min-h-[72px] max-xs:max-w-full'>
						<div className='flex gap-10 items-center self-stretch my-auto text-base min-w-[240px] max-xs:flex-col max-xs:gap-2 max-xs:min-w-[120px]'>
							<div className='self-stretch my-auto text-zinc-500 w-[100px] max-xs:w-full'>手機號碼</div>
							<div className='self-stretch my-auto font-medium text-zinc-800'>{userInfo?.phone}</div>
						</div>
						<div
							className='overflow-hidden self-stretch px-3 py-2 my-auto text-sm font-medium leading-6 text-center text-blue-600 rounded-lg cursor-pointer hover:text-blue-700'
							onClick={() => setIsChangePhoneModalOpen(true)}
						>
							修改
						</div>
					</div>
					<div className='flex flex-wrap gap-10 justify-between items-center py-4 w-full whitespace-nowrap bg-white  min-h-[72px] max-xs:max-w-full'>
						<div className='flex gap-10 items-center self-stretch my-auto text-base min-w-[240px] max-xs:flex-col max-xs:gap-2'>
							<div className='self-stretch my-auto text-zinc-500 w-[100px] max-xs:w-full'>Email</div>
							<div className='self-stretch my-auto font-medium text-zinc-800'>{userInfo?.email}</div>
						</div>
					</div>
					{userInfo.type === 'E' && (
						<div className='flex flex-wrap gap-10 border-t border-solid border-t-zinc-300 justify-between items-center py-4 w-full whitespace-nowrap bg-white min-h-[76px] max-xs:max-w-full max-xs:gap-0 max-xs:flex-nowrap'>
							<div className='flex gap-10 items-center self-stretch my-auto min-w-[240px] max-xs:flex-col max-xs:gap-2 max-xs:w-full'>
								<div className='text-base text-zinc-500 w-[100px] max-xs:w-full'>登入方式管理</div>
								<div className='flex flex-col relative max-xs:w-full'>
									{userInfo.lineId ? (
										<div className='text-base font-medium text-zinc-800'>已連結您的LINE帳號</div>
									) : (
										<ConnectAccountButton />
									)}
									<div
										className={`mt-1 text-xs leading-none text-zinc-500 absolute ${userInfo.lineId ? 'top-7' : 'top-12'}`}
									>
										<span className='max-xs:hidden'>
											{userInfo.lineId
												? '已開啟LINE快速登入CitySki平台功能'
												: '連結您的LINE帳號後，可以用LINE快速登入CitySki平台'}
										</span>
									</div>
								</div>
							</div>
							{userInfo.lineId && (
								<div
									className='flex flex-col self-stretch pb-1 my-auto text-sm font-medium leading-6 text-center text-blue-600 hover:text-blue-700 cursor-pointer'
									onClick={handleCancelLineLogin}
								>
									<div className='overflow-hidden gap-2.5 self-stretch px-3 py-2 rounded-lg'>取消連結</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			{checkLineOa === 'true' && userInfo.lineId && !userInfo.lineOa && <JoinLineOaModal />}
			<ChangePhoneModal isOpen={isChangePhoneModalOpen} onClose={() => setIsChangePhoneModalOpen(false)} />
		</main>
	);
};

export default PersonalInfo;
