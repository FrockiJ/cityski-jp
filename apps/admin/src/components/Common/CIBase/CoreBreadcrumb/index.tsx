import { Children, Fragment, ReactNode } from 'react';

import { BreadcrumbDivider, BreadcrumbList } from './styles';

interface CoreBreadcrumbProps {
	children: ReactNode;
	href?: string;
}

const CoreBreadcrumb = ({ children }: CoreBreadcrumbProps) => {
	const childrenArray = Children.toArray(children);

	const childrenWithSeparator = childrenArray.map((child, index) => {
		if (index !== childrenArray.length - 1) {
			return (
				<Fragment key={index}>
					{child}
					<BreadcrumbDivider />
				</Fragment>
			);
		}
		return child;
	});

	return (
		<nav aria-label='breadcrumb'>
			<BreadcrumbList>{childrenWithSeparator}</BreadcrumbList>
		</nav>
	);
};

export default CoreBreadcrumb;
