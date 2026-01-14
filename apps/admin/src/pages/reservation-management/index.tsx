import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { debounce } from '@mui/material';
import { GetReservationsRequestDto, ModalType, ReservationIndoorTableListResult } from '@repo/shared';
import { createReservationsIndoorTableConfig } from 'src/tableConfigs/reservations-indoor';

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

const ReservationManagementPage = () => {
	const modal = useModalProvider();
	const dispatch = useAppDispatch();
	const [keyword, setKeyword] = useState<string>('');
	const [departmentId, setDepartmentId] = useState<string>('');

	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	// 獲取表格數據
	const { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh } =
		useReservationFormatTableData({
			query: {
				keyword: keyword || undefined,
				departmentId: departmentId || undefined,
			},
			type: 'indoor',
		});

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

	// 從localStorage獲取departmentId
	useEffect(() => {
		const deptId = localStorage.getItem('departmentId');
		if (deptId) setDepartmentId(deptId);
	}, []);

	// 重置表格排序
	useEffect(() => {
		return () => {
			dispatch(setTableSort({ order: null, orderBy: '' }));
		};
	}, [dispatch]);

	// 預加載當前部門的教練列表（只在進入頁面時 fetch 一次）
	useEffect(() => {
		if (departmentId) {
			fetchCoachesForDepartment(departmentId);
		}
	}, [departmentId, fetchCoachesForDepartment]);

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

	// 處理編輯預約
	const handleEditReservation = (reservationId: string) => {
		const rowData = tableData?.find((x) => x.id === reservationId);
		if (!rowData) return;

		modal.openModal({
			title: '編輯預約',
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: (
				<AddEditReservationIndoorModal
					handleRefresh={handleRefresh}
					modalType={ModalType.EDIT}
					courseType={''}
					courseStatusType={0}
					reservationId={reservationId}
				/>
			),
		});
	};

	return (
		<TablePageLayout title='預約管理'>
			<StyledSearchFilterWrapper>
				<CoreFilter
					tableId={tableConfig.tableId}
					tableDataCount={tableDataCount}
					searchOptions={{
						onKeyDown: handleSearch,
						value: keyword,
						placeholder: '搜尋學員或課程名稱',
					}}
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

export default ReservationManagementPage;
