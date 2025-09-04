import { useCallback, useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Box, debounce } from '@mui/material';
import { QueryDemoDto, TableConfig, TableType } from '@repo/shared';
import { demoTableConfig } from 'src/tableConfigs/demo/demoTableConfig';
import PropsLink from 'src/template-only/components/PropsLink';

import CoreButton from '@/CIBase/CoreButton';
import CoreDynamicTableList from '@/CIBase/CoreDynamicTable/CoreDynamicTableList';
import CoreFilter from '@/CIBase/CoreDynamicTable/CoreFilter';
import { StyledSearchFilterWrapper } from '@/CIBase/CoreDynamicTable/CoreFilter/styles';
import CoreLabel from '@/CIBase/CoreLabel';
import CoreDynamicTable from '@/components/Common/CIBase/CoreDynamicTable';
import CoreTable from '@/components/Common/CIBase/CoreTable';
import PageControl from '@/components/PageControl';
import Code from '@/Example/Code';
import CustomList from '@/Example/ExampleTable/CustomList';
import SimpleList from '@/Example/ExampleTable/SimpleList';
import Intro from '@/Example/Intro';
import { StyledLink } from '@/Example/styles';
import useGetTableDataHook from '@/hooks/apiResDataHandler/useGetTableDataHook';
import { useDemoFormatTableData } from '@/hooks/tableData/useDemoFormatTableData';
import { DemoListResultI } from '@/shared/core/constants/interface/listResults/demoResult';

