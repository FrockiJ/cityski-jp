import { useState } from 'react';
import { Department, DialogAction, HttpStatusCode } from '@repo/shared';

import CoreButton from '@/CIBase/CoreButton';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import CoreLoaders from '@/components/Common/CIBase/CoreLoaders';
import { setAuthToken, setNavList } from '@/state/slices/authSlice';
import { setUserDepartments, setUserInfo } from '@/state/slices/userSlice';
import { useAppDispatch } from '@/state/store';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

interface ChoseDepartmentModalProps {
	departments: Department[];
	accessToken: string;
	handleCloseModal?: (action: DialogAction) => void;
}

const ChoseDepartmentModal = ({ handleCloseModal, departments, accessToken }: ChoseDepartmentModalProps) => {
	const dispatch = useAppDispatch();

	const departmentList = departments.map((x) => ({ label: x.name, value: x.id }));
	const currentDepartmentId = localStorage.getItem('departmentId');
	const [value, setValue] = useState(currentDepartmentId ?? departmentList[0]?.value);

	// --- API ---

	const [userPermission, { loading: userPermissionLoading }] = useLazyRequest(api.userPermission, {
		onError: generalErrorHandler,
	});

	const isLoading = userPermissionLoading;

	return (
		<>
			{isLoading && <CoreLoaders hasOverlay />}
			<CoreModalContent padding='24px 0'>
				<CoreRadioGroup
					direction='column'
					width='100%'
					value={value}
					onChange={(_event, value) => {
						if (value) setValue(value);
					}}
					radios={departmentList}
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
						// set up departmentId for refresh token to get userPermission
						localStorage.setItem('departmentId', value);

						// update accessToken in redux state to be stored in memory
						dispatch(setAuthToken(accessToken));

						const { result, statusCode } = await userPermission({ departmentId: value });

						if (statusCode === HttpStatusCode.OK) {
							// update userInfo, departments, menus in redux state to be stored in memory
							dispatch(setUserInfo(result.userInfo));
							dispatch(setUserDepartments(result.departments));
							dispatch(setNavList(result.menus));

							handleCloseModal?.(DialogAction.CONFIRM);
						}
					}}
				/>
			</StyledAbsoluteModalActions>
		</>
	);
};

export default ChoseDepartmentModal;
