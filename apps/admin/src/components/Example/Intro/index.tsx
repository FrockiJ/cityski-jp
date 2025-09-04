import { Box } from '@mui/material';
import HTMLReactParser from 'html-react-parser';

import { useAnimations } from '@/hooks/useAnimations';

import { StyledContentWrapper } from './styles';

interface IntroProps {
	title?: string;
	children?: React.ReactNode;
	content?: string | React.ReactNode;
	noBackground?: boolean;
}

const Intro = ({ title, children, content, noBackground }: IntroProps) => {
	const { animate, fadeIn } = useAnimations({ delay: 350 });

	return (
		<div>
			{title && (
				<Box typography='h5' my={2}>
					{title}
				</Box>
			)}
			{(children || content) && (
				<animate.div style={fadeIn}>
					<StyledContentWrapper noBackground={noBackground}>
						{children ? children : typeof content === 'string' ? HTMLReactParser(content) : content}
					</StyledContentWrapper>
				</animate.div>
			)}
		</div>
	);
};

export default Intro;
