import React, { useEffect, useState } from 'react';
import { Box, debounce } from '@mui/material';
import { GetOrdersRequestDTO, ModalType, OrderStatus } from '@repo/shared';
import { configOrdersTable } from 'src/tableConfigs/orders';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/components/Common/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/components/Common/CIBase/CoreDynamicTable/TablePageLayout';
import TabsHeader from '@/components/Common/CIBase/CoreDynamicTable/TabsHeader';
import EditOrderModal from '@/components/Project/OrderManagement/EditOrderModal';
import MonthlyQuotaUsageModal from '@/components/Project/OrderManagement/MonthlyQuotaUsageModal';
import { useOrderFormatTableData } from '@/hooks/tableData/useOrderFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { setTableSort } from '@/state/slices/tableSlice';
import { useAppDispatch } from '@/state/store';

const OrderManagementIndoorCoursePage = () => {
	const modal = useModalProvider();
	const dispatch = useAppDispatch();
	const [keyword, setKeyword] = useState<string>('');
	const [departmentId, setDepartmentId] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);

	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	// Tab狀態對應到OrderStatus的映射
	const getStatusFromTabIndex = (tabIndex: number): number | undefined => {
		switch (tabIndex) {
			case 0: return undefined; // 全部
			case 1: return OrderStatus.PENDING_DEPOSIT; // 待付訂金
			case 2: return OrderStatus.WAITING_FOR_CONFIRMATION; // 等待確認
			case 3: return OrderStatus.ORDER_SUCCESSFUL; // 訂購成功
			case 4: return OrderStatus.ORDER_COMPLETED; // 訂單完成
			case 5: return OrderStatus.ORDER_CANCELED; // 訂購取消
			default: return undefined;
		}
	};

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		const status = getStatusFromTabIndex(newValue);
		setSelectedStatus(status);
	};

	// 為每個 tab 生成獨立的 tableId
	const getTableIdForStatus = (status: number | undefined): string => {
		if (status === undefined) return `${configOrdersTable.tableId}_all`;
		return `${configOrdersTable.tableId}_status_${status}`;
	};

	const currentTableId = getTableIdForStatus(selectedStatus);

	// --- EFFECT ---

	// Reset table sort when component unmounts (user leaves the page)
	useEffect(() => {
		return () => {
			dispatch(
				setTableSort({
					order: null,
					orderBy: '',
				}),
			);
		};
	}, [dispatch]);

	useEffect(() => {
		const departmentId = localStorage.getItem('departmentId');

		if (departmentId) setDepartmentId(departmentId);
	}, []);
	
	// --- API ---

	// 過濾掉 undefined 值以避免驗證錯誤
	const queryParams = {
		keyword,
		departmentId,
		...(selectedStatus !== undefined && { status: selectedStatus }),
	};

	const { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh } = useOrderFormatTableData({
		query: queryParams,
		tableId: currentTableId,
	});

	useEffect(() => {
		console.log('formatTableData: ', formatTableData);
	}, [formatTableData]);

	const isLoading = tableDataLoading;

	const handleTableRowClick = (orderId?: string) => {
		const rowData = tableData?.find((x) => x.id === orderId);
		if (!rowData) return;

		modal.openModal({
			title: `編輯課程`,
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: (
				<EditOrderModal
					handleRefresh={handleRefresh}
					modalType={ModalType.EDIT}
					rowData={rowData}
					courseType={typeof(rowData)}
					courseStatusType={rowData.status}
					orderId={orderId}
				/>
			),
		});
	};

	return (
		<TablePageLayout
			title='訂單管理'
			handleActionList={
				<Box display='flex' gap={1.5}>
					<CoreButton
						variant='outlined'
						label='編輯訂單'
						onClick={() =>
							modal.openModal({
								title: `編輯訂單`,
								center: true,
								fullScreen: true,
								noAction: true,
								marginBottom: true,
								children: <EditOrderModal modalType={ModalType.EDIT} courseType={''} courseStatusType={0} />,
							})
						}
					/>
					<CoreButton
						variant='outlined'
						label='當月使用額度'
						onClick={() =>
							modal.openModal({
								title: `當月使用額度`,
								width: '1000px',
								height: '860px',
								noCancel: true,
								confirmLabel: '關閉',
								children: <MonthlyQuotaUsageModal />,
							})
						}
					/>
				</Box>
			}
		>
			<TabsHeader
				tabs={['全部', '待付訂金', '等待確認', '訂購成功', '訂單完成', '訂購取消']}
				sx={{ bgcolor: 'white', borderBottom: '1px solid #E0E0E0' }}
				onChange={handleTabChange}
			/>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={currentTableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋會員姓名或訂單編號' }}
					unused={configOrdersTable?.unfilteredFields}
					queryDto={() => GetOrdersRequestDTO}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={currentTableId}
				headData={configOrdersTable.columns}
				dataCount={tableDataCount}
				isLoading={isLoading}
			>
				<CoreDynamicTableList<any>
					rows={formatTableData}
					tableConfig={configOrdersTable}
					handleTableRowClick={(rowData) => handleTableRowClick(rowData.id)}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default OrderManagementIndoorCoursePage;
