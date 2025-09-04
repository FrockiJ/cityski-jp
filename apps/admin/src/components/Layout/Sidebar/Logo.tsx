import { useTheme } from '@mui/material';

import CoreTrail from '@/CIBase/CoreEffects/CoreTrail';
import { useAnimations } from '@/hooks/useAnimations';
import LogoIcon from '@/Icon/LogoIcon';

import { StyledLogo, StyleLogoText } from './styles';

interface LogoProps {
	textOne?: string;
	textTwo?: string;
	absolute?: boolean;
}

const Logo = ({ textOne, textTwo, absolute }: LogoProps) => {
	const theme = useTheme();
	const { animate, fadeIn } = useAnimations({ delay: 300 });

	return (
		<StyledLogo absolute={absolute}>
			<animate.div style={fadeIn}>
				<LogoIcon sx={{ height: 'initial', width: 'initial' }} />
			</animate.div>
			{(textOne || textTwo) && (
				<StyleLogoText>
					<CoreTrail open={true} color={theme.palette.text.quaternary}>
						<div>{textOne}</div>
						<div>{textTwo}</div>
					</CoreTrail>
				</StyleLogoText>
			)}
		</StyledLogo>
	);
};

export default Logo;
