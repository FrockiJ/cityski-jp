import { useState } from 'react';
import { CourseStatusType, CourseType, DialogAction, ModalType } from '@repo/shared';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import { StyledAbsoluteModalActions } from '@/components/Common/CIBase/CoreModal/styles';
import useModalProvider from '@/hooks/useModalProvider';

import AddEditViewCourseModal from './AddEditViewCourseIndoorModal';

interface SelectCourseTypeModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
}

const SelectCourseTypeModal = ({ handleCloseModal, handleRefresh }: SelectCourseTypeModalProps) => {
	const modal = useModalProvider();
	const [courseTypeValue, setCourseTypeValue] = useState(CourseType.PRIVATE);

	return (
		<>
			<CoreModalContent padding='24px 0'>
				<CoreRadioGroup
					direction='column'
					width='100%'
					value={courseTypeValue}
					onChange={(_event, value) => {
						if (value) setCourseTypeValue(value);
					}}
					radios={[
						{ label: '私人課', description: '不可併班｜教練授課', value: CourseType.PRIVATE },
						{ label: '團體課', description: '等級相似可併班｜教練授課', value: CourseType.GROUP },
						{ label: '個人練習', description: '不可併班｜無教練授課', value: CourseType.INDIVIDUAL },
					]}
					isCustomLabel
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

						modal.openModal({
							title: `新增課程`,
							center: true,
							fullScreen: true,
							noAction: true,
							marginBottom: true,
							children: (
								<AddEditViewCourseModal
									modalType={ModalType.ADD}
									courseType={courseTypeValue}
									courseStatusType={CourseStatusType.DRAFT}
									handleRefresh={handleRefresh}
								/>
							),
						});
					}}
				/>
			</StyledAbsoluteModalActions>
		</>
	);
};

export default SelectCourseTypeModal;
