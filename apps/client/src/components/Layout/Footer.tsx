import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import FacebookIcon from '../Icon/FacebookIcon';
import InstagramIcon from '../Icon/InstagramIcon';
import LogoIcon from '../Icon/LogoIcon';
import YouTubeIcon from '../Icon/YouTubeIcon';

import MobileFooter from './MobileFooter';

const FOOTER_NAV_LINK = [
	{ title: '課程方案', href: '/courses' },
	{ title: '海外教學', href: '/overseas' },
	{ title: '會員專區', href: '/member?section=personal-info' },
	{ title: '聯絡我們', href: '/contact-us' },
	{ title: '會員條款', href: '/terms-and-conditions' },
];

const FOOTER_SHARE_LINK = [
	{ image: FacebookIcon, href: '/' },
	{ image: InstagramIcon, href: '/' },
	{ image: YouTubeIcon, href: '/' },
];

export default function Footer() {
	const pathname = usePathname();
	const isOverseasCourses = pathname.includes('/overseas');

	return (
		<div className='xs:min-w-[inherit] overflow-hidden'>
			<div className='relative h-[344px] xs:h-[520px] bg-gradient-to-t from-[#D7ECF5] from-60% to-white'>
				<Image
					src={isOverseasCourses ? '/image/footer/footer_bg_2.png' : '/image/footer/footer_bg.webp'}
					alt='footer-bg'
					width={1920}
					height={380}
					className='absolute min-w-[924px] min-h-[184px] xs:min-w-[1920px] xs:min-h-[380px] bottom-0 left-1/2 transform -translate-x-1/2'
				/>
			</div>

			<div className='container'>
				<footer className='min-h-[130px] flex justify-between items-start xs:items-center flex-col-reverse xs:flex-row text-[#97A4B2] gap-8 pt-8 pb-[5rem] xs:py-0'>
					<div className='flex flex-col gap-2'>
						<LogoIcon className='w-[90px] h-[18.5px]' />
						<div className='text-xs'>© 2024 CitySki. All rights reserved.</div>
					</div>
					<div>
						<ul className='flex flex-col xs:flex-row list-none p-0 text-sm gap-3 xs:gap-6'>
							{FOOTER_NAV_LINK.map((nav) => (
								<li key={nav.title} className='text-[#97A4B2] hover:text-opacity-70 duration-300'>
									<Link href={nav.href}>{nav.title}</Link>
								</li>
							))}
						</ul>
					</div>
					<div className='flex gap-[14px]'>
						{FOOTER_SHARE_LINK.map((nav, index) => (
							<Link href={nav.href} key={index}>
								<nav.image className='w-6 h-6 text-[#97A4B2] hover:text-opacity-70 duration-300' />
							</Link>
						))}
					</div>
				</footer>
				<MobileFooter />
			</div>
		</div>
	);
}
