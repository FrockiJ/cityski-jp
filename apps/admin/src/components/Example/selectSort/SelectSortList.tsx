import { SingleValue } from 'react-select';
import { SelectOption } from '@repo/shared';

import CoreSelect from '@/components/Common/CIBase/CoreSelect';
import CoreTableCell from '@/components/Common/CIBase/CoreTable/CoreTableBody/CoreTableCell';
import CoreTableRow from '@/components/Common/CIBase/CoreTable/CoreTableBody/CoreTableRow';

interface SelectSortListProps {
	rows: any[];
	handleOnSelect: (value: SelectOption['value'], index: number) => void;
}

const optionList = [
	{ label: '1', value: '1' },
	{ label: '2', value: '2' },
	{ label: '3', value: '3' },
];

const SelectSortList = ({ rows, handleOnSelect }: SelectSortListProps) => {
	return (
		<>
			{rows.map((row, index) => (
				<CoreTableRow key={index}>
					<CoreTableCell>
						<CoreSelect
							options={optionList}
							defaultValue={optionList.find(({ value }) => +value === row.sort)}
							onChange={(selectedOption) => {
								const option = selectedOption as SingleValue<SelectOption>;
								option && handleOnSelect(option.value, index);
							}}
							placeholder='排序'
							width='120px'
							margin='0px'
							menuPortal
						/>
					</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
				</CoreTableRow>
			))}
		</>
	);
};

export default SelectSortList;
