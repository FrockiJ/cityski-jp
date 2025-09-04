import { ReactNode } from 'react';
import { Box } from '@mui/material';

import { useAnimations } from '@/hooks/useAnimations';

interface DefaultLayoutProps {
	children: ReactNode;
}

/**
 * Default Layout
 * --
 * @description for non-authenticated or public pages
 * You may customize this to fit your app, by default this removes sidebar and
 * app header. The most default use case for this layout is for login / register
 * pages, but you may need it for pages that require login.
 */
const DefaultLayout = ({ children }: DefaultLayoutProps) => {
	const { animate, fadeIn } = useAnimations({ delay: 350 });
	const AnimatedBox = animate(Box);

	return (
		<Box display='flex' width='100%'>
			<AnimatedBox style={fadeIn}>{children}</AnimatedBox>
		</Box>
	);
};

export default DefaultLayout;
