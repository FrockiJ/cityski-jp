import React, { useEffect, useState } from 'react';
import { Divider,Stack, Typography } from '@mui/material';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import useModalProvider from '@/hooks/useModalProvider';
import { TEXT_SECONDARY } from '@/shared/constants/colors';
import { showToast } from '@/utils/ui/general';

import CheckoutModal from './CheckoutModal';

type Props = {};

const FixedPaymentBlock = (props: Props) => {
	const modal = useModalProvider();
	const [checkoutValue, setCheckoutValue] = useState(null);
	const [checkoutInfo, setCheckoutInfo] = useState({
		status: 'pending',
		date: '--',
		paymentValue: '--',
		price: '--',
		invoice: '--'
	})
	
		const handleCheckout = () => {
			modal.openModal({
				title: `確認結清`,
				width: 480,
				noEscAndBackdrop: true,
				noAction: true,
				marginBottom: true,
				children: <CheckoutModal handleRefresh={(result) => {
					showToast(`已更新狀態`, 'success')
					console.log('result: ', result);
					setCheckoutValue(result);
				}} />,
			});
		};

		useEffect(() => {
			if (checkoutValue) {
				setCheckoutInfo({
					status: 'complated',
					date: checkoutValue?.['date'],
					paymentValue: checkoutValue?.['paymentValue'],
					price: '10,150',
					invoice: checkoutValue?.['invoice'],
				});
			}
		}, [checkoutValue]);

	return (
		<>
			<Stack
				width='246px'
				height={ checkoutInfo?.status === 'pending' ? '287px' : '235px'}
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
					<Typography>{ checkoutInfo?.status === 'pending' ? '待結清' : '已結清' }</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂單金額
					</Typography>
					<Typography variant='body1'>20,400</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						優惠折扣
					</Typography>
					<Typography variant='body1'>-100</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						優惠折扣碼
					</Typography>
					<Typography variant='body1'>hicityski</Typography>
				</Stack>
				<Divider orientation='horizontal' sx={{ margin: '16px 0' }} />
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						總付款金額
					</Typography>
					<Typography variant='body1'>{ checkoutInfo?.status === 'pending' ? '--' : '20,300' }</Typography>
				</Stack>
				{
					checkoutInfo?.status === 'pending'
						? <Stack direction='row' justifyContent='space-between' mt='22px'>
								<CoreButton color='primary' variant='contained' width='100%' label='確認結清' onClick={() => handleCheckout()} />
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
					<Typography variant='body1'>2024/12/13</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂金支付方式
					</Typography>
					<Typography variant='body1'>線上ATM</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂金支付金額
					</Typography>
					<Typography variant='body1'>10,150</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						訂金發票號碼
					</Typography>
					<Typography variant='body1'>00123456</Typography>
				</Stack>
				<Divider orientation='horizontal' sx={{ margin: '16px 0' }} />
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款支付日期
					</Typography>
					<Typography variant='body1'>{ checkoutInfo?.date }</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款支付方式
					</Typography>
					<Typography variant='body1'>{ checkoutInfo?.paymentValue !== '--' ? (checkoutInfo?.paymentValue === 'CREDIT' ? '刷卡' : '付現') : '--' }</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款支付金額
					</Typography>
					<Typography variant='body1'>{ checkoutInfo?.price }</Typography>
				</Stack>
				<Stack direction='row' justifyContent='space-between' mt={0.5}>
					<Typography variant='body2' color={TEXT_SECONDARY}>
						尾款發票號碼
					</Typography>
					<Typography variant='body1'>{ checkoutInfo?.invoice }</Typography>
				</Stack>
			</Stack>
		</>
	);
};

export default FixedPaymentBlock;
