import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfileCardProps {
	name: string;
	memberNo: string;
	avatarSrc: string;
	onLogout: () => void;
	onNavigate: (path: string) => void;
}

const UserProfileCard = ({ name, memberNo, avatarSrc, onLogout, onNavigate }: UserProfileCardProps) => {
	const router = useRouter();
	const [isCopied, setIsCopied] = useState(false);

	const handleClick = (path: string) => {
		onNavigate(path);
		router.push(path);
	};

	const handleCopyMemberNo = async () => {
		try {
			await navigator.clipboard.writeText(memberNo);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	const menuOptions = [
		{
			icon: '/image/profile/profile.svg',
			label: '個人資料',
			ariaLabel: 'View personal profile',
			onClick: () => handleClick(`/member?section=personal-info`),
			path: `/member?section=personal-info`,
		},
		{
			icon: '/image/profile/orders.svg',
			label: '目前預約 / 訂單',
			ariaLabel: 'View current reservations and orders',
			onClick: () => handleClick(`/member?section=current-orders`),
			path: `/member?section=current-orders`,
		},
		{
			icon: '/image/profile/logout.svg',
			label: '登出',
			ariaLabel: 'Log out',
			onClick: onLogout,
			path: '',
		},
	];

	return (
		<section
			className='flex overflow-hidden flex-col p-2 bg-white rounded-xl border border-solid shadow-sm border-zinc-300 w-[200px]'
			aria-label='User Profile Card'
		>
			<header className='flex gap-2.5 items-center p-2 w-full whitespace-nowrap'>
				<img
					loading='lazy'
					src={avatarSrc || '/image/profile/default-avatar.png'}
					alt={`${name}'s avatar`}
					className='object-contain shrink-0 self-stretch my-auto w-11 aspect-square rounded-[99px]'
				/>
				<div className='flex flex-col flex-1 shrink justify-center self-stretch pb-0.5 my-auto basis-0'>
					<h2 className='text-sm font-medium leading-6 text-zinc-800'>{name}</h2>
					<div className='flex items-center gap-1'>
						<p className='text-xs leading-none text-zinc-500'>{memberNo}</p>
						<button
							onClick={handleCopyMemberNo}
							className='group relative flex items-center justify-center w-4 h-4 hover:opacity-70 transition-opacity'
							aria-label='複製會員編號'
							title={isCopied ? '已複製!' : '複製會員編號'}
						>
							{isCopied ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
									className='w-3.5 h-3.5 text-green-500'
								>
									<path
										fillRule='evenodd'
										d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
										clipRule='evenodd'
									/>
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
									className='w-3.5 h-3.5 text-zinc-500'
								>
									<path d='M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z' />
									<path d='M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z' />
								</svg>
							)}
						</button>
					</div>
				</div>
			</header>
			<div className='flex flex-col justify-center p-2 w-full bg-white rounded-lg'>
				<div className='flex w-full bg-zinc-300 min-h-[1px]' role='separator' aria-hidden='true' />
			</div>
			<nav aria-label='User profile options'>
				{menuOptions.map((option, index) => (
					<React.Fragment key={option.label}>
						<button
							className='group flex flex-col justify-center px-3 py-2 w-full text-sm leading-6 bg-white rounded-lg text-zinc-500 hover:bg-[#2B2B2B] hover:text-white focus:outline-none'
							aria-label={option.ariaLabel}
							onClick={option.onClick}
						>
							<div className='flex gap-2 items-center w-full'>
								<img
									loading='lazy'
									src={option.icon}
									alt=''
									className='object-contain shrink-0 self-stretch my-auto w-5 aspect-square group-hover:brightness-0 group-hover:invert'
									aria-hidden='true'
								/>
								<span className='self-stretch my-auto'>{option.label}</span>
							</div>
						</button>
						{index === 1 && (
							<div className='flex flex-col justify-center p-2 w-full bg-white rounded-lg'>
								<div className='flex w-full bg-zinc-300 min-h-[1px]' role='separator' aria-hidden='true' />
							</div>
						)}
					</React.Fragment>
				))}
			</nav>
		</section>
	);
};

export default UserProfileCard;
