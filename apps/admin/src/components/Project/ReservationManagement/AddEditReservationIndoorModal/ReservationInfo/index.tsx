import React from 'react';
import { Stack, Typography } from '@mui/material';

import BlockArea from '@/components/Project/shared/BlockArea';

type Props = {};

const ReservationInfo = (props: Props) => {
	return (
		<BlockArea>
			<Stack gap={3} width='100%'>
				<Stack direction='row' gap={3}>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							預約編號
						</Typography>
						<Typography variant='body1'>001234</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							課程狀態
						</Typography>
						<Typography variant='body1'>已排定</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							剩餘名額
						</Typography>
						<Typography variant='body1'>2</Typography>
					</Stack>
				</Stack>
				<Stack direction='row' gap={3}>
					<Stack gap={0.5} width='31%'>
						<Typography variant='body2' color='text.secondary'>
							人數限制
						</Typography>
						<Typography variant='body1'>2~5</Typography>
					</Stack>
					<Stack gap={0.5} width='31%'>
						<Typography variant='body2' color='text.secondary'>
							課程類型
						</Typography>
						<Typography variant='body1'>預約團體｜雙板</Typography>
					</Stack>
				</Stack>
			</Stack>
		</BlockArea>
	);
};

export default ReservationInfo;
