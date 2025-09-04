import React from 'react';
import { Divider, Stack, Typography } from '@mui/material';

import BlockArea from '@/components/Project/shared/BlockArea';
import { TEXT_SECONDARY } from '@/shared/constants/colors';

type Props = {};

const PaymentInfoBlock = (props: Props) => {
	return (
		<Stack direction='row' spacing={2}>
			<BlockArea width='300px' row>
				<Stack justifyContent='space-between' width='100%' gap={1}>
					<Stack direction='row' justifyContent='space-between' spacing={2}>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂單金額(NT$)
						</Typography>
						<Typography variant='body1'>20,400</Typography>
					</Stack>
					<Stack direction='row' justifyContent='space-between' spacing={2}>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							優惠折扣(NT$)
						</Typography>
						<Typography variant='body1'>-100</Typography>
					</Stack>
					<Divider flexItem orientation='horizontal' />
					<Stack direction='row' justifyContent='space-between' spacing={2}>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂單總計(NT$)
						</Typography>
						<Typography variant='h6'>20,300</Typography>
					</Stack>
				</Stack>
			</BlockArea>
			<BlockArea width='436px'>
				<Stack width='100%' justifyContent='center' gap={3}>
					<Stack direction='row' justifyContent='start' gap={3}>
						<Stack width='100%' justifyContent='start' spacing={0.5}>
							<Typography variant='body2' color={TEXT_SECONDARY}>
								折扣碼
							</Typography>
							<Typography variant='body1'>hicityski</Typography>
						</Stack>
						<Stack width='100%' justifyContent='start' spacing={0.5}>
							<Typography variant='body2' color={TEXT_SECONDARY}>
								付款帳號後五碼
							</Typography>
							<Typography variant='body1'>--</Typography>
						</Stack>
					</Stack>
					<Stack direction='row' justifyContent='start' gap={3}>
						<Stack width='100%' justifyContent='start' spacing={0.5}>
							<Typography variant='body2' color={TEXT_SECONDARY}>
								使用者回覆付款金額(NT$)
							</Typography>
							<Typography variant='body1'>0</Typography>
						</Stack>
						<Stack width='100%' justifyContent='start' spacing={0.5}>
							<Typography variant='body2' color={TEXT_SECONDARY}>
								使用者回覆付訂金日期
							</Typography>
							<Typography variant='body1'>--</Typography>
						</Stack>
					</Stack>
				</Stack>
			</BlockArea>
		</Stack>
	);
};

export default PaymentInfoBlock;
