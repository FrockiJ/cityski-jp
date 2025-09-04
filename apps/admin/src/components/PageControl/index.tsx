import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import CoreBreadcrumb from '@/CIBase/CoreBreadcrumb';
import CoreBreadcrumbItem from '@/CIBase/CoreBreadcrumb/CoreBreadcrumbItem';
import { useAnimations } from '@/hooks/useAnimations';

import { PageTitle, StyledPageControl } from './style';

interface PageControlProps {
	title?: string | string[];
	hasNav?: boolean;
	rightElement?: React.ReactNode;
}

const PageControl = ({ title, hasNav = false, rightElement }: PageControlProps) => {
	const { animate, fadeIn } = useAnimations();
	const AnimatedPageTitle = animate(PageTitle);
	const router = useRouter();

	// states
	const [breadcrumbs, setBreadcrumbs] = useState<
		{
			href: string;
			isCurrent: boolean;
			label: string;
		}[]
	>();

	useEffect(() => {
		const pathWithoutQuery = router.asPath.split('?')[0];
		let pathArray = pathWithoutQuery.split('/');
		pathArray.shift();

		pathArray = pathArray.filter((path) => path !== '');

		const breadcrumbs = pathArray.map((path, index) => {
			const href = '/' + pathArray.slice(0, index + 1).join('/');
			return {
				href,
				isCurrent: index === pathArray.length - 1,
				label: path.charAt(0).toUpperCase() + path.slice(1),
			};
		});

		setBreadcrumbs(breadcrumbs);
	}, [router.asPath]);

	return (
		<StyledPageControl>
			<Box sx={{ flex: '1' }}>
				<AnimatedPageTitle style={fadeIn}>{title}</AnimatedPageTitle>
				{hasNav && (
					<CoreBreadcrumb>
						{breadcrumbs &&
							breadcrumbs.map((breadcrumb: { href: string; isCurrent: boolean; label: string }) => (
								<CoreBreadcrumbItem key={breadcrumb.href} href={breadcrumb.href} isCurrent={breadcrumb.isCurrent}>
									{breadcrumb.isCurrent ? title : breadcrumb.label}
								</CoreBreadcrumbItem>
							))}
					</CoreBreadcrumb>
				)}
			</Box>
			{rightElement && <Box>{rightElement}</Box>}
		</StyledPageControl>
	);
};

export default PageControl;
