import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import CoreDatePicker from '@/components/Common/CIBase/CoreDatePicker';
import { addFilterItem } from '@/state/slices/searchFilterSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

interface FilterDateProps {
	tableId: string;
	filterKey: string;
	placeholder?: string;
	startDateKey?: string;
	endDateKey?: string;
	clear: number;
}

const FilterDate = ({ tableId, filterKey, clear, startDateKey, endDateKey, placeholder }: FilterDateProps) => {
	const dispatch = useAppDispatch();
	const filteredData = useAppSelector((state) => state.searchFilter.filterManager[tableId]);

	const [data, setData] = useState<Dayjs | null>(null);
	const [minDate, setMinDate] = useState<Dayjs | undefined>(
		startDateKey ? dayjs(String(filteredData?.[startDateKey])) : undefined,
	);
	const [maxDate, setMaxDate] = useState<Dayjs | undefined>(
		endDateKey ? dayjs(String(filteredData?.[endDateKey])) : undefined,
	);

	useEffect(() => {
		const tempData = dayjs(String(filteredData?.[filterKey]));
		if (tempData?.isValid()) {
			setData(tempData);
		} else {
			setData(null);
		}
		const tempStartDate = startDateKey ? dayjs(String(filteredData?.[startDateKey])) : undefined;
		setMinDate(tempStartDate);
		setMaxDate(endDateKey ? dayjs(String(filteredData?.[endDateKey])) : undefined);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredData]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const key = useMemo(() => uuidv4(), [clear]);

	return (
		<CoreDatePicker
			key={key}
			value={data}
			placeholder={placeholder}
			onChange={(date) => {
				if (date?.isValid()) {
					dispatch(
						addFilterItem({
							tableId,
							key: filterKey,
							option: date.toISOString(),
						}),
					);
				}
			}}
			minDate={minDate}
			maxDate={maxDate}
		/>
	);
};

export default FilterDate;
