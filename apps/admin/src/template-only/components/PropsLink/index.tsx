import { Box } from '@mui/material';
import Link from 'next/link';

type PropsLinkProps = {
	url: string;
	text?: string;
};

const PropsLink = ({ url, text }: PropsLinkProps) => {
	return (
		<Box
			component="span"
			sx={{
				borderBottom: '1px solid #0072E5',
				color: '#0072E5',
				fontSize: '20px',
				fontWeight: '600',
				':hover': { borderColor: '#07427d' },
			}}
		>
			<Link href={url}>{text ?? 'Component Props'}</Link>
		</Box>
	);
};

export default PropsLink;
