import React, { useState } from 'react';
import { Box, debounce } from '@mui/material';
import { GetCoursesRequestDTO, ModalType, OrderTableListResult } from '@repo/shared';
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
import useModalProvider from '@/hooks/useModalProvider';

const OrderManagementIndoorCoursePage = () => {
	const modal = useModalProvider();
	const [keyword, setKeyword] = useState<string>('');
	const [departmentId, setDepartmentId] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

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
			/>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={configOrdersTable.tableId}
					tableDataCount={0}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋會員姓名或訂單編號' }}
					unused={configOrdersTable?.unfilteredFields}
					queryDto={() => GetCoursesRequestDTO}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configOrdersTable.tableId}
				headData={configOrdersTable.columns}
				dataCount={0}
				isLoading={false}
			>
				<CoreDynamicTableList<OrderTableListResult>
					rows={[]}
					tableConfig={configOrdersTable}
					// handleTableRowClick={(rowData) => handleTableRowClick(rowData.id)}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default OrderManagementIndoorCoursePage;
