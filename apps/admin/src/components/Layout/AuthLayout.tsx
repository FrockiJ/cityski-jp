import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import CoreScrollbar from '@/CIBase/CoreScrollbar';
import CoreScrollTo from '@/CIBase/CoreScrollTo';

import Header from './Header';
import Sidebar from './Sidebar';
import { MainContent, MainWrapper } from './styles';

interface AuthLayoutProps {
	children: ReactNode;
}
/**
 * Auth Layout
 * --
 * @description for authenticated / restricted pages
 * You may customize this to fit your app, by default this shows the sidebar and
 * app header. The most default use case for this is as the layout for pages after
 * a user logs in, showing the navigation contents and user info in the header.
 *
 * If your application needs this to be shown even for users without login please
 * change the conditional inside the AppLayout component.
 */
const AuthLayout = ({ children }: AuthLayoutProps) => {
	const [showScrollToBtn, setShowScrollToBtn] = useState(false);
	const elementRef = useRef<any>();
	const router = useRouter();
	const handleScroll = useCallback(() => {
		const target = elementRef.current?.firstChild;
		setShowScrollToBtn(target.getBoundingClientRect().bottom < target.offsetHeight + 108);
	}, []);

	const handleScrollToClick = (behavior?: 'auto' | 'smooth') => {
		elementRef.current?.scrollTo({
			top: 0,
			behavior: behavior ? 'smooth' : 'auto',
		});
	};

	useEffect(() => {
		handleScrollToClick();
		const divElement = elementRef.current;
		divElement?.addEventListener('scroll', handleScroll);
		return () => divElement?.removeEventListener('scroll', handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	return (
		<Box display='flex' width='100%'>
			{/* Navigation Bar */}
			<Sidebar />
			<MainWrapper>
				{/* Header Bar */}
				<Header />
				{/* Main Content Area */}
				<CoreScrollbar
					forceVisible='y'
					autoHide={false}
					style={{
						height: 'calc(100vh - 76px)',
						width: '100%',
						margin: 'auto',
					}}
					scrollableNodeProps={{ ref: elementRef }}
				>
					<MainContent>
						{/* Page contents in /pages folder render here */}
						{/* <AuthGuard>{children}</AuthGuard> */}
						{children}
						{/* Scroll to Top Button */}
						{showScrollToBtn && <CoreScrollTo click={handleScrollToClick} />}
					</MainContent>
				</CoreScrollbar>
			</MainWrapper>
		</Box>
	);
};

export default AuthLayout;
