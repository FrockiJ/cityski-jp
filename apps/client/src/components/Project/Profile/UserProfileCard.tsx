import React from 'react';
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

	const handleClick = (path: string) => {
		onNavigate(path);
		router.push(path);
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
					<p className='text-xs leading-none text-zinc-500'>{memberNo}</p>
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
