import { useState } from 'react';
import { debounce } from '@mui/material';
import {
	DialogAction,
	GetRolesRequestDTO,
	HttpStatusCode,
	MessageType,
	ModalType,
	RoleTableListResult,
} from '@repo/shared';
import { configRoleTable } from 'src/tableConfigs/permissions-personnel';

import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/components/Common/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/components/Common/CIBase/CoreDynamicTable/TablePageLayout';
import AddEditRoleModal from '@/components/Project/AdminSetting/AddEditRoleModal';
import { useRoleFormatTableData } from '@/hooks/tableData/useRoleFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { PermissionsProps } from '@/shared/types/auth';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

interface RoleProps extends PermissionsProps {}

const Role = ({}: RoleProps) => {
	const modal = useModalProvider();
	const [keyword, setKeyword] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	// --- API ---

	const [switchRoleStatus, { loading: switchRoleStatusLoading }] = useLazyRequest(api.switchRoleStatus, {
		onError: generalErrorHandler,
	});

	const [deleteRole, { loading: deleteRoleLoading }] = useLazyRequest(api.deleteRole, {
		onError: generalErrorHandler,
	});

	const { formatTableData, tableDataCount, tableDataLoading, handleRefresh } = useRoleFormatTableData({
		query: { keyword },
	});

	// --- FUNCTIONS ---

	const handleAddEditRole = ({ modalType, roleId }: { modalType: ModalType; roleId?: string }) => {
		modal.openModal({
			title: `${modalType === ModalType.ADD ? '新增' : '編輯'}角色`,
			noEscAndBackdrop: true,
			width: 720,
			children: <AddEditRoleModal modalType={modalType} roleId={roleId} handleRefresh={handleRefresh} />,
		});
	};

	const handleSwitchRole = async ({ id, rowData }: { id: string; rowData: RoleTableListResult }) => {
		if (rowData.usageCount > 0) {
			modal.openMessageModal({
				type: MessageType.CONFIRM,
				title: `無法停用角色`,
				content: `目前有後台人員正在使用此角色設定，若要停用此角色，請確認沒有後台人員使用此角色設定，再執行停用角色。`,
			});
		} else if (rowData.status) {
			modal.openMessageModal({
				type: MessageType.ERROR,
				title: `停用角色`,
				content: `請確認是否停用該角色`,
				confirmLabel: `停用`,
				onClose: async (action) => {
					if (action === DialogAction.CONFIRM) {
						const { statusCode } = await switchRoleStatus({ roleId: id });

						if (statusCode === HttpStatusCode.OK) {
							showToast(`已停用`, 'success');
							handleRefresh();
							close?.();
						}
					}
				},
			});
		} else {
			const { statusCode } = await switchRoleStatus({ roleId: id });

			if (statusCode === HttpStatusCode.OK) {
				showToast(`已啟用`, 'success');
				handleRefresh();
				close?.();
			}
		}
	};

	const handleDeleteRole = ({ id, rowData }: { id: string; rowData: RoleTableListResult }) => {
		if (rowData.usageCount > 0) {
			modal.openMessageModal({
				type: MessageType.CONFIRM,
				title: `無法刪除角色`,
				content: `目前有後台人員正在使用此角色設定，若要刪除此角色，請確認沒有後台人員使用此角色設定，再執行刪除角色。`,
			});
		} else {
			modal.openMessageModal({
				type: MessageType.ERROR,
				title: `刪除角色`,
				content: `一但刪除，將會從後台移除`,
				confirmLabel: `刪除`,
				onClose: async (action) => {
					if (action === DialogAction.CONFIRM) {
						const { statusCode } = await deleteRole({ roleId: id });

						if (statusCode === HttpStatusCode.OK) {
							showToast(`已刪除`, 'success');
							handleRefresh();
							close?.();
						}
					}
				},
			});
		}
	};

	const isLoading = tableDataLoading || switchRoleStatusLoading || deleteRoleLoading;

	return (
		<TablePageLayout
			title='後台角色管理'
			handleAction={() => handleAddEditRole({ modalType: ModalType.ADD })}
			coreButtonProps={{ label: '新增角色' }}
		>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={configRoleTable.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋角色名稱' }}
					unused={configRoleTable?.unfilteredFields}
					queryDto={() => GetRolesRequestDTO}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configRoleTable.tableId}
				headData={configRoleTable.columns}
				dataCount={tableDataCount}
				isLoading={isLoading}
			>
				<CoreDynamicTableList<RoleTableListResult>
					rows={formatTableData}
					tableConfig={configRoleTable}
					handleEdit={(id) => handleAddEditRole({ modalType: ModalType.EDIT, roleId: id })}
					handleDelete={(id, rowData) => handleDeleteRole({ id, rowData })}
					handleSwitch={(id, rowData) => handleSwitchRole({ id, rowData })}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default Role;
