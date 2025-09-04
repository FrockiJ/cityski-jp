import { MultiValue, SingleValue } from 'react-select';
import { FilterContext, FilterField, FilterType, Option, SelectOption } from '@repo/shared';
import dayjs from 'dayjs';

import { deleteFilterItem, resetFilterState } from '@/state/slices/searchFilterSlice';
import { useAppDispatch } from '@/state/store';

import CoreButton from '../../../CoreButton';
import { ResultWrapper } from '../../../ResultWrapper';
import { FilterConditionItem } from '../FilterConditionItem';
import { FilterConditionItemName } from '../FilterDConditionItemName';

interface FilterConditionOnTableProps {
	tableId: string;
	filteredData: FilterContext;
	tableDataCount: number;
	filterFields: FilterField[];
	setClear: React.Dispatch<React.SetStateAction<number>>;
}

function FilterConditionOnTable({
	tableId,
	filteredData,
	tableDataCount,
	filterFields,
	setClear,
}: FilterConditionOnTableProps) {
	const dispatch = useAppDispatch();

	if (!filteredData) return null;

	const hasFilterData = Object.entries(filteredData)?.length > 0;

	const showFilterConditionItem = (
		key: string,
		value: MultiValue<Option> | SingleValue<Option> | string | Date,
		type: FilterType,
	) => {
		// FIXME: not include FilterType.RADIO and FilterType.CHECKBOX
		switch (type) {
			case FilterType.SELECT:
				// single-select
				return [
					<FilterConditionItemName
						key={key}
						label={(value as SelectOption).label}
						onClick={() => {
							dispatch(deleteFilterItem({ tableId, key, option: value }));
						}}
					/>,
				];

			case FilterType.SELECT_MULTI:
				// multiple-select
				return (value as SelectOption[]).map((option, i) => (
					<FilterConditionItemName
						key={i}
						label={option.label}
						onClick={() => {
							const restFilteredData = (filteredData[key] as Option[]).filter((f) => f.value !== option.value) ?? [];

							dispatch(deleteFilterItem({ tableId, key, option: restFilteredData }));
						}}
					/>
				));
			case FilterType.DATETIME:
				return [
					<FilterConditionItemName
						key={key}
						label={dayjs(value as string).format('YYYY/MM/DD')}
						onClick={() => {
							dispatch(deleteFilterItem({ tableId, key, option: [] }));
						}}
					/>,
				];
			case FilterType.DATETIME_END:
				return [
					<FilterConditionItemName
						key={key}
						label={dayjs(value as string).format('YYYY/MM/DD')}
						onClick={() => {
							dispatch(deleteFilterItem({ tableId, key, option: [] }));
						}}
					/>,
				];
			case FilterType.TEXT:
				return [
					<FilterConditionItemName
						key={key}
						label={String(value)}
						onClick={() => {
							dispatch(deleteFilterItem({ tableId, key, option: [] }));
						}}
					/>,
				];

			default:
				return [<>N/A</>];
		}
	};

	return (
		<>
			{Object.keys(filteredData).length > 0 && <ResultWrapper count={tableDataCount || 0} />}

			{filterFields.map(({ key, type, label }) => {
				if (filteredData !== null && filteredData?.[key]) {
					const value = filteredData[key];
					return hasFilterData ? (
						<FilterConditionItem key={key} categoryLabel={label}>
							{showFilterConditionItem(key, value, type)}
						</FilterConditionItem>
					) : null;
				} else {
					return null;
				}
			})}

			{hasFilterData && (
				<CoreButton
					label='清除'
					color='error'
					iconType='delete'
					variant='text'
					onClick={() => {
						setClear((prev) => prev + 1);
						dispatch(resetFilterState());
					}}
				/>
			)}
		</>
	);
}

export default FilterConditionOnTable;
