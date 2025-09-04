import { Box, Typography } from '@mui/material';

interface CoreBlockCardProps {
	title: string;
	subTitle?: string;
	content: string | React.ReactNode;
	margin?: string;
	width?: string;
}
const CoreBlockCard = ({ title, subTitle = '', content, margin, width }: CoreBlockCardProps) => {
	return (
		<Box display='flex' flexDirection='column' margin={margin} width={width}>
			<Box display='flex' justifyContent='space-between' mb={0.5}>
				<Typography variant='body2' color='text.secondary'>
					{title}
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					{subTitle}
				</Typography>
			</Box>
			<Typography component='div' variant='body1'>
				{content}
			</Typography>
		</Box>
	);
};

export default CoreBlockCard;
