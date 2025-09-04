import { StyledCodeWrapper } from './styles';

interface CodeProps {
	code: string;
}

const Code = ({ code }: CodeProps) => {
	return (
		<StyledCodeWrapper>
			<pre>{code}</pre>
		</StyledCodeWrapper>
	);
};

export default Code;
