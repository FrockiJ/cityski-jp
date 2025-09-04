import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';

import BlockArea from '@/components/Project/shared/BlockArea';
import { PRIMARY_MAIN, TEXT_SECONDARY } from '@/shared/constants/colors';

type Props = {};

const OrderInfoBlock = (props: Props) => {
	return (
		<BlockArea>
			<Stack direction='column' spacing={2.5} divider={<Divider flexItem />} width='100%'>
				<Stack direction='row' justifyContent='space-between' width='100%'>
					<span>待付訂金</span>
					<Typography variant='body2' color={PRIMARY_MAIN}>
						課程詳情
					</Typography>
				</Stack>
				<Stack>
					<Stack direction='row' justifyContent='space-between' width='100%'>
						<Stack>
							<Typography variant='h4'>團體班教學</Typography>
							<Typography variant='body2'>4堂團體班</Typography>
						</Stack>
						<Box
							component='img'
							src='https://picsum.photos/64/64'
							alt='Random placeholder image'
							sx={{
								borderRadius: 1,
								width: 64,
								height: 64,
								objectFit: 'cover',
							}}
						/>
					</Stack>
					<Stack direction='row' width='100%' mt={2.5} gap={2}>
						<Stack direction='row' alignItems='center' gap={0.5}>
							<Box component='img' src='/icons/plan.svg' />
							<Typography variant='body2'>室內 / 團體課 / 預約式課程</Typography>
						</Stack>
						<Divider orientation='vertical' flexItem />
						<Stack direction='row' alignItems='center' gap={0.5}>
							<Box component='img' src='/icons/ski-man.svg' />
							<Typography variant='body2'>雙板 / 5堂</Typography>
						</Stack>
						<Divider orientation='vertical' flexItem />
						<Stack direction='row' alignItems='center' gap={0.5}>
							<Box component='img' src='/icons/people.svg' />
							<Typography variant='body2'>2成人 + 1青少年/兒童</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack direction='row' justifyContent='space-between' width='100%'>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂單編號
						</Typography>
						<Typography variant='body2'>12345678</Typography>
					</Stack>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂購日期
						</Typography>
						<Typography variant='body2'>2024/12/10</Typography>
					</Stack>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂購人
						</Typography>
						<Typography variant='body2'>李大名</Typography>
					</Stack>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂購方式
						</Typography>
						<Typography variant='body2'>Line官方帳號</Typography>
					</Stack>
				</Stack>
			</Stack>
		</BlockArea>
	);
};

export default OrderInfoBlock;
