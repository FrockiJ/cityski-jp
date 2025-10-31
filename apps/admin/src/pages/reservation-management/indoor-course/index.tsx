import { useEffect, useState } from 'react';
import { debounce } from '@mui/material';
import { useRouter } from 'next/router';
import { ReservationIndoorTableListResult, GetReservationsRequestDto } from '@repo/shared';
import { ModalType } from '@repo/shared';
import { configReservationsIndoorTable } from 'src/tableConfigs/reservations-indoor';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/components/Common/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/components/Common/CIBase/CoreDynamicTable/TablePageLayout';
import AddEditReservationIndoorModal from '@/components/Project/ReservationManagement/AddEditReservationIndoorModal';
import { useReservationFormatTableData } from '@/hooks/tableData/useReservationFormatTableData';
import useModalProvider from '@/hooks/useModalProvider';

const IndoorCoursePage = () => {
	const modal = useModalProvider();
	const router = useRouter();
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

	// Auto-open modal when reservationId or action=add is in URL query
	useEffect(() => {
		if (router.isReady) {
			// 編輯模式：有 reservationId
			if (router.query.reservationId) {
				const reservationId = router.query.reservationId as string;
				handleEditReservation(reservationId);
				router.replace('/reservation-management/indoor-course', undefined, { shallow: true });
			}
			// 新增模式：action=add 且有 orderId 和 index
			else if (router.query.action === 'add' && router.query.orderId && router.query.index !== undefined) {
				const orderId = router.query.orderId as string;
				const index = parseInt(router.query.index as string, 10);
				handleAddReservation(orderId, index);
				router.replace('/reservation-management/indoor-course', undefined, { shallow: true });
			}
		}
	}, [router.isReady, router.query]);

	// --- HANDLERS ---
	const handleEditReservation = (reservationId: string) => {
		modal.openModal({
			title: `編輯預約`,
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: (
				<AddEditReservationIndoorModal
					modalType={ModalType.EDIT}
					courseType={''}
					courseStatusType={0}
					reservationId={reservationId}
					handleRefresh={handleRefresh}
				/>
			),
		});
	};

	const handleAddReservation = (orderId: string, index: number) => {
		modal.openModal({
			title: `新增預約`,
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: (
				<AddEditReservationIndoorModal
					modalType={ModalType.ADD}
					courseType={''}
					courseStatusType={0}
					orderId={orderId}
					reservationIndex={index}
					handleRefresh={handleRefresh}
				/>
			),
		});
	};

	// --- API ---
	const { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh } = useReservationFormatTableData({
		query: { keyword, departmentId },
		type: 'indoor',
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
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋學員或課程名稱' }}
					unused={configReservationsIndoorTable?.unfilteredFields}
					queryDto={() => GetReservationsRequestDto}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={configReservationsIndoorTable.tableId}
				headData={configReservationsIndoorTable.columns}
				dataCount={tableDataCount}
				isLoading={tableDataLoading}
			>
			<CoreDynamicTableList<ReservationIndoorTableListResult>
				rows={formatTableData as ReservationIndoorTableListResult[]}
				tableConfig={configReservationsIndoorTable}
				handleTableRowClick={(rowData) => handleEditReservation(rowData.id)}
			/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default IndoorCoursePage;
