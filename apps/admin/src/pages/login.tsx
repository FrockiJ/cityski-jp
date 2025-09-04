import { Box, Stack } from '@mui/material';
import { StyledLeft, StyledLeftWrapper, StyledRight, StyledWrapper } from 'src/styles/pages/loginPageStyles';

import CoreLoginForm from '@/CIBase/CoreForm/CoreLoginForm';
import Logo from '@/components/Layout/Sidebar/Logo';
import { useAnimations } from '@/hooks/useAnimations';

const Login = () => {
	const { animate, fadeIn } = useAnimations({ delay: 200 });
	const AnimatedBox = animate(StyledWrapper);

	return (
		<AnimatedBox style={fadeIn}>
			<StyledLeft>
				<StyledLeftWrapper>
					<Logo />
					<Stack sx={{ justifyContent: 'center', height: '100%' }}>
						<Box sx={{ typography: 'h3', color: 'text.primary' }}>嗨！歡迎回來</Box>
						<Box component='img' src='/images/login/welcome.svg' sx={{ marginTop: 40, padding: '0 9px' }} />
					</Stack>
				</StyledLeftWrapper>
			</StyledLeft>
			<StyledRight>
				<Box sx={{ maxWidth: 480 }}>
					<CoreLoginForm />
				</Box>
			</StyledRight>
		</AnimatedBox>
	);
};

export default Login;
