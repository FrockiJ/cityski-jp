import { useMemo } from 'react';
import { debounce } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import CoreInput from '@/components/Common/CIBase/CoreInput';
import { addFilterItem } from '@/state/slices/searchFilterSlice';
import { useAppDispatch } from '@/state/store';

import 'reflect-metadata';

interface FilterInputProps {
	tableId: string;
	filterKey: string;
	placeholder?: string;
	clear: number;
	defaultValue?: string;
}

const FilterInput = ({ placeholder, tableId, filterKey, clear, defaultValue }: FilterInputProps) => {
	const dispatch = useAppDispatch();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const key = useMemo(() => uuidv4(), [clear]);

	return (
		<CoreInput
			key={key}
			wrapperSxProps={{ width: '100%' }}
			rootStyle={{ width: '100%' }}
			id={key}
			placeholder={placeholder}
			defaultValue={defaultValue}
			onChange={debounce((value) => {
				dispatch(addFilterItem({ tableId, key: filterKey as string, option: value }));
			}, 300)}
		/>
	);
};

export default FilterInput;
