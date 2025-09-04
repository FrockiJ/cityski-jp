import { Box, Typography } from '@mui/material';

import { useAnimations } from '@/hooks/useAnimations';

const Custom404 = () => {
	const { animate, fadeIn } = useAnimations({ delay: 200 });
	const AnimatedBox = animate(Box);

	return (
		<AnimatedBox
			style={fadeIn}
			sx={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: '1 1 auto',
					maxWidth: 448,
					textAlign: 'center',
					alignItems: 'center',
				}}
			>
				<Typography variant='h3' sx={{ mt: 2, mb: 2 }}>
					404 - Page Not Found
				</Typography>
				<Typography variant='body1' sx={{ color: 'text.secondary', mb: 5 }}>
					Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
					spelling.
				</Typography>
			</Box>
		</AnimatedBox>
	);
};

export default Custom404;
