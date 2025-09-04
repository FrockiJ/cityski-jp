import { StyledContentWrapper, StyledRow } from '../styles';

type CoreBlockContentProps = {
	children: React.ReactNode;
};
const CoreBlockContent = ({ children }: CoreBlockContentProps) => {
	return (
		<StyledContentWrapper>
			<StyledRow>{children}</StyledRow>
		</StyledContentWrapper>
	);
};

export default CoreBlockContent;
