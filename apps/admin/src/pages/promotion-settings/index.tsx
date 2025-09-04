import { useEffect, useState } from 'react';
import { debounce } from '@mui/material';
import {
	DialogAction,
	DiscountStatus,
	DiscountTableListResult,
	GetDiscountRequestDTO,
	HttpStatusCode,
	MessageType,
	ModalType,
} from '@repo/shared';
import { configDiscountTable } from 'src/tableConfigs/promotion-settings';

import CoreDynamicTable from '@/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/CIBase/CoreDynamicTable/TablePageLayout';
import AddEditViewDiscountModal from '@/components/Project/AdminSetting/AddEditViewDiscountModal';
import { useDiscountFormatTableData } from '@/hooks/tableData/useDiscountFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { PermissionsProps } from '@/shared/types/auth';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

interface PromotionSettingsProps extends PermissionsProps {}

const PromotionSettings = ({}: PromotionSettingsProps) => {
	const modal = useModalProvider();
	const [keyword, setKeyword] = useState<string>('');
	const [departmentId, setDepartmentId] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	// --- EFFECT ---

	useEffect(() => {
		const departmentId = localStorage.getItem('departmentId');

		if (departmentId) setDepartmentId(departmentId);
	}, []);

	// --- API ---
	const [switchDiscountStatus, { loading: switchDiscountStatusLoading }] = useLazyRequest(api.switchDiscountStatus, {
		onError: generalErrorHandler,
	});

	const { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh } = useDiscountFormatTableData({
		query: { keyword, departmentId },
	});

	// --- FUNCTIONS ---

	const handleAddEditViewDiscount = (discountId?: string) => {
		const rowData = tableData?.find((x) => x.id === discountId);

		const modalType =
			discountId && rowData?.status === DiscountStatus.EXPIRED
				? ModalType.VIEW
				: discountId
					? ModalType.EDIT
					: ModalType.ADD;

		modal.openModal({
			title: `${
				{
					[ModalType.ADD]: '新增',
					[ModalType.EDIT]: '編輯',
					[ModalType.VIEW]: '檢視',
				}[modalType]
			}折扣碼`,
			noAction: true,
			marginBottom: true,
			noEscAndBackdrop: true,
			width: 480,
			children: <AddEditViewDiscountModal modalType={modalType} handleRefresh={handleRefresh} rowData={rowData} />,
		});
	};

	const handleDiscountRole = async ({ id, rowData }: { id: string; rowData: DiscountTableListResult }) => {
		if (rowData.status) {
			modal.openMessageModal({
				type: MessageType.ERROR,
				title: `停用此折扣碼`,
				content: `一旦停用，使用者將無法使用此折扣碼得到優惠`,
				confirmLabel: `停用`,
				onClose: async (action) => {
					if (action === DialogAction.CONFIRM) {
						const { statusCode } = await switchDiscountStatus({ discountId: id });

						if (statusCode === HttpStatusCode.OK) {
							showToast(`已停用`, 'success');
							handleRefresh();
							close?.();
						}
					}
				},
			});
		} else {
			const { statusCode } = await switchDiscountStatus({ discountId: id });

			if (statusCode === HttpStatusCode.OK) {
				showToast(`已啟用`, 'success');
				handleRefresh();
				close?.();
			}
		}
	};

	const isLoading = tableDataLoading || switchDiscountStatusLoading;

	return (
		<TablePageLayout
			title='折扣碼設定'
			handleAction={() => handleAddEditViewDiscount()}
			coreButtonProps={{ label: '新增折扣碼' }}
		>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={configDiscountTable.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋折扣碼或備註' }}
					unused={configDiscountTable?.unfilteredFields}
					queryDto={() => GetDiscountRequestDTO}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configDiscountTable.tableId}
				headData={configDiscountTable.columns}
				dataCount={tableDataCount}
				isLoading={isLoading}
			>
				<CoreDynamicTableList<DiscountTableListResult>
					rows={formatTableData}
					tableConfig={configDiscountTable}
					handleTableRowClick={(rowData) => handleAddEditViewDiscount(rowData.id)}
					handleSwitch={(id, rowData) => handleDiscountRole({ id, rowData })}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default PromotionSettings;
