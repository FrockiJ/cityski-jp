'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import UserIcon from '@/components/Icon/UserIcon';
import CourseNavigation from '@/components/Project/Courses/CourseDetail/CourseNavigation';
import Profile from '@/components/Project/Profile';
import ConfirmLogoutModal from '@/components/Project/Profile/ConfirmLogoutModal';
import DividerIcon from '@/components/Project/Profile/DividerIcon';
import { Button } from '@/components/ui/button';
import { selectToken, selectUserInfo } from '@/state/slices/authSlice';

import LogoIcon from '../Icon/LogoIcon';

const NAV_LINK = [
	{ title: '課程方案', href: '/courses' },
	{ title: '海外教學', href: '/overseas' },
	{ title: '我的訂單', href: '/member?section=current-orders' },
];

export default function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const section = searchParams.get('section');
	const pathParts = pathname.split('/').filter(Boolean);
	const isNestedRoute = pathParts.length > 1;
	const parentRoute = isNestedRoute ? `/${pathParts[0]}` : null;
	const isRootRoute = pathname === '/';
	const isOverseasCoursesRoute = pathname === '/overseas';
	const isCourseDetailRoute =
		pathname.startsWith('/courses/') && pathname !== '/courses' && !pathname.endsWith('/order');
	const [showCourseNav, setShowCourseNav] = useState(false);
	const [showConfirmLogout, setShowConfirmLogout] = useState(false);
	const [isInCourseSection, setIsInCourseSection] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [headerTitle, setHeaderTitle] = useState<string | null>(null);

	useEffect(() => {
		const handleScroll = (e: any) => {
			const scrollPosition = e.target.scrollTop;
			if (isCourseDetailRoute) {
				setShowCourseNav(scrollPosition > 100);
			}
			if (isOverseasCoursesRoute) {
				setIsScrolled(scrollPosition > 650);
			}
		};

		const simpleBarElement = document.querySelector('.simplebar-content-wrapper');

		if (simpleBarElement) {
			simpleBarElement.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				simpleBarElement.removeEventListener('scroll', handleScroll);
			};
		}
	}, [isCourseDetailRoute, isOverseasCoursesRoute]);

	useEffect(() => {
		const handleCourseSectionIntersect = (event: CustomEvent) => {
			const boundingClientRect = event.detail.boundingClientRect;
			setIsInCourseSection(event.detail.isIntersecting || boundingClientRect.top < 0);
		};

		window.addEventListener('courseSectionIntersect', handleCourseSectionIntersect as EventListener);

		return () => {
			window.removeEventListener('courseSectionIntersect', handleCourseSectionIntersect as EventListener);
		};
	}, []);

	const userInfo = useSelector(selectUserInfo);
	const accessToken = useSelector(selectToken);

	// Update header title based on the route and section
	useEffect(() => {
		console.log('Current pathname:', pathname);
		console.log('Current section:', section);

		// Check for section first
		if (pathname.startsWith('/member') && section) {
			console.log('Section detected:', section);
			switch (section) {
				case 'personal-info':
					setHeaderTitle('個人資料');
					break;
				case 'change-password':
					setHeaderTitle('修改密碼');
					break;
				case 'current-orders':
					setHeaderTitle('目前預約/訂單');
					break;
				case 'order-history':
					setHeaderTitle('訂單紀錄');
					break;
				case 'terms':
					setHeaderTitle('課程約定事項');
					break;
				default:
					setHeaderTitle(null);
			}
		} else if (pathname === '/member') {
			// Only set to 會員專區 if there's no section
			console.log('Setting title to 會員專區');
			setHeaderTitle('會員專區');
		} else {
			setHeaderTitle(null);
		}
		console.log('Header title set to:', headerTitle);
	}, [pathname, section, searchParams]);

	const handleBack = () => {
		if (section) {
			router.push('/member/home');
		} else if (parentRoute) {
			console.log('parentRoute', parentRoute);
			if (parentRoute === '/member') {
				router.push('/');
			} else {
				router.push(parentRoute);
			}
		}
	};

	return (
		<div
			className={`max-w-[1920px] mx-auto w-full fixed z-40 top-0 ${
				(isRootRoute && !isInCourseSection) || (isOverseasCoursesRoute && !isScrolled)
					? 'xs:bg-transparent'
					: 'bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10),0px_1px_16px_0px_rgba(0,0,0,0.05)]'
			} xs:min-w-[inherit]`}
		>
			<div className='w-[1200px] m-[auto] max-xs:bg-white'>
				<header className='min-h-12 xs:min-h-[72px] flex items-center justify-center xs:justify-between'>
					{/* Show back arrow, title on mobile for nested routes, show logo otherwise */}
					<div className='xs:hidden flex items-center w-full'>
						{(isNestedRoute || section) && (
							<button onClick={handleBack} className='absolute left-4 p-2 pl-0' aria-label='Back'>
								<ChevronLeft className='w-6 h-6 text-neutral-900' />
							</button>
						)}
						<div className='flex-1 text-center'>
							{headerTitle ? (
								<h1 className='text-xl font-medium'>{headerTitle}</h1>
							) : (
								<Link href='/'>
									<LogoIcon className='w-[77px] h-4 hover:text-opacity-70 duration-300 text-[#2B2B2B] mx-auto' />
								</Link>
							)}
						</div>
					</div>

					{/* Always show logo on desktop */}
					<div className='hidden xs:block'>
						<Link href='/'>
							<LogoIcon
								className={`w-[104px] h-[21px] hover:text-opacity-70 duration-300 
								${(isRootRoute && !isInCourseSection) || (isOverseasCoursesRoute && !isScrolled) ? 'text-neutral-90 xs:text-white' : 'text-[#2B2B2B]'}`}
							/>
						</Link>
					</div>

					{/* Rest of the header content */}
					<div className='hidden xs:block'>
						<div className='flex items-center'>
							<nav>
								<ul className='flex space-x-8 list-none p-0'>
									{NAV_LINK.map((nav) => (
										<li
											key={nav.title}
											className={`text-sm font-medium hover:text-opacity-70 duration-300 
											${(isRootRoute && !isInCourseSection) || (isOverseasCoursesRoute && !isScrolled) ? 'text-white' : 'text-[#2B2B2B]'}`}
										>
											<Link href={nav.href}>{nav.title}</Link>
										</li>
									))}
								</ul>
							</nav>
							{userInfo && accessToken ? (
								<>
									<DividerIcon
										className={`mx-8 ${(isRootRoute && !isInCourseSection) || (isOverseasCoursesRoute && !isScrolled) ? 'text-white' : 'text-[#2B2B2B]'}`}
									/>
									<Profile
										src={userInfo.avatar}
										name={userInfo.name}
										memberNo={userInfo.no}
										onLogout={() => {
											setShowConfirmLogout(true);
										}}
									/>
								</>
							) : (
								<Button
									variant='outline'
									onClick={() => router.push('/login')}
									className={`ml-8 rounded-full duration-300 
										${
											(isRootRoute && !isInCourseSection) || (isOverseasCoursesRoute && !isScrolled)
												? 'bg-transparent text-white hover:bg-white hover:bg-opacity-20 hover:text-[#FE696C] hover:border hover:border-[#FE696C]'
												: 'bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] hover:bg-[linear-gradient(99deg,#ff5c5f_0%,#ff7e3d_100%)] text-white hover:text-white'
										}`}
								>
									<UserIcon className='mr-1 w-[18px] h-[18px]' />
									登入
								</Button>
							)}
						</div>
					</div>
				</header>
			</div>

			{/* Course Navigation - show on all devices */}
			{isCourseDetailRoute && showCourseNav && (
				<div className='transform transition-transform duration-300 ease-in-out bg-white mx-auto max-w-[1280px]'>
					<CourseNavigation />
				</div>
			)}

			<ConfirmLogoutModal isOpen={showConfirmLogout} onClose={() => setShowConfirmLogout(false)} />
		</div>
	);
}
