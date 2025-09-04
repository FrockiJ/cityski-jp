import { useMemo } from 'react';
import { MultiValue } from 'react-select';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Option } from '@repo/shared';
import { v4 as uuidv4 } from 'uuid';

import { addFilterItem, deleteFilterItem } from '@/state/slices/searchFilterSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

interface FilterCheckboxProps {
	options: MultiValue<Option>;
	tableId: string;
	filterKey: string;
	clear: number;
}

const FilterCheckbox = ({ tableId, options, filterKey, clear }: FilterCheckboxProps) => {
	const dispatch = useAppDispatch();
	const filteredData = useAppSelector((state) => state.searchFilter.filterManager[tableId]);
	const data: Option[] = (filteredData?.[filterKey] as []) ?? [];

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const key = useMemo(() => uuidv4(), [clear]);

	return (
		<>
			{options.map((opt: Option) => (
				<FormControlLabel
					key={key}
					value={opt.value}
					checked={data.some((o) => o.value === opt.value)}
					onChange={(event: any, checked) => {
						if (checked) {
							dispatch(addFilterItem({ tableId, key: filterKey as string, option: [...data, opt] }));
						} else {
							dispatch(
								deleteFilterItem({
									tableId,
									key: filterKey as string,
									option: data.filter((o) => o.value !== opt.value),
								}),
							);
						}
					}}
					control={<Checkbox sx={{ padding: '10px' }} />}
					label={'label' in opt ? opt.label : ''}
					componentsProps={{ typography: { sx: { fontSize: '14px' } } }}
				/>
			))}
		</>
	);
};

export default FilterCheckbox;
