import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';

import CoreBasicModal from '@/CIBase/CoreModal/CoreBasicModal';
import CoreMessageModal from '@/CIBase/CoreModal/CoreMessageModal';
import { useDetectPageRouting } from '@/hooks/useDetectPageRouting';
import useExcludeAuthPath from '@/hooks/useExcludeAuthPath';
import useIsAuthorized from '@/hooks/useIsAuthorized';
import { setActiveNav } from '@/state/slices/layoutSlice';
import { setTablePageManager } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';
import { findCurrentParentNav } from '@/utils/general';

import AuthLayout from './AuthLayout';
import DefaultLayout from './DefaultLayout';
import { AppWrapper } from './styles';
import TransitionLayout from './TransitionLayout';

interface AppLayoutProps {
	children: React.ReactNode;
}

/**
 * App Layout Component
 *
 * This Higher-Order Component (HoC) serves as the root layout wrapper for the application.
 * It provides dynamic layout management depending on the user's authentication status.
 *
 * Features:
 * - Includes both authenticated and non-authenticated layouts.
 * - Authenticated layout includes a header, sidebar, and main content area.
 * - Non-authenticated layout uses a simple wrapper for minimal presentation.
 * - Manages layout transitions and page routing indicators.
 * - Automatically resets table pagination and updates navigation states.
 *
 * @param {AppLayoutProps} props - The properties of the component.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 *
 * @returns {JSX.Element} The rendered application layout.
 */
const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const navList = useAppSelector((state) => state.auth.navList);
	const layoutTransition = useAppSelector((state) => state.layout.layoutTransition);
	const router = useRouter();
	const { pageRouting } = useDetectPageRouting();

	// Detect the authorized status of the user
	const isAuthorized = useIsAuthorized();

	// Detect if the current route is a non-authenticated route
	const { isExcludeAuthPath } = useExcludeAuthPath();

	useEffect(() => {
		const currentParentNav = findCurrentParentNav(navList);

		// Reset table pagination to the first page
		dispatch(
			setTablePageManager({
				table1: {
					currentPage: 1,
					currentPerPage: 10,
				},
			}),
		);

		// Update the active navigation path
		dispatch(
			setActiveNav({
				activeParent: currentParentNav,
				activeCurrentNav: router.pathname,
			}),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AppWrapper>
			{/* Display a transition layout during layout transitions or page routing */}
			{(pageRouting || layoutTransition) && <TransitionLayout />}
			{/* Toast notifications */}
			<ToastContainer hideProgressBar autoClose={3000} />
			{/* Render authenticated or default layout based on user's status */}
			{isAuthorized && !isExcludeAuthPath ? (
				<AuthLayout>{children}</AuthLayout>
			) : (
				<DefaultLayout>{children}</DefaultLayout>
			)}
			{/* Global modals */}
			<CoreBasicModal />
			<CoreMessageModal />
		</AppWrapper>
	);
};

export default AppLayout;
