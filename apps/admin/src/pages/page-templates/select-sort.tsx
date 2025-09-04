import { useState } from 'react';
import { OrderByType, SelectOption, TableType } from '@repo/shared';

import CorePaper from '@/CIBase/CorePaper';
import CoreTable from '@/CIBase/CoreTable';
import PageControl from '@/components/PageControl';
import SelectSortList from '@/Example/selectSort/SelectSortList';

// Default Sort order_By, order
const DEFAULT_ORDER_BY = 'updated_time';
const DEFAULT_ORDER = OrderByType.desc;

const FakeData = [
	{ sort: 3, coach: 'test1' },
	{ sort: null, coach: 'test2' },
	{ sort: 1, coach: 'test3' },
	{ sort: 2, coach: 'test4' },
	{ sort: null, coach: 'test5' },
];

const SelectSort = () => {
	const [data, setData] = useState(FakeData);

	const handleOnSelect = (value: SelectOption['value'], index: number) => {
		const findIndex = data.findIndex(({ sort }) => sort === +value);

		if (findIndex >= 0) {
			setData((prev) => {
				prev[findIndex].sort = prev[index].sort;
				prev[index].sort = +value;
				let newPrev = [...prev];
				return newPrev;
			});
		}
	};

	return (
		<>
			<PageControl title='順序下拉排列範例' hasNav />

			<CorePaper card>
				<CoreTable
					id={TableType.TSelectSort}
					type={TableType.TSelectSort}
					dataCount={FakeData.length}
					defaultOrderBy={DEFAULT_ORDER_BY}
					defaultOrder={DEFAULT_ORDER}
				>
					<SelectSortList rows={data} handleOnSelect={handleOnSelect} />
				</CoreTable>
			</CorePaper>
		</>
	);
};

export default SelectSort;
