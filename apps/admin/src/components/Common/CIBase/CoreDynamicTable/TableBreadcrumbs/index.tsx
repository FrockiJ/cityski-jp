import { Fragment } from 'react';

import { useAppSelector } from '@/state/store';

import { StyledTableBreadcrumbsDot, StyledTableBreadcrumbsItem, StyledTableBreadcrumbsWrapper } from '../styles';

const TableBreadcrumbs = () => {
	const activeNav = useAppSelector((state) => state.layout.activeNav);
	const navList = useAppSelector((state) => state.auth.navList);

	// get parent nav name
	const parentRouteObj = navList?.find((item) => item.path === activeNav.activeParent);
	const parentName = parentRouteObj?.name;

	// get child nav name
	const childName = parentRouteObj?.subPages?.find((item) => item.path === activeNav.activeCurrentNav)?.name;

	// assemble breadcrumbs structure
	const breadcrumbsNav = [parentName, childName];

	// console.log({ navList, activeParent, activeCurrentNav });

	return (
		<StyledTableBreadcrumbsWrapper>
			{breadcrumbsNav.includes(undefined)
				? null
				: breadcrumbsNav?.map((item, index) => (
						<Fragment key={index}>
							<StyledTableBreadcrumbsItem key={item} first={index === 0}>
								{item}
							</StyledTableBreadcrumbsItem>
							{index !== breadcrumbsNav.length - 1 && childName && <StyledTableBreadcrumbsDot />}
						</Fragment>
					))}
		</StyledTableBreadcrumbsWrapper>
	);
};

export default TableBreadcrumbs;
