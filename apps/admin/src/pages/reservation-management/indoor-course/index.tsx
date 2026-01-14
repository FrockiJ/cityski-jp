import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { debounce } from '@mui/material';
import { useRouter } from 'next/router';
import { ReservationIndoorTableListResult, GetReservationsRequestDto } from '@repo/shared';
import { ModalType } from '@repo/shared';
import { createReservationsIndoorTableConfig } from 'src/tableConfigs/reservations-indoor';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreDynamicTableList from '@/components/Common/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import TablePageLayout from '@/components/Common/CIBase/CoreDynamicTable/TablePageLayout';
import AddEditReservationIndoorModal from '@/components/Project/ReservationManagement/AddEditReservationIndoorModal';
import { useReservationFormatTableData } from '@/hooks/tableData/useReservationFormatTableData';
import { useInstructorSelect } from '@/hooks/useInstructorSelect';
import useModalProvider from '@/hooks/useModalProvider';
import { setTableSort } from '@/state/slices/tableSlice';
import { useAppDispatch } from '@/state/store';

const IndoorCoursePage = () => {
	const modal = useModalProvider();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const times = useRef(0);
	const [keyword, setKeyword] = useState<string>('');
	const [departmentId, setDepartmentId] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	// --- EFFECT ---

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

	useEffect(() => {
		const departmentId = localStorage.getItem('departmentId');

		if (departmentId) setDepartmentId(departmentId);
	}, []);

	// Auto-open modal when reservationId or action=add is in URL query
	useEffect(() => {
		if (!router.isReady) return;
		times.current += 1;
		// 編輯模式：有 reservationId
		if (router.query.reservationId) {
			const reservationId = router.query.reservationId as string;
			handleEditReservation(reservationId);
		}
		// 新增模式：action=add 且有 orderId 和 index
		else if (router.query.action === 'add' && router.query.orderId && router.query.index !== undefined) {
			const orderId = router.query.orderId as string;
			const index = parseInt(router.query.index as string, 10);
			handleAddReservation(orderId, index);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

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
	const { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh } = useReservationFormatTableData(
		{
			query: {
				keyword: keyword || undefined,
				departmentId: departmentId || undefined
			},
			type: 'indoor',
		},
	);

	// 使用教練選單Hook
	const { coachesMap, fetchCoachesForDepartment, handleInstructorChange } = useInstructorSelect({
		onError: (error) => {
			modal.openModal({
				title: '錯誤',
				center: true,
				children: <div>{error}</div>,
			});
		},
	});

	// 獲取教練選項的函數 - 使用當前用戶選擇的部門
	const getCoachOptions = useCallback(
		(rowDepartmentId: string) => {
			// 使用當前登入用戶的部門ID，而不是預約的部門ID
			const options = coachesMap[departmentId] || [{ value: '', label: '未指定' }];
			return options;
		},
		[coachesMap, departmentId]
	);

	// 處理教練變更
	const handleInstructorChangeWrapper = useCallback(
		async (reservationId: string, newInstructor: string, row: any) => {
			await handleInstructorChange(reservationId, newInstructor);
		},
		[handleInstructorChange]
	);

	// 創建動態表格配置
	const tableConfig = useMemo(() => {
		return createReservationsIndoorTableConfig(getCoachOptions, handleInstructorChangeWrapper);
	}, [getCoachOptions, handleInstructorChangeWrapper]);

	// 預加載當前部門的教練列表（只在進入頁面時 fetch 一次）
	useEffect(() => {
		if (departmentId) {
			fetchCoachesForDepartment(departmentId);
		}
	}, [departmentId, fetchCoachesForDepartment]);

	return (
		<TablePageLayout
			title='預約管理'
			// handleActionList={
				// <CoreButton
					// variant='contained'
					// iconType='add'
					// label='新增預約'
					// onClick={() =>
					// 	modal.openModal({
					// 		title: `新增預約`,
					// 		center: true,
					// 		fullScreen: true,
					// 		noAction: true,
					// 		marginBottom: true,
					// 		children: (
					// 			<AddEditReservationIndoorModal modalType={ModalType.ADD} courseType={''} courseStatusType={0} />
					// 		),
					// 	})
					// }
				// />
			// }
		>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={tableConfig.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{ onKeyDown: handleSearch, value: keyword, placeholder: '搜尋學員或課程名稱' }}
					unused={tableConfig?.unfilteredFields}
					queryDto={() => GetReservationsRequestDto}
				/>
			</StyledSearchFilterWrapper>

			<CoreDynamicTable
				id={tableConfig.tableId}
				headData={tableConfig.columns}
				dataCount={tableDataCount}
				isLoading={tableDataLoading}
			>
				<CoreDynamicTableList<ReservationIndoorTableListResult>
					rows={formatTableData as ReservationIndoorTableListResult[]}
					tableConfig={tableConfig}
					handleTableRowClick={(rowData) => handleEditReservation(rowData.id)}
				/>
			</CoreDynamicTable>
		</TablePageLayout>
	);
};

export default IndoorCoursePage;
