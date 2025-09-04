'use client';

import React from 'react';
import { useSelector } from 'react-redux';

import { selectUserInfo } from '@/state/slices/authSlice';

interface SidebarProps {
	memberId: string;
	activeSection: string;
	onSectionChange: (section: string) => void;
}

const Sidebar = ({ memberId, activeSection, onSectionChange }: SidebarProps) => {
	const userInfo = useSelector(selectUserInfo);
	const menuItems = [
		{
			section: '帳戶',
			items: [
				{
					id: 'personal-info',
					label: '個人資料',
					icon: '/image/profile/profile.svg',
				},
				{
					id: 'change-password',
					label: '修改密碼',
					icon: '/image/profile/change-pwd.svg',
				},
			],
		},
		{
			section: '我的訂單',
			items: [
				{
					id: 'current-orders',
					label: '目前預約/訂單',
					icon: '/image/profile/orders.svg',
				},
				{
					id: 'order-history',
					label: '訂單紀錄',
					icon: '/image/profile/order-history.svg',
				},
			],
		},
		{
			section: '會員文件',
			items: [
				{
					id: 'terms',
					label: '課程約定事項',
					icon: '/image/profile/terms.svg',
				},
			],
		},
	];

	return (
		<aside className='flex flex-col w-[320px] max-xs:ml-0 max-xs:w-full'>
			<div className='flex overflow-hidden flex-col px-6 pb-6 mx-auto w-full bg-white rounded-2xl border border-solid border-zinc-300 max-xs:px-5 max-xs:mt-6'>
				<div className='flex gap-4 py-8 bg-white border-b border-solid border-b-zinc-300 max-xs:pr-5'>
					<img
						loading='lazy'
						src={userInfo?.avatar || '/image/profile/default-avatar.png'}
						alt='User profile'
						className='object-contain shrink-0 aspect-square rounded-[99px] w-[72px]'
					/>
					<div className='flex flex-col my-auto'>
						<div className='self-start text-xl font-medium leading-snug text-zinc-800'>{userInfo?.name}</div>
						<div className='flex gap-4 items-center mt-2'>
							<div className='flex gap-1 items-center self-stretch my-auto'>
								<div className='self-stretch my-auto text-sm font-medium text-zinc-500'>單板</div>
								<div className='gap-2.5 self-stretch px-2 my-auto text-xs font-bold text-white bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] rounded-[99px] w-[42px]'>
									LV. {userInfo?.snowboard}
								</div>
							</div>
							<div className='flex gap-1 items-center self-stretch my-auto'>
								<div className='self-stretch my-auto text-sm font-medium text-zinc-500'>雙板</div>
								<div className='gap-2.5 self-stretch px-2 my-auto text-xs font-bold text-white bg-[linear-gradient(116deg,#31BAE7_13.42%,#6E72F0_86.4%)] rounded-[99px] w-[42px]'>
									LV. {userInfo?.skis}
								</div>
							</div>
						</div>
					</div>
				</div>
				<nav className='flex flex-col mt-6 whitespace-nowrap gap-4'>
					{menuItems.map((menu) => (
						<div key={menu.section} className='flex flex-col w-full'>
							<h2 className='text-base font-medium text-zinc-800'>{menu.section}</h2>
							<ul className='flex flex-col mt-2 w-full text-sm leading-6'>
								{menu.items.map((item) => (
									<li key={item.id}>
										<button
											onClick={() => onSectionChange(item.id)}
											className={`group flex flex-col justify-center px-3 py-2.5 w-full rounded-lg transition-all duration-200
												${activeSection === item.id ? 'text-white bg-zinc-800' : 'bg-white text-zinc-500 hover:bg-zinc-100'}`}
										>
											<div className='flex gap-2 items-center w-full'>
												<img
													loading='lazy'
													src={item.icon}
													alt=''
													className={`object-contain shrink-0 self-stretch my-auto w-5 aspect-square transition-all duration-200
														${activeSection === item.id ? 'brightness-0 invert' : 'group-hover:brightness-0 group-hover:invert-[0.5]'}`}
												/>
												<span className='self-stretch my-auto'>{item.label}</span>
											</div>
										</button>
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>
			</div>
		</aside>
	);
};

export default Sidebar;
