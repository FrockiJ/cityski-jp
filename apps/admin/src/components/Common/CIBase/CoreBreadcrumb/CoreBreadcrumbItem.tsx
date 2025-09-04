import { ReactNode } from 'react';

import { BreadcrumbLink } from './styles';

interface BreadcrumbItemProps {
	children: ReactNode;
	href: string;
	isCurrent: boolean;
}

const BreadcrumbItem = ({ children, isCurrent, ...props }: BreadcrumbItemProps) => (
	<li {...props}>
		{/* <Link href={href} passHref> */}
		<BreadcrumbLink isCurrent={isCurrent} aria-current={isCurrent ? 'page' : 'false'}>
			{children}
		</BreadcrumbLink>
		{/* </Link> */}
	</li>
);

export default BreadcrumbItem;
