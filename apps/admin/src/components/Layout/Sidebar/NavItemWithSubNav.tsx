import { useEffect, useState } from 'react';
import { Collapse } from '@mui/material';
import { MenuDTO } from '@repo/shared';
import { usePathname } from 'next/navigation';

import { useAppSelector } from '@/state/store';
import { findCurrentParentNav } from '@/utils/general';

import NavItem from './NavItem';
import { StyledSubNav } from './styles';

interface NavItemWithSubNavProps {
	navItem: MenuDTO;
}

const NavItemWithSubNav = ({ navItem }: NavItemWithSubNavProps) => {
	const navList = useAppSelector((state) => state.auth.navList);
	const [isExpanded, setIsExpanded] = useState(false);
	const path = usePathname();

	useEffect(() => {
		const currentActiveParent = findCurrentParentNav(navList);

		setIsExpanded(navItem.path === currentActiveParent);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [path]);

	return (
		<>
			<NavItem
				name={navItem.name}
				icon={navItem.icon}
				path={navItem.path}
				hasSubNav
				isExpanded={isExpanded}
				onClick={() => setIsExpanded(!isExpanded)}
			/>
			<Collapse in={isExpanded} sx={{ width: '100%' }}>
				<StyledSubNav>
					{navItem.subPages?.map((subNavItem, index) => (
						<NavItem
							subNavItem
							key={index.toString()}
							name={subNavItem.name}
							path={subNavItem.path}
							icon={subNavItem.icon}
						/>
					))}
				</StyledSubNav>
			</Collapse>
		</>
	);
};

export default NavItemWithSubNav;
