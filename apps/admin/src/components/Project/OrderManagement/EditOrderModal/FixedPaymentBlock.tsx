import React from 'react';
import { Divider,Stack, Typography } from '@mui/material';

import { TEXT_SECONDARY } from '@/shared/constants/colors';

type Props = {};

const FixedPaymentBlock = (props: Props) => {
	return (
		<Stack
			width='246px'
			height='257px'
			bgcolor='white'
			borderRadius='16px'
			p='24px'
			sx={{ boxShadow: '0px 1px 2px 0px rgba(145, 158, 171, 0.16);' }}
		>
			<Stack direction='row' justifyContent='space-between' mb={2}>
				<Typography fontSize='18px' fontWeight='700'>
					付款狀態
				</Typography>
				<Typography>已結清</Typography>
			</Stack>
			<Stack direction='row' justifyContent='space-between' mt={0.5}>
				<Typography variant='body2' color={TEXT_SECONDARY}>
					應付金額
				</Typography>
				<Typography variant='body1'>20,300</Typography>
			</Stack>
			<Stack direction='row' justifyContent='space-between' mt={0.5}>
				<Typography variant='body2' color={TEXT_SECONDARY}>
					已付金額
				</Typography>
				<Typography variant='body1'>20,300</Typography>
			</Stack>
			<Stack direction='row' justifyContent='space-between' mt={0.5}>
				<Typography variant='body2' color={TEXT_SECONDARY}>
					待結清金額
				</Typography>
				<Typography variant='body1'>0</Typography>
			</Stack>
			<Divider orientation='horizontal' sx={{ margin: '16px 0' }} />
			<Stack direction='row' justifyContent='space-between' mt={0.5}>
				<Typography variant='body2' color={TEXT_SECONDARY}>
					收到訂金日期
				</Typography>
				<Typography variant='body1'>2024/12/13</Typography>
			</Stack>
			<Stack direction='row' justifyContent='space-between' mt={0.5}>
				<Typography variant='body2' color={TEXT_SECONDARY}>
					結清日期
				</Typography>
				<Typography variant='body1'>--</Typography>
			</Stack>
		</Stack>
	);
};

export default FixedPaymentBlock;
