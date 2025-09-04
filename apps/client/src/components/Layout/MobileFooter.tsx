import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function MobileFooter() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const section = searchParams.get('section');

	const NAV_LINK = [
		{
			title: '首頁',
			href: '/',
			icon: '/image/footer/mobile/home.svg',
			activeIcon: '/image/footer/mobile/home-active.svg',
		},
		{
			title: '課程方案',
			href: '/courses',
			icon: '/image/footer/mobile/courses.svg',
			activeIcon: '/image/footer/mobile/courses-active.svg',
		},
		{
			title: '海外教學',
			href: '/overseas',
			icon: '/image/footer/mobile/overseas.svg',
			activeIcon: '/image/footer/mobile/overseas-active.svg',
		},
		{
			title: '我的訂單',
			href: '/member?section=current-orders',
			icon: '/image/footer/mobile/orders.svg',
			activeIcon: '/image/footer/mobile/orders-active.svg',
		},
		{
			title: '會員專區',
			href: '/member/home',
			icon: '/image/footer/mobile/member.svg',
			activeIcon: '/image/footer/mobile/member-active.svg',
		},
	];

	if (pathname.includes('/courses')) return <div className='h-[20px]'></div>;
	return (
		<div className='fixed right-0 bottom-0 z-50 left-0 m-0 mt-auto bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.06)] xs:hidden'>
			<nav>
				<ul className='flex list-none p-0'>
					{NAV_LINK.map((nav) => {
						const isActive = nav.href.includes('?')
							? pathname === nav.href.split('?')[0] && section === nav.href.split('section=')[1]
							: pathname === nav.href && !section;

						return (
							<li
								key={nav.title}
								className='min-w-[calc(100%/5)] min-h-[50px] flex flex-col gap-0.5 justify-center items-center'
							>
								<img src={isActive ? nav.activeIcon : nav.icon} alt={nav.title} className='w-6 h-6' />
								<Link
									href={nav.href}
									className={`text-[11px] text-[#565656] ${isActive ? 'font-bold' : 'font-normal'}`}
								>
									{nav.title}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
