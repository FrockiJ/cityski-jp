import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, debounce } from '@mui/material';
import { BtnActionType, OrderByType, TableType } from '@repo/shared';

import CoreButton from '@/CIBase/CoreButton';
import CoreFilterSidebar from '@/CIBase/CoreFilterSidebar';
import CoreInput from '@/CIBase/CoreInput';
import CorePaper from '@/CIBase/CorePaper';
import CoreTable from '@/CIBase/CoreTable';
import PageControl from '@/components/PageControl';
import AccountDetailsModal from '@/Example/account/AccountDetailsModal';
import AccountSidebarModal from '@/Example/account/AccountSidebarModal';
import TableCheckboxList from '@/Example/table-checkbox/TableDataList';
import useGetTableData from '@/hooks/useGetTableData';
import { RoleRowData } from '@/shared/types/roleModel';
import { setModal } from '@/state/slices/layoutSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

// Default Sort order_By, order
const DEFAULT_ORDER_BY = 'updated_time';
const DEFAULT_ORDER = OrderByType.desc;

const TableCheckbox = () => {
	const dispatch = useAppDispatch();
	const tableSort = useAppSelector((state) => state.table.tableSort);
	const [keyword, setKeyword] = useState('');

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<RoleRowData>({
		queryUrl: '/account',
		tableId: TableType.TRole,
		conditions: { keyword },
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
	});

	const handleOpenModal = () => {
		dispatch(
			setModal({
				title: '新增帳號',
				children: <AccountDetailsModal mutate={handleRefresh} mode='add' />,
			}),
		);
	};

	// selectable checkbox list
	const [checkedList, setCheckedList] = useState<string[]>([]);
	console.log({ checkedList });

	const handleCheckedList = (ids: string[]) => {
		setCheckedList(ids);
	};

	return (
		<>
			<PageControl
				title='帳號管理'
				hasNav
				rightElement={
					<CoreButton
						variant='contained'
						color='primary'
						label='新增帳號'
						iconType={BtnActionType.ADD}
						onClick={handleOpenModal}
					/>
				}
			/>

			<CorePaper card>
				<Box sx={{ padding: '20px 24px' }}>
					<CoreFilterSidebar
						tableId={TableType.TAccount}
						startElement={
							<CoreInput
								placeholder='輸入使用者名稱或帳號'
								name='account'
								startAdornment={<SearchIcon />}
								inputStyle={{ width: '100%' }}
								onChange={debounce((event) => setKeyword(event.target.value), 300)}
							/>
						}
						tableDataCount={tableDataCount}
					>
						<AccountSidebarModal tableId={TableType.TDemo} />
					</CoreFilterSidebar>
				</Box>

				<CoreTable
					id={TableType.TAccount}
					type={TableType.TAccount}
					dataCount={tableDataCount}
					isLoading={tableDataLoading}
					defaultOrderBy={DEFAULT_ORDER_BY}
					defaultOrder={DEFAULT_ORDER}
					selectable
					handleCheckedList={handleCheckedList}
				>
					<TableCheckboxList rows={tableData ?? []} mutate={handleRefresh} />
				</CoreTable>
			</CorePaper>
		</>
	);
};

export default TableCheckbox;
