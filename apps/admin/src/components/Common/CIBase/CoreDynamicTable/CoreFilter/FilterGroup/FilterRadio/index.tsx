import { useMemo } from 'react';
import { Option, RadioOption } from '@repo/shared';
import { v4 as uuidv4 } from 'uuid';

import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import { addFilterItem } from '@/state/slices/searchFilterSlice';
import { useAppDispatch } from '@/state/store';

import 'reflect-metadata';

interface FilterRadioProps {
	tableId: string;
	filterKey: string;
	clear: number;
	options: Option[];
}

const FilterRadio = ({ clear, options, tableId, filterKey }: FilterRadioProps) => {
	const dispatch = useAppDispatch();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const key = useMemo(() => uuidv4(), [clear]);

	return (
		<CoreRadioGroup
			key={key}
			onChange={(e, value) => {
				if (value) {
					dispatch(addFilterItem({ tableId, key: filterKey as string, option: value }));
				}
			}}
			defaultValue={String(options?.[0]?.value)}
			radios={options.map((opt: Option) => opt as RadioOption)}
			direction='column'
			clear={clear}
		/>
	);
};

export default FilterRadio;
