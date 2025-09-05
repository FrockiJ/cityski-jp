import { useState } from 'react';
import { Box, debounce } from '@mui/material';
import { DialogAction } from '@repo/shared';
import dayjs, { Dayjs } from 'dayjs';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreDatePicker from '@/components/Common/CIBase/CoreDatePicker';
import CoreInput from '@/components/Common/CIBase/CoreInput';
import { StyledAbsoluteModalActions } from '@/components/Common/CIBase/CoreModal/styles';

interface CheckoutModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: (data: any) => void;
}

const CheckoutModal = ({ handleCloseModal, handleRefresh }: CheckoutModalProps) => {
	const [paymentValue, setPaymentValue] = useState('CREDIT');
	const [date, setDate] = useState<Dayjs | null>(dayjs());
	const [invoice, setInvoice] = useState('');

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
						defaultValue='NT$ 10,150'
						isDisabled={true}
					/>
				</Box>
				<CoreRadioGroup
					title={`付款方式`}
					direction='column'
					width='100%'
					value={paymentValue}
					onChange={(_event, value) => {
						if (value) setPaymentValue(value);
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
				/>
				<CoreButton
					color='primary'
					variant='contained'
					type='submit'
					label='確認'
					onClick={async () => {
						handleCloseModal?.(DialogAction.CONFIRM);
						handleRefresh?.({
							date: dayjs(date).format('YYYY/MM/DD'),
							paymentValue,
							invoice
						});

						// modal.openModal({
						// 	title: `新增課程`,
						// 	center: true,
						// 	fullScreen: true,
						// 	noAction: true,
						// 	marginBottom: true,
						// 	children: (
						// 		<AddEditViewCourseModal
						// 			modalType={ModalType.ADD}
						// 			courseType={courseTypeValue}
						// 			courseStatusType={CourseStatusType.DRAFT}
						// 			handleRefresh={handleRefresh}
						// 		/>
						// 	),
						// });
					}}
				/>
			</StyledAbsoluteModalActions>
		</>
	);
};

export default CheckoutModal;
