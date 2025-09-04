import { useState } from 'react';
import { debounce } from '@mui/material';
import {
	DialogAction,
	GetUsersRequestDTO,
	HttpStatusCode,
	MessageType,
	ModalType,
	OptionNames,
	UserTableListResult,
} from '@repo/shared';
import { configUserTable } from 'src/tableConfigs/permissions-personnel';

import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/components/Common/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/components/Common/CIBase/CoreDynamicTable/TablePageLayout';
import AddEditUserModal from '@/components/Project/AdminSetting/AddEditUserModal';
import { useUserFormatTableData } from '@/hooks/tableData/useUserFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { PermissionsProps } from '@/shared/types/auth';
import { addOptionItem } from '@/state/slices/optionSlice';
import { useAppDispatch } from '@/state/store';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

interface UserProps extends PermissionsProps {}

const User = ({}: UserProps) => {
	const modal = useModalProvider();
	const dispatch = useAppDispatch();
	const [keyword, setKeyword] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	// --- API ---

	const [switchUserStatus, { loading: switchUserStatusLoading }] = useLazyRequest(api.switchUserStatus, {
		onError: generalErrorHandler,
	});

	const [deleteUser, { loading: deleteUserLoading }] = useLazyRequest(api.deleteUser, {
		onError: generalErrorHandler,
	});

	const [getRoleOptions, { loading: getRoleOptionsLoading }] = useLazyRequest(api.getRoleOptions, {
		onError: generalErrorHandler,
	});

	const { formatTableData, tableDataCount, tableDataLoading, handleRefresh } = useUserFormatTableData({
		query: { keyword },
	});

	// --- FUNCTIONS ---

	const handleAddEditUser = ({
		modalType,
		userId,
		rowData,
	}: {
		modalType: ModalType;
		userId?: string;
		rowData?: UserTableListResult;
	}) => {
		modal.openModal({
			title: `${modalType === ModalType.ADD ? '新增' : '編輯'}人員`,
			width: 480,
			noEscAndBackdrop: true,
			children: (
				<AddEditUserModal userId={userId} rowData={rowData} modalType={modalType} handleRefresh={handleRefresh} />
			),
		});
	};

	const handleSwitchUser = async ({ id, rowData }: { id: string; rowData: UserTableListResult }) => {
		if (rowData.status) {
			modal.openMessageModal({
				type: MessageType.ERROR,
				title: `停用人員`,
				content: `請確認是否停用該人員`,
				confirmLabel: `停用`,
				onClose: async (action) => {
					if (action === DialogAction.CONFIRM) {
						const { statusCode } = await switchUserStatus({ userId: id });

						if (statusCode === HttpStatusCode.OK) {
							showToast(`已停用`, 'success');
							handleRefresh();
							close?.();
						}
					}
				},
			});
		} else {
			const { statusCode } = await switchUserStatus({ userId: id });

			if (statusCode === HttpStatusCode.OK) {
				showToast(`已啟用`, 'success');
				handleRefresh();
				close?.();
			}
		}
	};

	const handleDeleteUser = ({ id }: { id: string; rowData: UserTableListResult }) => {
		modal.openMessageModal({
			type: MessageType.ERROR,
			title: `刪除人員`,
			content: `一但刪除，將會從後台移除`,
			confirmLabel: `刪除`,
			onClose: async (action) => {
				if (action === DialogAction.CONFIRM) {
					const { statusCode } = await deleteUser({ userId: id });

					if (statusCode === HttpStatusCode.OK) {
						showToast(`已刪除`, 'success');
						handleRefresh();
						close?.();
					}
				}
			},
		});
	};

	const handleClickFilter = async () => {
		const { statusCode, result } = await getRoleOptions();

		if (statusCode === HttpStatusCode.OK) {
			dispatch(
				addOptionItem({
					key: OptionNames.USER_ROLE,
					option: result,
				}),
			);
		}
	};

	const isLoading = tableDataLoading || switchUserStatusLoading || deleteUserLoading || getRoleOptionsLoading;

	return (
		<TablePageLayout
			title='後台人員管理'
			handleAction={() => handleAddEditUser({ modalType: ModalType.ADD })}
			coreButtonProps={{ label: '新增人員' }}
		>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={configUserTable.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋使用者名稱或 Email' }}
					unused={configUserTable?.unfilteredFields}
					queryDto={() => GetUsersRequestDTO}
					handleClickFilter={handleClickFilter}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configUserTable.tableId}
				headData={configUserTable.columns}
				dataCount={tableDataCount}
				isLoading={isLoading}
			>
				<CoreDynamicTableList<UserTableListResult>
					rows={formatTableData}
					tableConfig={configUserTable}
					handleEdit={(id, rowData) => handleAddEditUser({ modalType: ModalType.EDIT, userId: id, rowData })}
					handleDelete={(id, rowData) => handleDeleteUser({ id, rowData })}
					handleSwitch={(id, rowData) => handleSwitchUser({ id, rowData })}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default User;
