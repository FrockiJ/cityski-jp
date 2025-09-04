import { useState } from 'react';
import Link from 'next/link';

import DownloadIcon from '@/components/Icon/DownloadIcon';
import ShieldIcon from '@/components/Icon/ShieldIcon';
import SuccessIcon from '@/components/Icon/SuccessIcon';

import Agreement from './Agreement';
import Course from './Course';
import Privacy from './Privacy';

export default function Mobile({ menus }) {
	const [id, setId] = useState();
	const menu = menus.find((m) => m.id === id);
	const NAV_LINK = [
		{ title: '首頁', href: '/', icon: '/image/membership/home.svg' },
		{ title: '課程方案', href: '/', icon: '/image/membership/package.svg' },
		{ title: '海外教學', href: '/', icon: '/image/membership/overseas.svg' },
		{ title: '我的訂單', href: '/', icon: '/image/membership/order.svg' },
		{ title: '會員專區', href: '/', icon: '/image/membership/user.svg' },
	];

	return (
		<>
			<section className='xs:hidden'>
				{id ? (
					<>
						<div className='fixed top-0 z-50 p-1 flex bg-white items-center gap-[89px]'>
							<img src='/image/membership/Back.svg' alt='arrow' className='w-10 h-10' onClick={() => setId(null)} />
							<div className='flex-1 text-lg font-medium'>{menu.title}</div>
						</div>
						{id === 1 && <Course />}
						{id === 2 && <Agreement />}
						{id === 3 && <Privacy />}
					</>
				) : (
					<>
						<div className='fixed top-0 z-50 py-3 bg-white text-lg	font-medium	w-full text-center	'>會員條款</div>
						<div className='mt-12'>
							{menus.map((menu) => {
								return (
									<div
										key={menu.id}
										className='flex flex-col justify-center cursor-pointer	'
										onClick={() => setId(menu.id)}
									>
										<div className='pl-5 flex gap-2.5 items-center'>
											{menu.icon === 'success' && <SuccessIcon className='w-6 h-6' />}
											{menu.icon === 'download' && <DownloadIcon className='w-6 h-6' />}
											{menu.icon === 'shield' && <ShieldIcon className='w-6 h-6' />}
											<div className='flex justify-between items-center w-full py-3 pr-2 border-b-[1px] border-[#EDEDED]'>
												<div>{menu.title}</div>
												<img src='/image/membership/Arrow right.svg' alt='arrow' />
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</section>
			<div className='fixed right-0 bottom-0 z-50 left-0 m-0 mt-auto bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.06)] xs:hidden'>
				<nav>
					<ul className='flex list-none p-0'>
						{NAV_LINK.map((nav) => (
							<li
								key={nav.title}
								className='min-w-[calc(100%/5)] min-h-[50px] flex flex-col gap-0.5 justify-center items-center'
							>
								<img src={nav.icon} alt={nav.title} className='w-6 h-6' />
								<Link href={nav.href} className='text-[11px] text-[#565656]'>
									{nav.title}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</>
	);
}
