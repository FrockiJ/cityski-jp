import { useState } from 'react';
import { debounce } from '@mui/material';
import {
	DialogAction,
	FrontendMemberManagementTableListResult,
	GetMembersRequestDto,
	HttpStatusCode,
	MessageType,
} from '@repo/shared';
import { configFrontendMemberManagementTable } from 'src/tableConfigs/frontend-member-management';

import CoreDynamicTable from '@/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/CIBase/CoreDynamicTable/TablePageLayout';
import FrontendMemberManagementModal from '@/components/Project/MemberManagementModal';
import { useFrontendMemberManagementFormatTableData } from '@/hooks/tableData/useFrontendMemberManagementFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { PermissionsProps } from '@/shared/types/auth';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

interface FrontendMemberManagementProps extends PermissionsProps {}

const FrontendMemberManagement = ({}: FrontendMemberManagementProps) => {
	const modal = useModalProvider();
	const [keyword, setKeyword] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	// --- API ---

	const [switchMemberStatus, { loading: switchMemberStatusLoading }] = useLazyRequest(api.switchMemberStatus, {
		onError: generalErrorHandler,
	});

	const { formatTableData, tableDataCount, tableDataLoading, handleRefresh } =
		useFrontendMemberManagementFormatTableData({
			query: { keyword },
		});

	// --- FUNCTIONS ---

	const handleSwitchMember = async ({
		id,
		rowData,
	}: {
		id: string;
		rowData: FrontendMemberManagementTableListResult;
	}) => {
		if (rowData.status) {
			modal.openMessageModal({
				type: MessageType.ERROR,
				title: `停用人員`,
				content: `一旦停用此會員，該會員將無法再登入CitySki網頁平台，所有進行中的訂單與預約會自動取消，已完成的訂單與預約會保留紀錄在後台。
	
				您可以再次啟用此會員，但所有訂單與預約將不會回復。`,
				confirmLabel: `停用`,
				onClose: async (action) => {
					if (action === DialogAction.CONFIRM) {
						const { statusCode } = await switchMemberStatus({ memberId: id });

						if (statusCode === HttpStatusCode.OK) {
							showToast(`已${rowData.status ? '停用' : '啟用'}`, 'success');
							handleRefresh();
							close?.();
						}
					}
				},
			});
		} else {
			const { statusCode } = await switchMemberStatus({ memberId: id });

			if (statusCode === HttpStatusCode.OK) {
				showToast(`已${rowData.status ? '停用' : '啟用'}`, 'success');
				handleRefresh();
				close?.();
			}
		}
	};

	const handleEditMember = (memberId: string) => {
		modal.openModal({
			title: `編輯會員資料`,
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: <FrontendMemberManagementModal handleRefresh={handleRefresh} memberId={memberId} />,
		});
	};

	const isLoading = tableDataLoading || switchMemberStatusLoading;

	return (
		<TablePageLayout title='前台會員管理'>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={configFrontendMemberManagementTable.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋姓名或手機' }}
					unused={configFrontendMemberManagementTable?.unfilteredFields}
					queryDto={() => GetMembersRequestDto}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configFrontendMemberManagementTable.tableId}
				headData={configFrontendMemberManagementTable.columns}
				dataCount={tableDataCount}
				isLoading={isLoading}
			>
				<CoreDynamicTableList<FrontendMemberManagementTableListResult>
					rows={formatTableData}
					tableConfig={configFrontendMemberManagementTable}
					handleSwitch={(id, rowData) => handleSwitchMember({ id, rowData })}
					handleTableRowClick={(rowData) => handleEditMember(rowData.id)}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default FrontendMemberManagement;
