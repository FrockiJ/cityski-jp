import { CmsTableListResult, HomeAreaType } from '@repo/shared';
import { configCmsTable } from 'src/tableConfigs/content-management';

import CoreDynamicTable from '@/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/CIBase/CoreDynamicTable/CoreDynamicTableList';
import TablePageLayout from '@/CIBase/CoreDynamicTable/TablePageLayout';
import ManageVideoModal from '@/components/Project/ContentManagement/ManageVideoModal';
import { useCmsFormatTableData } from '@/hooks/tableData/useCmsFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import ManageBannerModal from '@/project/ContentManagement/ManageBannerModal';
import { PermissionsProps } from '@/shared/types/auth';

interface ContentManagementProps extends PermissionsProps {}

const ContentManagement = ({}: ContentManagementProps) => {
	const modal = useModalProvider();

	// --- API ---

	const { formatTableData, tableDataLoading, handleRefresh } = useCmsFormatTableData();

	// --- FUNCTIONS ---

	const handleTableRowClick = (rowData?: CmsTableListResult) => {
		if (!rowData) return;

		if (rowData.homeAreaType === HomeAreaType.BANNER) {
			modal.openModal({
				title: '編輯單幅廣告',
				center: false,
				fullScreen: true,
				noAction: true,
				marginBottom: true,
				children: <ManageBannerModal handleRefresh={handleRefresh} />,
			});
		}

		if (rowData.homeAreaType === HomeAreaType.VIDEO) {
			modal.openModal({
				title: '編輯影片專區',
				center: false,
				fullScreen: true,
				noAction: true,
				marginBottom: true,
				children: <ManageVideoModal handleRefresh={handleRefresh} />,
			});
		}
	};

	return (
		<TablePageLayout title='首頁'>
			<CoreDynamicTable
				id={configCmsTable.tableId}
				headData={configCmsTable.columns}
				dataCount={2}
				isLoading={tableDataLoading}
				isBorderRadius
			>
				<CoreDynamicTableList<CmsTableListResult>
					rows={formatTableData}
					tableConfig={configCmsTable}
					handleTableRowClick={handleTableRowClick}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default ContentManagement;
