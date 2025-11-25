import { useState } from 'react';
import { Box, debounce } from '@mui/material';
import { DialogAction, PaymentMethod } from '@repo/shared';
import dayjs, { Dayjs } from 'dayjs';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreDatePicker from '@/components/Common/CIBase/CoreDatePicker';
import CoreInput from '@/components/Common/CIBase/CoreInput';
import { StyledAbsoluteModalActions } from '@/components/Common/CIBase/CoreModal/styles';
import { settleTransaction } from '@/utils/http/api/order';
import { showToast } from '@/utils/ui/general';

interface CheckoutModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: (data: any) => void;
	orderId: string;
	balanceAmt: number;
}

const CheckoutModal = ({ handleCloseModal, handleRefresh, orderId, balanceAmt }: CheckoutModalProps) => {
	const [paymentValue, setPaymentValue] = useState<PaymentMethod>(PaymentMethod.CREDIT);
	const [date, setDate] = useState<Dayjs | null>(dayjs());
	const [invoice, setInvoice] = useState('');
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		if (!date) {
			showToast('請選擇結清日期', 'error');
			return;
		}

		setLoading(true);
		try {
			const response = await settleTransaction({
				orderId,
				balanceDate: dayjs(date).format('YYYY-MM-DD'),
				paymentMethod: paymentValue,
				invoice: invoice || undefined,
			});

			if (response.result) {
				showToast('結清成功', 'success');
				handleCloseModal?.(DialogAction.CONFIRM);
				handleRefresh?.({
					date: dayjs(date).format('YYYY/MM/DD'),
					paymentValue,
					invoice
				});
			}
		} catch (error: any) {
			console.error('結清失敗:', error);
			showToast(error?.response?.result?.message || '結清失敗', 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<CoreModalContent padding='24px 0'>
				<Box display='flex' alignItems='flex-end' gap={1.5} mb='40px'>
					<CoreDatePicker
						title={`結清日期`}
						size='medium'
						value={date}
						onChange={setDate}
					/>
					<CoreInput
						title={`付款金額`}
						size='medium'
						defaultValue={`NT$ ${balanceAmt.toLocaleString()}`}
						isDisabled={true}
					/>
				</Box>
				<CoreRadioGroup
					title={`付款方式`}
					direction='column'
					width='100%'
					value={paymentValue}
					onChange={(_event, value) => {
						if (value) setPaymentValue(value as PaymentMethod);
					}}
					radios={[
						{ label: '刷卡', description: ' ', value: 'CREDIT' },
						{ label: '付現', description: ' ', value: 'CASH' },
					]}
					isCustomLabel
				/>
				<CoreInput
					title={`發票號碼`}
					placeholder={'輸入'}
					size='medium'
					inputStyle={{ width: 430 }}
					onChange={debounce((event) => {
						setInvoice(event);
					})}
				/>
			</CoreModalContent>
			<StyledAbsoluteModalActions justifyContent='flex-end'>
				<CoreButton
					color='default'
					variant='outlined'
					label='取消'
					onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
					margin='0 12px 0 0'
					disabled={loading}
				/>
				<CoreButton
					color='primary'
					variant='contained'
					type='submit'
					label='確認'
					onClick={handleConfirm}
					disabled={loading}
				/>
			</StyledAbsoluteModalActions>
		</>
	);
};

export default CheckoutModal;
