import { useState } from 'react';
import { debounce } from '@mui/material';
import { DialogAction, OrderByType, QueryDemoDto } from '@repo/shared';
import { demoTableConfig } from 'src/tableConfigs/demo/demoTableConfig';

import CoreDynamicTable from '@/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/CIBase/CoreDynamicTable/TablePageLayout';
import { useDemoFormatTableData } from '@/hooks/tableData/useDemoFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { DemoListResultI } from '@/shared/core/constants/interface/listResults/demoResult';
import { PermissionsProps } from '@/shared/types/auth';

const DEFAULT_ORDER_BY = 'updated_time';
const DEFAULT_ORDER = OrderByType.desc;

interface DynamicTableProps extends PermissionsProps {
	handleCloseModal?: (action: DialogAction) => void;
}

const Demo = ({ text }: { text: string }) => <p>{text}</p>;

const DynamicTable = ({ handleCloseModal }: DynamicTableProps) => {
	const modal = useModalProvider();

	const [keyword, setKeyword] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	const { formatTableData, tableDataCount, handleRefresh } = useDemoFormatTableData({
		query: { keyword },
	});

	const handleDemoEdit = (rowData?: DemoListResultI) => {
		if (!rowData) return;

		modal.openModal({
			title: 'Demo',
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: <Demo text='Demo Modal' />,
			onClose: (action) => {
				if (action === DialogAction.CONFIRM) {
					// close modal after
					handleCloseModal?.(DialogAction.CONFIRM);
				}
			},
		});
	};

	return (
		<TablePageLayout title='動態表格'>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={demoTableConfig.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onChange: handleSearch, value: keyword, placeholder: 'Search name or email' }}
					queryDto={() => QueryDemoDto}
					unused={demoTableConfig?.unfilteredFields}
				/>
			</StyledSearchFilterWrapper>
			<CoreDynamicTable
				id={demoTableConfig.tableId}
				headData={demoTableConfig.columns}
				dataCount={tableDataCount}
				defaultOrderBy={DEFAULT_ORDER_BY}
				defaultOrder={DEFAULT_ORDER}
			>
				<CoreDynamicTableList<DemoListResultI>
					rows={formatTableData}
					tableConfig={demoTableConfig}
					// handleTableRowClick={handleTableRowClick}
					handleEdit={(id, rowData) => handleDemoEdit(rowData)}
					handleRefresh={handleRefresh}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default DynamicTable;
