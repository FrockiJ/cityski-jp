'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AuthGuard } from '@/components/Layout/AuthGuard';
import ConfirmLogoutModal from '@/components/Project/Profile/ConfirmLogoutModal';
import Button from '@/components/Project/Shared/Common/Button';
import { selectUserInfo } from '@/state/slices/authSlice';

const MobileMemberPage = () => {
	const userInfo = useSelector(selectUserInfo);
	const router = useRouter();
	const [showConfirmLogout, setShowConfirmLogout] = useState(false);

	const onSectionChange = (section: string) => {
		router.push(`/member?section=${section}`);
	};

	return (
		<div className='h-full w-full bg-white flex flex-col items-center justify-center'>
			<div className='relative z-10 w-full'>
				<div className='h-[120px] rounded-lg border-2 border-neutral-80 bg-white shadow-lg'>
					<div className='flex flex-col p-6 '>
						<div className='flex items-center gap-4'>
							<img
								src={userInfo?.avatar || '/image/profile/default-avatar.png'}
								alt='profile-avatar'
								className='w-[72px] h-[72px] rounded-full'
							/>
							<div className='flex flex-col gap-1'>
								<div className='text-xl font-bold text-black'>{userInfo?.name}</div>
								<div className='flex gap-2'>
									<div className='text-base font-medium text-zinc-500'>單板</div>
									<div className='gap-2.5 self-stretch px-2 my-auto text-xs font-bold text-white bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] rounded-[99px] w-[42px]'>
										LV. {userInfo?.snowboard}
									</div>
									<div className='text-base font-medium text-zinc-500'>雙板</div>
									<div className='gap-2.5 self-stretch px-2 my-auto text-xs font-bold text-white bg-[linear-gradient(116deg,#31BAE7_13.42%,#6E72F0_86.4%)] rounded-[99px] w-[42px]'>
										LV. {userInfo?.skis}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='flex flex-col gap-6 my-8'>
					<div className='text-base font-medium text-zinc-500'>帳戶</div>
					<div className='flex gap-3'>
						<img src='/image/profile/profile.svg' alt='profile' className='w-6 h-6' />
						<button
							onClick={() => onSectionChange('personal-info')}
							className='flex gap-3 w-full justify-between border-b border-zinc-200 pb-3'
						>
							<span>個人資料</span>
							<ChevronRight className='text-zinc-500' />
						</button>
					</div>
					<div className='flex gap-3'>
						<img src='/image/profile/change-pwd.svg' alt='change-pwd' className='w-6 h-6' />
						<button
							onClick={() => onSectionChange('change-password')}
							className='flex gap-3 w-full justify-between border-b border-zinc-200 pb-3'
						>
							<span>修改密碼</span>
							<ChevronRight className='text-zinc-500' />
						</button>
					</div>
					<div className='text-base font-medium text-zinc-500'>我的訂單</div>
					<div className='flex gap-3'>
						<img src='/image/profile/orders.svg' alt='orders' className='w-6 h-6' />
						<button
							onClick={() => onSectionChange('current-orders')}
							className='flex gap-3 w-full justify-between border-b border-zinc-200 pb-3'
						>
							<span>目前預約/訂單</span>
							<ChevronRight className='text-zinc-500' />
						</button>
					</div>
					<div className='flex gap-3'>
						<img src='/image/profile/order-history.svg' alt='order-history' className='w-6 h-6' />
						<button
							onClick={() => onSectionChange('order-history')}
							className='flex gap-3 w-full justify-between border-b border-zinc-200 pb-3'
						>
							<span>訂單紀錄</span>
							<ChevronRight className='text-zinc-500' />
						</button>
					</div>
					<div className='text-base font-medium text-zinc-500'>會員文件</div>
					<div className='flex gap-3'>
						<img src='/image/profile/terms.svg' alt='terms' className='w-6 h-6' />
						<button
							onClick={() => onSectionChange('terms')}
							className='flex gap-3 w-full justify-between border-b border-zinc-200 pb-3'
						>
							<span>課程約定事項</span>
							<ChevronRight className='text-zinc-500' />
						</button>
					</div>
				</div>
			</div>
			<Button className='w-full h-10' variant='secondary' onClick={() => setShowConfirmLogout(true)}>
				登出
			</Button>
			<ConfirmLogoutModal isOpen={showConfirmLogout} onClose={() => setShowConfirmLogout(false)} />
		</div>
	);
};

export default AuthGuard(MobileMemberPage);
