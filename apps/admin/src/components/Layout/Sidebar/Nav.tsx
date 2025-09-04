import { useAppSelector } from '@/state/store';

import NavItem from './NavItem';
import NavItemWithSubNav from './NavItemWithSubNav';
import { NavItemGroupName, NavItemWrapper, StyledNav } from './styles';

const Nav = () => {
	const navList = useAppSelector((state) => state.auth.navList);
	const groupNameList = Object.groupBy(navList, (nav) => nav.groupName);

	return (
		<StyledNav>
			{Object.entries(groupNameList).map(([key, list], i) => (
				<ul key={i}>
					{key && <NavItemGroupName>{key}</NavItemGroupName>}
					{list?.map((x, i) => (
						<NavItemWrapper key={i}>
							{x.subPages && x.subPages.length > 0 ? (
								// loop through inner sub navigation list
								<NavItemWithSubNav navItem={x} />
							) : (
								// loop through outer navigation list
								<NavItem name={x.name} path={x.path} icon={x.icon} />
							)}
						</NavItemWrapper>
					))}
				</ul>
			))}
		</StyledNav>
	);
};

export default Nav;
