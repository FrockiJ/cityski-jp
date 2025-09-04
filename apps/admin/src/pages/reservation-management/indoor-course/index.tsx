import { useEffect, useState } from 'react';
import { debounce } from '@mui/material';
import { ReservationIndoorTableListResult } from '@repo/shared';
import { ModalType } from '@repo/shared';
import { GetCoursesRequestDTO } from '@repo/shared/dist/dto/courses/get-courses-request.dto';
import { configReservationsIndoorTable } from 'src/tableConfigs/reservations-indoor';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/components/Common/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/components/Common/CIBase/CoreDynamicTable/TablePageLayout';
import AddEditReservationIndoorModal from '@/components/Project/ReservationManagement/AddEditReservationIndoorModal';
import { useCourseFormatTableData } from '@/hooks/tableData/useCourseFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';

const IndoorCoursePage = () => {
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
	const { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh } = useCourseFormatTableData({
		query: { keyword, departmentId },
	});

	return (
		<TablePageLayout
			title='預約管理'
			handleActionList={
				<CoreButton
					variant='contained'
					iconType='add'
					label='新增預約'
					onClick={() =>
						modal.openModal({
							title: `新增預約`,
							center: true,
							fullScreen: true,
							noAction: true,
							marginBottom: true,
							children: (
								<AddEditReservationIndoorModal modalType={ModalType.ADD} courseType={''} courseStatusType={0} />
							),
						})
					}
				/>
			}
		>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={configReservationsIndoorTable.tableId}
					tableDataCount={0}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋學員或課程名稱' }}
					unused={configReservationsIndoorTable?.unfilteredFields}
					queryDto={() => GetCoursesRequestDTO}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configReservationsIndoorTable.tableId}
				headData={configReservationsIndoorTable.columns}
				dataCount={0}
				isLoading={false}
			>
				<CoreDynamicTableList<ReservationIndoorTableListResult>
					rows={[]}
					tableConfig={configReservationsIndoorTable}
					// handleTableRowClick={(rowData) => handleTableRowClick(rowData.id)}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default IndoorCoursePage;
