import { useState } from 'react';
import { Box, debounce } from '@mui/material';
import { OrderByType, TableType } from '@repo/shared';

import CoreButton from '@/CIBase/CoreButton';
import CoreFilterSidebar from '@/CIBase/CoreFilterSidebar';
import CoreInput from '@/CIBase/CoreInput';
import CorePaper from '@/CIBase/CorePaper';
import CoreTable from '@/CIBase/CoreTable';
import SearchIcon from '@/components/Common/Icon/SearchIcon';
import PageControl from '@/components/PageControl';
import AccountDetailsModal from '@/Example/account/AccountDetailsModal';
import AccountList from '@/Example/account/AccountList';
import AccountSidebarModal from '@/Example/account/AccountSidebarModal';
import withDynamicPermissions from '@/HOC/withDynamicPermissions';
import useGetTableData from '@/hooks/useGetTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { PermissionsProps } from '@/shared/types/auth';
import { RoleRowData } from '@/shared/types/roleModel';
import { useAppSelector } from '@/state/store';

const ButtonWithPermissions = withDynamicPermissions(CoreButton);

interface AccountProps extends PermissionsProps {}

const Account = ({}: AccountProps) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);
	const modal = useModalProvider();
	const [keyword, setKeyword] = useState('');
	console.log({ keyword });

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<RoleRowData>({
		queryUrl: '/account',
		tableId: TableType.TAccount,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
	});

	const handleOpenModal = () => {
		modal.openModal({
			title: '新增帳號',
			children: <AccountDetailsModal mutate={handleRefresh} mode='add' />,
		});
	};

	return (
		<>
			<PageControl
				title='帳號管理'
				hasNav
				rightElement={
					<ButtonWithPermissions iconType='add' label='新增帳號' variant='contained' onClick={handleOpenModal} />
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
						<AccountSidebarModal tableId={TableType.TAccount} />
					</CoreFilterSidebar>
				</Box>

				<CoreTable
					id={TableType.TAccount}
					type={TableType.TAccount}
					dataCount={tableDataCount}
					isLoading={tableDataLoading}
					// defaultOrderBy={DEFAULT_ORDER_BY}
					// defaultOrder={DEFAULT_ORDER}
				>
					<AccountList rows={tableData ?? []} mutate={handleRefresh} />
				</CoreTable>
			</CorePaper>
		</>
	);
};

export default Account;
