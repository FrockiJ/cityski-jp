import React from 'react';
import { Typography } from '@mui/material';
import { DialogAction } from '@repo/shared';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import { StyledAbsoluteModalActions } from '@/components/Common/CIBase/CoreModal/styles';

type Props = {
	type: 'downPayment' | 'closePayment';
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: (data: any) => void;
};

const ConfirmPaymentModal = (props: Props) => {
	return (
		<>
			<CoreModalContent  padding='24px 0'>
					{
						props.type === 'downPayment' ? (
							<Typography>請確認是否收到訂金？一旦確認便無法恢復前一個狀態。</Typography>
						) : (
							<Typography>請確認是否結清？一旦確認便無法恢復前一個狀態。</Typography>
						)
					}
			</CoreModalContent>
			<StyledAbsoluteModalActions justifyContent='flex-end'>
				<CoreButton
					color='default'
					variant='outlined'
					label='取消'
					onClick={() => props.handleCloseModal?.(DialogAction.CANCEL)}
					margin='0 12px 0 0'
				/>
				<CoreButton
					color='primary'
					variant='contained'
					type='submit'
					label='確認'
					onClick={async () => {
						props.handleCloseModal?.(DialogAction.CONFIRM);
						props.handleRefresh?.('待結清');

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

export default ConfirmPaymentModal;
