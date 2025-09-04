import { Stack, Typography } from '@mui/material';

import BlockArea from '@/components/Project/shared/BlockArea';
import { TEXT_SECONDARY } from '@/shared/constants/colors';

type Props = {
	reason: string;
};

const InspectChangesModal = (props: Props) => {
	return (
		<Stack pb={3}>
			<Typography variant='body2' color={TEXT_SECONDARY} mb={0.5}>
				訂單異動原因
			</Typography>
			<BlockArea px={12} py={9} minHeight='90px' height='fit-content'>
				<Typography>{props.reason}</Typography>
			</BlockArea>
		</Stack>
	);
};

export default InspectChangesModal;
