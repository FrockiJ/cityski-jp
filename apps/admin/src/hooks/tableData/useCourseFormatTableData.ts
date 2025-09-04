import { useEffect, useState } from 'react';
import {
	CourseBkgType,
	CourseStatusType,
	CourseTableListResult,
	CourseType,
	GetCoursesRequestDTO,
	GetCoursesResponseDTO,
	OrderByType,
	SortType,
} from '@repo/shared';
import dayjs from 'dayjs';
import { configCoursesTable } from 'src/tableConfigs/course-products';

import useGetTableData from '@/hooks/useGetTableData';
import { useAppSelector } from '@/state/store';

type Props = {
	query?: GetCoursesRequestDTO;
	sort?: SortType;
};

export const useCourseFormatTableData = (options?: Props) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<GetCoursesResponseDTO>({
		queryUrl: '/api/courses',
		tableId: configCoursesTable.tableId,
		conditions: options?.query,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
		options: { noFetch: !options?.query?.departmentId },
	});

	const [formatTableData, setFormatTableData] = useState<CourseTableListResult[]>([]);

	const formatDate = (date: string | null) => {
		if (!date || !dayjs(date).isValid()) return '--';
		return dayjs(date).format('YYYY/MM/DD');
	};

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((data) => {
				const tableRowData = {
					id: data.id,
					no: data.no,
					name: data.name,
					status: {
						[CourseStatusType.DRAFT]: '草稿',
						[CourseStatusType.SCHEDULED]: '排程中',
						[CourseStatusType.PUBLISHED]: '已上架',
						[CourseStatusType.UNPUBLISHED]: '已下架',
					}[data.status],
					type: {
						[CourseType.GROUP]: '團體課',
						[CourseType.PRIVATE]: '私人課',
						[CourseType.INDIVIDUAL]: '個人練習',
					}[data.type],
					bkgType: {
						[CourseBkgType.FLEXIBLE]: '預約式課程',
						[CourseBkgType.FIXED]: '指定式課程',
					}[data.bkgType],
					releaseDate: formatDate(data.releaseDate),
					removalDate: formatDate(data.removalDate),
					updatedTime: formatDate(data.updatedTime),
				};
				return tableRowData;
			});

			setFormatTableData(data);
		}
	}, [tableData]);

	return {
		formatTableData,
		tableData,
		tableDataCount,
		tableDataLoading,
		handleRefresh,
	};
};
