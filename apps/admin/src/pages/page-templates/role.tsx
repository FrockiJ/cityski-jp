import { useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Box, debounce } from '@mui/material';
import { BtnActionType, OrderByType, TableType } from '@repo/shared';

import CoreButton from '@/CIBase/CoreButton';
import CoreInput from '@/CIBase/CoreInput';
import CorePaper from '@/CIBase/CorePaper';
import CoreTable from '@/CIBase/CoreTable';
import SearchIcon from '@/components/Common/Icon/SearchIcon';
import PageControl from '@/components/PageControl';
import RoleDetailsModal from '@/Example/role/RoleDetailsModal';
import RoleList from '@/Example/role/RoleList';
import withDynamicPermissions from '@/HOC/withDynamicPermissions';
import useGetTableData from '@/hooks/useGetTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { PermissionsProps } from '@/shared/types/auth';
import { RoleRowData } from '@/shared/types/roleModel';
import { useAppSelector } from '@/state/store';

const ButtonWithPermissions = withDynamicPermissions(CoreButton, false);

interface RoleProps extends PermissionsProps {}

const Role = ({}: RoleProps) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const modal = useModalProvider();
	const [keyword, setKeyword] = useState('');

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<RoleRowData>({
		queryUrl: '/role',
		tableId: TableType.TRole,
		conditions: { keyword },
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
		// options,
	});

	const handleOpenModal = () => {
		modal.openModal({
			title: '新增角色',
			size: 'medium',
			children: <RoleDetailsModal mutate={handleRefresh} mode='add' />,
		});
	};

	// draggable
	const [items, setItems] = useState(tableData);

	const handleDragEnd = (result: DropResult) => {
		const reorder = (list: any[], startIndex: number, endIndex: number) => {
			const result = Array.from(list);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result;
		};

		const updatedItems = reorder(
			items && items.length > 0 ? items : (tableData ?? []),
			result.source.index,
			result?.destination?.index || 0,
		);

		setItems(updatedItems);
	};

	return (
		<>
			<PageControl
				title='角色權限(托拉功能, 欄位sticky功能)'
				hasNav
				rightElement={
					<ButtonWithPermissions
						variant='contained'
						color='primary'
						label='新增角色'
						iconType={BtnActionType.ADD}
						onClick={handleOpenModal}
					/>
				}
			/>
			<CorePaper card>
				<Box sx={{ padding: '20px 24px' }}>
					<CoreInput
						placeholder='搜尋角色名稱'
						name='role'
						startAdornment={<SearchIcon />}
						inputStyle={{ width: '100%' }}
						onChange={debounce((event) => setKeyword(event.target.value), 300)}
					/>
				</Box>
				<CoreTable
					id={TableType.TRole}
					type={TableType.TRole}
					dataCount={tableDataCount}
					isLoading={tableDataLoading}
					// defaultOrderBy={DEFAULT_ORDER_BY}
					// defaultOrder={DEFAULT_ORDER}
					draggable
					handleDragEnd={handleDragEnd}
				>
					<RoleList rows={items && items.length > 0 ? items : (tableData ?? [])} mutate={handleRefresh} />
				</CoreTable>
			</CorePaper>
		</>
	);
};

export default Role;
