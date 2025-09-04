import { useEffect, useState } from 'react';
import { Box, debounce } from '@mui/material';
import { CourseTableListResult, GetCoursesRequestDTO, ModalType } from '@repo/shared';
import { configCoursesTable } from 'src/tableConfigs/course-products';

import CoreButton from '@/CIBase/CoreButton';
import CoreDynamicTable from '@/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/CIBase/CoreDynamicTable/TablePageLayout';
import AddEditViewCourseModal from '@/components/Project/CourseProducts/AddEditViewCourseIndoorModal';
import ManagePublishedCourseModal from '@/components/Project/CourseProducts/ManagePublishedCourseModal';
import ManageReservePlaceModal from '@/components/Project/CourseProducts/ManageReservePlaceModal';
import SelectCourseTypeModal from '@/components/Project/CourseProducts/SelectCourseTypeModal';
import { useCourseFormatTableData } from '@/hooks/tableData/useCourseFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';
import { PermissionsProps } from '@/shared/types/auth';

interface CourseProductsIndoorPageProps extends PermissionsProps {}

const CourseProductsIndoorPage = ({}: CourseProductsIndoorPageProps) => {
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

	// --- FUNCTIONS ---

	const handleManageReservePlace = ({ modalType }: { modalType: ModalType }) => {
		modal.openModal({
			title: `場地預約管理`,
			width: 492,
			noEscAndBackdrop: true,
			noAction: true,
			children: <ManageReservePlaceModal />,
		});
	};

	const handleManagePublishedCourse = ({ modalType }: { modalType: ModalType }) => {
		modal.openModal({
			title: `管理上架課程排序`,
			width: 720,
			noEscAndBackdrop: true,
			noAction: true,
			children: <ManagePublishedCourseModal />,
		});
	};

	const handleChoseNewCourse = () => {
		modal.openModal({
			title: `新增課程`,
			width: 480,
			noEscAndBackdrop: true,
			noAction: true,
			marginBottom: true,
			children: <SelectCourseTypeModal handleRefresh={handleRefresh} />,
		});
	};

	const handleTableRowClick = (courseId?: string) => {
		const rowData = tableData?.find((x) => x.id === courseId);
		if (!rowData) return;

		modal.openModal({
			title: `編輯課程`,
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: (
				<AddEditViewCourseModal
					handleRefresh={handleRefresh}
					modalType={ModalType.EDIT}
					rowData={rowData}
					courseType={rowData.type}
					courseStatusType={rowData.status}
				/>
			),
		});
	};

	const isLoading = tableDataLoading;

	return (
		<TablePageLayout
			title='室內課程'
			handleActionList={
				<Box display='flex' gap={1.5}>
					<CoreButton
						variant='outlined'
						label='場地預約管理'
						onClick={() => handleManageReservePlace({ modalType: ModalType.ADD })}
					/>
					<CoreButton
						variant='outlined'
						label='管理上架課程排序'
						onClick={() => handleManagePublishedCourse({ modalType: ModalType.ADD })}
					/>
					<CoreButton variant='contained' iconType='add' label='新增課程' onClick={() => handleChoseNewCourse()} />
				</Box>
			}
		>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={configCoursesTable.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋課程名稱' }}
					unused={configCoursesTable?.unfilteredFields}
					queryDto={() => GetCoursesRequestDTO}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configCoursesTable.tableId}
				headData={configCoursesTable.columns}
				dataCount={tableDataCount}
				isLoading={isLoading}
			>
				<CoreDynamicTableList<CourseTableListResult>
					rows={formatTableData}
					tableConfig={configCoursesTable}
					handleTableRowClick={(rowData) => handleTableRowClick(rowData.id)}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default CourseProductsIndoorPage;
