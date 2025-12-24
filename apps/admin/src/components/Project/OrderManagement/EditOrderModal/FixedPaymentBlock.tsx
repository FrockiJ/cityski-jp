import React, { useEffect, useState } from 'react';
import { Divider,Stack, Typography } from '@mui/material';
import { GetOrderDetailResponseDTO, TransactionStatus } from '@repo/shared';
import dayjs from 'dayjs';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import useModalProvider from '@/hooks/useModalProvider';
import { TEXT_SECONDARY } from '@/shared/constants/colors';
import { showToast } from '@/utils/ui/general';
// ============ DEV ONLY - REMOVE BEFORE PRODUCTION ============
import { payDepositForDev } from '@/utils/http/api/order';
// ============================================================

import CheckoutModal from './CheckoutModal';

type Props = {
	orderDetail?: GetOrderDetailResponseDTO;
	handleRefresh?: (data: any) => void;
};

const FixedPaymentBlock = ({ orderDetail, handleRefresh }: Props) => {
	const modal = useModalProvider();
	const [checkoutValue, setCheckoutValue] = useState(null);

	const transaction = orderDetail?.transaction;

	// 格式化金額顯示
	const formatAmount = (amount?: number) => {
		if (amount === undefined || amount === null) return '--';
		return amount.toLocaleString();
	};

	// 根據 transaction status 決定顯示的狀態文字
	const getStatusText = () => {
		if (!transaction) return '待付訂金';
		switch (transaction.status) {
			case TransactionStatus.PENDING_DEPOSIT:
				return '待付訂金';
			case TransactionStatus.DEPOSIT_PAID:
				return '已付訂金';
			case TransactionStatus.PENDING_FULL_PAYMENT:
				return '待結清';
			case TransactionStatus.FULLY_PAID:
				return '已結清';
			default:
				return '待付訂金';
		}
	};

	const status = getStatusText();
	const isPendingDeposit = !transaction || transaction.status === TransactionStatus.PENDING_DEPOSIT;
	const isFullyPaid = transaction?.status === TransactionStatus.FULLY_PAID;

	const handleCheckout = () => {
		if (!orderDetail?.id) {
			showToast('訂單 ID 不存在', 'error');
			return;
		}

		modal.openModal({
			title: `確認結清`,
			width: 480,
			noEscAndBackdrop: true,
			noAction: true,
			marginBottom: true,
			children: <CheckoutModal
				orderId={orderDetail.id}
				balanceAmt={(transaction?.totalAmt || 0) - (transaction?.depositAmt || 0)}
				handleRefresh={(result) => {
					console.log('result: ', result);
					setCheckoutValue(result);
					handleRefresh?.('已結清');
				}}
			/>,
		});
	};

	// ============ DEV ONLY - REMOVE BEFORE PRODUCTION ============
	const handlePayDepositForDev = async () => {
		if (!orderDetail?.id) {
			showToast('訂單 ID 不存在', 'error');
			return;
		}

		try {
			await payDepositForDev({
				orderId: orderDetail.id,
				account: 'dev-account',
				amount: transaction?.depositAmt || 0,
			});
			showToast('付訂金成功', 'success');
			handleRefresh?.('已付訂金');
		} catch (error) {
			console.error('Pay deposit error:', error);
			showToast('付訂金失敗', 'error');
		}
	};
	// ============================================================

	return (
		<>
			<Stack
				width='246px'
				bgcolor='white'
				borderRadius='16px'
				p='24px'
				mb='24px'
				sx={{ boxShadow: '0px 1px 2px 0px rgba(145, 158, 171, 0.16);' }}
			>
				<Stack direction='row' justifyContent='space-between' mb={2}>
					<Typography fontSize='18px' fontWeight='700'>
						付款金額
					</Typography>
					<Typography>{status}</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂單金額
					</Typography>
					<Typography variant='body1'>
						{formatAmount(transaction ? transaction.totalAmt + transaction.discountFee : undefined)}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						優惠折扣
					</Typography>
					<Typography variant='body1'>
						{transaction?.discountFee ? `-${formatAmount(transaction.discountFee)}` : '--'}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						優惠折扣碼
					</Typography>
					<Typography variant='body1'>{orderDetail?.discountId || '--'}</Typography>
				</Stack>
				<Divider orientation='horizontal' sx={{ margin: '16px 0' }} />
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						總付款金額
					</Typography>
					<Typography variant='body1'>
						{isFullyPaid ? formatAmount(transaction?.totalAmt) : '--'}
					</Typography>
				
				</Stack>
				
	{
					!isPendingDeposit && !isFullyPaid
						? <Stack direction='row' justifyContent='space-between' mt='22px'>
								<CoreButton color='primary' variant='contained' width='100%' label='確認結清' onClick={() => handleCheckout()} />
							</Stack>
						: <></>
				}
				{
					isPendingDeposit 
						? <Stack direction='row' justifyContent='space-between' mt='22px'>
								<CoreButton color='primary' variant='contained' width='100%' label='確認訂金' onClick={handlePayDepositForDev} />
							</Stack>
						: <></>
				}
				

			</Stack>
			<Stack
				width='246px'
				height='341px'
				bgcolor='white'
				borderRadius='16px'
				p='24px'
				sx={{ boxShadow: '0px 1px 2px 0px rgba(145, 158, 171, 0.16);' }}
			>
				<Stack direction='row' justifyContent='space-between' mb={2}>
					<Typography fontSize='18px' fontWeight='700'>
						付款明細
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂金支付日期
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_DEPOSIT && transaction?.depositDate ? dayjs(transaction.depositDate).format('YYYY/MM/DD') : '--'}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂金支付方式
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_DEPOSIT  ? (transaction?.depositPaymentMethod === 'CREDIT' ? '刷卡' : transaction?.depositPaymentMethod === 'CASH' ? '付現' : transaction?.depositPaymentMethod === 'ATM' ? 'ATM' : '--') : '--'}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂金支付金額
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_DEPOSIT  ? formatAmount(transaction?.depositAmt) : '--'}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂金發票號碼
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_DEPOSIT  ? '--' : '--'}
					</Typography>
				</Stack>
				<Divider orientation='horizontal' sx={{ margin: '16px 0' }} />
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款支付日期
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_FULL_PAYMENT && transaction?.balanceDate ?  dayjs(transaction.balanceDate).format('YYYY/MM/DD') : '--'}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款支付方式
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_FULL_PAYMENT  ? (transaction?.balancePaymentMethod === 'CREDIT' ? '刷卡' : transaction?.balancePaymentMethod === 'CASH' ? '付現' : '--') : '--'}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款支付金額
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_FULL_PAYMENT  ? formatAmount(transaction?.balanceAmt) : '--'}
					</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款發票號碼
					</Typography>
					<Typography variant='body1'>
						{transaction?.status > TransactionStatus.PENDING_FULL_PAYMENT  ? transaction?.balanceInvoice || '--' : '--'}
					</Typography>
				</Stack>
			</Stack>
		</>
	);
};

export default FixedPaymentBlock;
