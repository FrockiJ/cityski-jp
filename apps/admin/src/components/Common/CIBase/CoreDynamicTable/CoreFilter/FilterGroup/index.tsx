import { FilterField, FilterType, SelectOption } from '@repo/shared';

import CoreSelect from '@/CIBase/CoreSelect';
import { addFilterItem, deleteFilterItem } from '@/state/slices/searchFilterSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import 'reflect-metadata';

import FilterCheckbox from './FilterCheckbox';
import FilterDate from './FilterDate';
import FilterInput from './FilterInput';
import FilterRadio from './FilterRadio';

interface FilterGroupProps {
	field: FilterField;
	tableId: string;
	clear: number;
}

export const FilterGroup = ({ field, tableId, clear }: FilterGroupProps) => {
	const dispatch = useAppDispatch();
	const filteredData = useAppSelector((state) => state.searchFilter.filterManager[tableId]);
	const hasFilterData = filteredData && Object.entries(filteredData)?.length > 0;

	const { key, type, options, placeholder, startDateKey, endDateKey, menuPlacement } = field;

	let result = <></>;

	switch (type) {
		case FilterType.SELECT:
			if (!Array.isArray(options)) break;

			result = (
				<CoreSelect
					clear={clear}
					isMulti={false}
					options={options?.map((opt: SelectOption) => opt)}
					placeholder={placeholder}
					defaultValue={hasFilterData ? (filteredData[key] as SelectOption) : []}
					onChange={(option, action) => {
						if (action.action === 'select-option') {
							dispatch(addFilterItem({ tableId, key, option }));
						}

						if (action.action === 'remove-value' && option) {
							dispatch(deleteFilterItem({ tableId, key, option }));
						}
						if (action.action === 'clear' && option) {
							dispatch(deleteFilterItem({ tableId, key, option: [] }));
						}
					}}
				/>
			);
			break;
		case FilterType.SELECT_MULTI:
			if (!Array.isArray(options)) break;

			result = (
				<CoreSelect
					clear={clear}
					isMulti
					options={options?.map((opt: SelectOption) => opt)}
					placeholder={placeholder}
					defaultValue={hasFilterData ? (filteredData[key] as SelectOption) : []}
					menuPlacement={menuPlacement}
					onChange={(option, action) => {
						if (action.action === 'select-option') {
							dispatch(addFilterItem({ tableId, key, option }));
						}

						if (action.action === 'remove-value' && option) {
							dispatch(deleteFilterItem({ tableId, key, option }));
						}
						if (action.action === 'clear' && option) {
							dispatch(deleteFilterItem({ tableId, key, option: [] }));
						}
					}}
				/>
			);
			break;
		case FilterType.RADIO:
			if (!Array.isArray(options)) break;
			result = <FilterRadio clear={clear} tableId={tableId} options={options} filterKey={key}></FilterRadio>;
			break;
		case FilterType.CHECKBOX:
			if (!Array.isArray(options)) break;
			result = <FilterCheckbox clear={clear} tableId={tableId} options={options} filterKey={key} />;
			break;
		case FilterType.TEXT:
			result = (
				<FilterInput
					clear={clear}
					tableId={tableId}
					filterKey={key}
					placeholder={placeholder}
					defaultValue={hasFilterData ? (filteredData[key] as string) : ''}
				/>
			);
			break;
		case FilterType.DATETIME:
		case FilterType.DATETIME_END:
			result = (
				<FilterDate
					filterKey={key}
					placeholder={placeholder}
					startDateKey={startDateKey}
					endDateKey={endDateKey}
					tableId={tableId}
					clear={clear}
				/>
			);
			break;
	}
	return result;
};
