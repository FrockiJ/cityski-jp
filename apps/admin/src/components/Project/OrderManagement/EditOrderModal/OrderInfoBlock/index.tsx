import React from 'react';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import {
	GetOrderDetailResponseDTO,
	CourseType,
	CourseSkiType,
	CourseBkgType,
	OrderChannel,
	OrderStatus,
} from '@repo/shared';
import dayjs from 'dayjs';

import BlockArea from '@/components/Project/shared/BlockArea';
import { PRIMARY_MAIN, TEXT_SECONDARY } from '@/shared/constants/colors';

type Props = {
	orderDetail: GetOrderDetailResponseDTO | null;
	onCourseDetailsClick?: (courseId: string) => void;
};

const OrderInfoBlock = ({ orderDetail, onCourseDetailsClick }: Props) => {
	console.log('orderDetail', orderDetail);
	if (!orderDetail) {
		return <BlockArea>載入中...</BlockArea>;
	}

	// 課程類型映射
	const courseTypeMap = {
		[CourseType.GROUP]: '團體課',
		[CourseType.PRIVATE]: '私人班',
		[CourseType.INDIVIDUAL]: '個人練習',
	};

	// 滑板類型映射
	const skiTypeMap = {
		[CourseSkiType.BOTH]: '雙板 / 單板',
		[CourseSkiType.SNOWBOARD]: '單板',
		[CourseSkiType.SKI]: '雙板',
	};

	// 預約形式映射
	const bkgTypeMap = {
		[CourseBkgType.FLEXIBLE]: '預約式課程',
		[CourseBkgType.FIXED]: '指定式課程',
	};

	// 訂購方式映射
	const channelMap = {
		[OrderChannel.LINE]: 'Line官方帳號',
		[OrderChannel.WEB]: '官方網站',
		// [OrderChannel.PHONE]: '電話',
		// [OrderChannel.ONSITE]: '現場',
	};

	const orderStatusMap = {
		[OrderStatus.ORDER_CANCELED]: '已取消',
		[OrderStatus.ORDER_COMPLETED]: '已完成',
		[OrderStatus.ORDER_SUCCESSFUL]: (
			<Chip
				label='訂購成功'
				sx={{
					backgroundColor: 'rgba(46, 125, 50, 0.16)', // success color with transparency
					color: '#1b5e20', // success dark color
					fontWeight: 'bold',
					fontSize: '12px',
					height: 'auto',
					py: 0.5,
					px: 2,
					borderRadius: 1.5,
					'& .MuiChip-label': {
						padding: 0,
						lineHeight: '20px',
					},
				}}
			/>
		),
		[OrderStatus.PENDING_DEPOSIT]: (
			<Chip
				label='待付訂金'
				sx={{
					backgroundColor: 'rgba(237, 108, 2, 0.16)', // warning color with transparency
					color: '#e65100', // warning dark color
					fontWeight: 'bold',
					fontSize: '12px',
					height: 'auto',
					py: 0.5,
					px: 2,
					borderRadius: 1.5,
					'& .MuiChip-label': {
						padding: 0,
						lineHeight: '20px',
					},
				}}
			/>
		),
		[OrderStatus.WAITING_FOR_CONFIRMATION]: '待確認',
	};
	const courseType = courseTypeMap[orderDetail.type] || orderDetail.type;
	const skiType = skiTypeMap[orderDetail.skiType] || orderDetail.skiType;
	const bkgType = bkgTypeMap[orderDetail.bkgType] || orderDetail.bkgType;
	const channel = channelMap[orderDetail.channel] || orderDetail.channel;
	const totalPeople = orderDetail.adultCount + orderDetail.childCount;
	const peopleText =
		orderDetail.childCount > 0
			? `${orderDetail.adultCount}成人 + ${orderDetail.childCount}青少年/兒童`
			: `${orderDetail.adultCount}成人`;

	return (
		<BlockArea>
			<Stack direction='column' spacing={2.5} divider={<Divider flexItem />} width='100%'>
				<Stack direction='row' justifyContent='space-between' width='100%'>
					<span>{orderStatusMap[orderDetail.status]}</span>
					<Box
						component='button'
						onClick={() => orderDetail?.courseId && onCourseDetailsClick?.(orderDetail.courseId)}
						sx={{
							background: 'none',
							border: 'none',
							padding: 0,
							cursor: 'pointer',
							'&:hover': {
								opacity: 0.7,
								textDecoration: 'underline',
							},
						}}
					>
						<Typography variant='body2' color={PRIMARY_MAIN}>
							課程詳情
						</Typography>
					</Box>
				</Stack>
				<Stack>
					<Stack direction='row' justifyContent='space-between' width='100%'>
						<Stack>
							<Typography variant='h4'>{orderDetail.coursePlanName}</Typography>
							<Typography variant='body2'>
								{orderDetail.planNumber}堂{courseType}
							</Typography>
						</Stack>
						{orderDetail.coursePlanImage && (
							<Box
								component='img'
								src={orderDetail.coursePlanImage}
								alt={orderDetail.coursePlanName}
								sx={{
									borderRadius: 1,
									width: 64,
									height: 64,
									objectFit: 'cover',
								}}
							/>
						)}
					</Stack>
					<Stack direction='row' width='100%' mt={2.5} gap={2}>
						<Stack direction='row' alignItems='center' gap={0.5}>
							<Box component='img' src='/icons/plan.svg' />
							<Typography variant='body2'>
								室內 / {courseType} / {bkgType}
							</Typography>
						</Stack>
						<Divider orientation='vertical' flexItem />
						<Stack direction='row' alignItems='center' gap={0.5}>
							<Box component='img' src='/icons/ski-man.svg' />
							<Typography variant='body2'>
								{skiType} / {orderDetail.planNumber}堂
							</Typography>
						</Stack>
						<Divider orientation='vertical' flexItem />
						<Stack direction='row' alignItems='center' gap={0.5}>
							<Box component='img' src='/icons/people.svg' />
							<Typography variant='body2'>{peopleText}</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack direction='row' justifyContent='space-between' width='100%'>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂單編號
						</Typography>
						<Typography variant='body2'>{orderDetail.no}</Typography>
					</Stack>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂購日期
						</Typography>
						<Typography variant='body2'>{dayjs(orderDetail.createdTime).format('YYYY/MM/DD')}</Typography>
					</Stack>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂購人
						</Typography>
						<Typography variant='body2'>{orderDetail.ordererName}</Typography>
					</Stack>
					<Stack alignItems='start' gap={0.5} width='170px'>
						<Typography variant='body2' color={TEXT_SECONDARY}>
							訂購方式
						</Typography>
						<Typography variant='body2'>{channel}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</BlockArea>
	);
};

export default OrderInfoBlock;
