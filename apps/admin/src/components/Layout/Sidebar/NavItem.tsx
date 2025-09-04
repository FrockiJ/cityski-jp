import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import ChevronIcon from '@/Icon/ChevronIcon';
import ContentManagementIcon from '@/Icon/Nav/ContentManagementIcon';
import CourseProductsIcon from '@/Icon/Nav/CourseProductsIcon';
import DashboardIcon from '@/Icon/Nav/DashboardIcon';
import FrontendMemberManagementIcon from '@/Icon/Nav/FrontendMemberManagementIcon';
import NoteIcon from '@/Icon/Nav/NoteIcon';
import OrderManagementIcon from '@/Icon/Nav/OrderManagementIcon';
import PermissionsPersonnelIcon from '@/Icon/Nav/PermissionsPersonnelIcon';
import PromotionSettingsIcon from '@/Icon/Nav/PromotionSettingsIcon';
import ReportsIcon from '@/Icon/Nav/ReportsIcon';
import { NavIconName } from '@/shared/constants/enums';
import { setActiveNav } from '@/state/slices/layoutSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import { NavItemLink, StyledNavItem } from './styles';

interface NavItemProps {
	name: string;
	path: string;
	icon?: NavIconName;
	hasSubNav?: boolean;
	subNavItem?: boolean;
	isExpanded?: boolean;
	onClick?: () => void;
}

const NavItem = ({ name, path, icon, hasSubNav, subNavItem, isExpanded, onClick }: NavItemProps) => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	// entire nav list
	const navList = useAppSelector((state) => state.auth.navList);

	// get currently selected nav from redux store
	const activeNav = useAppSelector((state) => state.layout.activeNav);
	const currentParentNav = activeNav.activeParent; // active parent

	// get the current path from url
	const currentPath = usePathname();

	// check if current path is equal to parent nav path
	const atParentRoute = currentPath === currentParentNav;

	// determine if parent nav list is active
	let activeParentNav = false;

	// when at the parent nav route
	if (atParentRoute) {
		// make parent active if the "path" property is the EXACT parent route
		if (path == currentParentNav) {
			activeParentNav = true;
		}
	} else {
		// make parent active when child is included in the route
		activeParentNav = currentPath.includes(path ?? '');
	}

	// read the icon props and return the corresponding icon component
	const renderIcon = (iconType?: NavIconName) => {
		switch (iconType) {
			case NavIconName.DASHBOARD: {
				return <DashboardIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.RESERVATION_MANAGEMENT: {
				return <NoteIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.ORDER_MANAGEMENT: {
				return <OrderManagementIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.COURSE_PRODUCTS: {
				return <CourseProductsIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.FRONTEND_MEMBER_MANAGEMENT: {
				return <FrontendMemberManagementIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.PERMISSIONS_PERSONNEL: {
				return <PermissionsPersonnelIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.PROMOTION_SETTINGS: {
				return <PromotionSettingsIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.CONTENT_MANAGEMENT: {
				return <ContentManagementIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			case NavIconName.REPORTS: {
				return <ReportsIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
			default: {
				if (subNavItem) return null;
				return <NoteIcon color={activeParentNav ? 'primary' : 'inherit'} />;
			}
		}
	};

	const handleClick = () => {
		// find current path's parent nav path
		const parentOfPath = navList.find((nav) => path?.includes(nav.path))?.path ?? '';

		if (path && !hasSubNav) {
			router.push(path);

			dispatch(
				setActiveNav({
					activeParent: parentOfPath,
					activeCurrentNav: path,
				}),
			);
		}
		onClick?.();
	};

	return (
		<StyledNavItem
			{...(!hasSubNav && {
				component: 'a',
			})}
			fullWidth
			size='large'
			name={name}
			active={subNavItem ? false : activeParentNav}
			subNavItem={subNavItem}
			onClick={handleClick}
		>
			<Box display='flex' flex='1' gap='16px'>
				{/* Uncomment if an icon is required in the NAV's UI Design */}
				{renderIcon(icon)}
				<NavItemLink subNavItem={subNavItem} active={currentPath === path}>
					{name}
				</NavItemLink>
			</Box>
			{hasSubNav && (
				<ChevronIcon
					direction={isExpanded ? 'down' : 'right'}
					color={activeParentNav ? 'primary' : 'action'}
					sx={{ fontSize: 16 }}
				/>
			)}
		</StyledNavItem>
	);
};

export default NavItem;