const TableDocs = () => {
	const { tableData, tableDataCount, tableDataLoading } = useGetTableDataHook({
		type: TableType.T1,
	});

	const {
		tableData: t2TableData,
		tableDataCount: t2TableDataCount,
		tableDataLoading: t2TableDataLoading,
	} = useGetTableDataHook({
		type: TableType.T2,
	});

	const {
		tableData: t3TableData,
		tableDataCount: t3TableDataCount,
		tableDataLoading: t3TableDataLoading,
	} = useGetTableDataHook({
		type: TableType.T3,
	});

	// selectable checkbox list
	const [checkedList, setCheckedList] = useState<string[]>([]);
	console.log({ checkedList });

	const handleCheckedList = (ids: string[]) => {
		setCheckedList(ids);
	};

	// draggable example
	const [items, setItems] = useState(t3TableData);

	const handleDragEnd = (result: DropResult) => {
		const reorder = (list: any[], startIndex: number, endIndex: number) => {
			const result = Array.from(list);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result;
		};

		const updatedItems = reorder(
			((items?.length || 0) > 0 ? items : tableData) as any[],
			result.source.index,
			result?.destination?.index || 0,
		);

		setItems(updatedItems);
	};

	// dynamic table
	const [tableConfig] = useState<TableConfig<DemoListResultI, QueryDemoDto>>(
		// use first bookingConfigList as default
		demoTableConfig,
	);

	/* Search Input API & State */
	const [keyword, setKeyword] = useState<string>('');
	const handleSearch = debounce((e: any) => {
		setKeyword(e.target.value.trim());
	}, 300);

	/* Fetching Table Data */
	const {
		formatTableData,
		tableDataCount: demoTableCount,
		handleRefresh,
	} = useDemoFormatTableData({
		query: { keyword },
	});

	const handleManage = useCallback(() => {
		// modal.openModal({
		// 	title: 'User Details',
		// 	center: true,
		// 	fullScreen: true,
		// 	confirmLabel: 'Close',
		// 	deleteLabel: 'Delete User',
		// 	noDelete: true,
		// 	children: <ManageUserDetailsModal rowId={id} handleReFetch={handleReFetch} />,
		// });
	}, []);
	// const queryInstance = new QueryDemoDto();

	return (
		<>
			<PageControl title='Table' hasNav />

			<PropsLink url={'/docs/props/table'} />
			<Box>
				<Intro
					title='Common Table'
					content={
						<>
							<Box typography='subtitle1'>Steps for usage</Box>
							<ul>
								<li>
									Import Table component from <CoreLabel>src/components/Common/CIBase/CoreTable</CoreLabel>
								</li>
								<li>
									Add a new field from the TableType of
									<CoreLabel>src/shared/constants/enums</CoreLabel>, and add it to the value of the type of Table.
								</li>
								<li>
									Add a new field from <CoreLabel>src/components/Common/CIBase/CoreTable/tableConfig</CoreLabel> to set
									the relevant value of table header.
								</li>
								<li>
									Create a List component and write TableRow from{' '}
									<CoreLabel>src/components/Common/CIBase/CoreTable/CoreTableBody/CoreTableRow</CoreLabel> and
									CoreTableCell from{' '}
									<CoreLabel>src/components/Common/CIBase/CoreTable/CoreTableBody/CoreTableCell</CoreLabel> in it, and
									loop.
								</li>
							</ul>
							<Box typography='subtitle1'>Pagination section</Box>
							<Box my={1}>
								The information of pagination from API data and using{' '}
								<CoreLabel color='primary'>{`dispatch(setTablePagination({...pagination}))`}</CoreLabel> to dispatch it
								to the pagination component for controlling the switching of previous and next pages and changing the
								page number.
							</Box>
							<Box>
								<CoreLabel color='primary'>{`dispatch(setTablePagination({...pagination}))`}</CoreLabel> format is{' '}
								<Code
									code={`{
	current_page: 1,  //當前頁
	current_page_value_from: 1,  //當前頁的開頭筆數
	current_page_value_to: 5,  //當前頁的結尾筆數
	num_values: 12,  //全頁總筆數
	total_pages: 2,  //總頁數
}`}
								/>
								, it can adjust the fields according to your needs
							</Box>
							<Box typography='subtitle1'>Sort section</Box>
							<Box>
								Add <CoreLabel color='info'>sort: true</CoreLabel> from{' '}
								<CoreLabel>src/components/Common/CIBase/CoreTable/tableConfig</CoreLabel>, table header will have sort
								function.
							</Box>
							<Box>
								If you want to have a default value, you can add{' '}
								<CoreLabel color='info'>defaultOrderBy, defaultOrder</CoreLabel> to the prop of the table component, the
								default sort icon will appear in the table header.
							</Box>
							<Box>
								You can get the current <CoreLabel color='info'>orderBy, order</CoreLabel> value through{' '}
								<CoreLabel color='primary'>{`useSelector(selectTableSort)`}</CoreLabel>.
							</Box>
						</>
					}
				/>
				<Intro title='Simple Table' />
				<CoreTable id={TableType.T1} type={TableType.T1} dataCount={tableDataCount} isLoading={tableDataLoading}>
					{tableData && <SimpleList rows={tableData} />}
				</CoreTable>

				<Intro
					title='Selectable Table & Sticky Cell'
					content={
						<>
							Add <CoreLabel color='info'>selectable</CoreLabel>, <CoreLabel color='info'>handleCheckedList</CoreLabel>{' '}
							to control checkbox.
							<Code
								code={`
// 紀錄所有勾選的id
const [checkedList, setCheckedList] = useState<string[]>([]);
const handleCheckedList = (ids: string[]) => {
	setCheckedList(ids);
};
			
// 在CoreTable加入 selectable, handleCheckedList
<CoreTable
	...
	selectable
	handleCheckedList={handleCheckedList}
>

-----------------------------
// 在tableList加入以下
interface TableListProps {
	...
	selectable?: boolean;
	handleGetIds?: (ids: string[]) => void; // 讓勾選全部取得所有的id
	handleCheckedItem?: (rowId: string) => (checked: boolean) => void; // 處理單向勾選
	checkedList?: string[]; // 紀錄目前勾選的id
}

// 傳送所有的id，讓勾選全部知道所有的id有什麼
useEffect(() => {
	handleGetIds?.(rows.map(({ _id }) => _id));
}, [rows]);

<CoreTableRow
	...
	{...(selectable && {
		selectable,
		handleChecked: handleCheckedItem?.(row._id),
		controlChecked: checkedList?.includes(row._id),
	})}
								`}
							/>
							<br />
							state Add <CoreLabel color='info'>sticky</CoreLabel> prop to {`<CoreTableCell... />`}. ex:
							<CoreLabel>Conference</CoreLabel>, <CoreLabel>Created</CoreLabel>, <CoreLabel>Coach</CoreLabel>
							<Code code={`<CoreTableCell sticky .../>`} />
						</>
					}
				/>
				<CoreTable
					id={TableType.T2}
					type={TableType.T2}
					dataCount={t2TableDataCount}
					isLoading={t2TableDataLoading}
					selectable
					handleCheckedList={handleCheckedList}
				>
					{t2TableData && <CustomList rows={t2TableData} />}
				</CoreTable>

				<Intro
					title='Dragger Table'
					content={
						<>
							Dragger feature use{' '}
							<StyledLink href='https://github.com/hello-pangea/dnd' rel='noreferrer' target='_blank'>
								@hello-pangea/dnd
							</StyledLink>{' '}
							package.
							<br />
							<br />
							Add <CoreLabel color='info'>draggable</CoreLabel>, <CoreLabel color='info'>handleDragEnd</CoreLabel> to
							control checkbox.
							<Code
								code={`
// 處理拖曳放掉後的function
const handleDragEnd = (result: DropResult) => {
	...
};

// 在Table加入 draggable, handleDragEnd
<CoreTable
	...
	selectable
	handleDragEnd={handleDragEnd}
>

-----------------------------
// 在tableList加入以下
interface TableListProps {
	...
	draggable?: boolean;
}

<CoreTableRow
	...
	{...(draggable && {
		draggable,
		draggableId: row._id, //此為拖曳套件必給的prop
		draggableIndex: index, //此為拖曳套件必給的prop
	})}
											`}
							/>
						</>
					}
				/>
				<CoreTable
					id={TableType.T3}
					type={TableType.T3}
					dataCount={t3TableDataCount}
					isLoading={t3TableDataLoading}
					draggable
					handleDragEnd={handleDragEnd}
				>
					{t3TableData && <CustomList rows={((items?.length || 0) > 0 ? items : t3TableData) as any[]} />}
				</CoreTable>

				<Intro title='Dynamic Table' content={<>Dynamic Table</>} />

				<StyledSearchFilterWrapper>
					<CoreFilter
						tableId={tableConfig.tableId}
						tableDataCount={tableDataCount}
						searchOptions={{
							onChange: handleSearch,
							value: keyword,
							placeholder: 'Search name or email',
						}}
						// keys to decide filter components
						queryDto={() => QueryDemoDto}
						// unused={query => [query.endArchiveDate]}
						unused={tableConfig?.unfilteredFields}
					/>
					{/* Create Button */}
					<CoreButton iconType='add' label='Add' onClick={() => handleManage()} />
				</StyledSearchFilterWrapper>
				<CoreDynamicTable
					id={demoTableConfig.tableId}
					// Table Column Header Data
					headData={demoTableConfig.columns}
					// Total Data Amount
					dataCount={demoTableCount}
				>
					<CoreDynamicTableList<DemoListResultI>
						// Formatted Table Data
						rows={formatTableData}
						// Table Config
						tableConfig={demoTableConfig}
						// Edit Button on Table Row
						handleTableRowClick={() => {}}
						handleRefresh={handleRefresh}
						// Delete Button on Table Row
						// handleDelete={handleDelete}
					/>
				</CoreDynamicTable>
			</Box>
		</>
	);
};

export default TableDocs;
