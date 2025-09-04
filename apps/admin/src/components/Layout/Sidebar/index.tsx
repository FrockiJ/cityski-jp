import { useEffect, useState } from 'react';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';

import CoreScrollbar from '@/CIBase/CoreScrollbar';
import { useAnimations } from '@/hooks/useAnimations';
import { ROUTE } from '@/shared/constants/enums';

import Logo from './Logo';
import Nav from './Nav';
import { StyledIconWrapper, StyledLogoWrapper, StyledSidebar } from './styles';

const Sidebar = () => {
	const router = useRouter();
	const { animate, fadeIn } = useAnimations();
	const AnimatedStyledSidebar = animate(StyledSidebar);

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleClick = () => {
		setSidebarOpen((prev) => {
			localStorage.setItem('sidebarOpen', prev ? 'false' : 'true');
			return !prev;
		});
	};
	useEffect(() => {
		const localSidebarOpen = localStorage.getItem('sidebarOpen');
		localSidebarOpen && setSidebarOpen(localSidebarOpen === 'true' ? true : false);
	}, []);

	return (
		<AnimatedStyledSidebar style={fadeIn} isSidebarOpen={sidebarOpen}>
			<StyledIconWrapper onClick={handleClick}>
				{sidebarOpen ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
			</StyledIconWrapper>
			<CoreScrollbar style={{ height: '100vh' }}>
				<Stack height='100vh'>
					<StyledLogoWrapper onClick={() => router.push(ROUTE.DASHBOARD)}>
						<Logo />
					</StyledLogoWrapper>
					<Nav />
				</Stack>
			</CoreScrollbar>
		</AnimatedStyledSidebar>
	);
};

export default Sidebar;
