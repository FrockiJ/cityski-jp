import React, { useEffect, useState } from 'react';
import { debounce } from '@mui/material';
import { GetOrdersRequestDTO, ModalType, OrderTableListResult } from '@repo/shared';
import { configOrdersTable } from 'src/tableConfigs/orders';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/components/Common/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/components/Common/CIBase/CoreDynamicTable/TablePageLayout';
import TabsHeader from '@/components/Common/CIBase/CoreDynamicTable/TabsHeader';
import EditOrderModal from '@/components/Project/OrderManagement/EditOrderModal';
import useModalProvider from '@/hooks/useModalProvider';
import { setTableSort } from '@/state/slices/tableSlice';
import { useAppDispatch } from '@/state/store';

const OrderManagementOverseasLessonPage = () => {
	const modal = useModalProvider();
	const dispatch = useAppDispatch();
	const [keyword, setKeyword] = useState<string>('');
	const [departmentId, setDepartmentId] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

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

	return (
		<TablePageLayout
			title='訂單管理'
			handleActionList={
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
					queryDto={() => GetOrdersRequestDTO}
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

export default OrderManagementOverseasLessonPage;
