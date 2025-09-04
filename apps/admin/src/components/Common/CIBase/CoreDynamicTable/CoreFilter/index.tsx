import { useEffect, useState } from 'react';
import { MultiValue } from 'react-select';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton } from '@mui/material';
import { FilterField, FilterType, getPropertiesMap, OptionNames, SelectOption } from '@repo/shared';
import { plainToClass } from 'class-transformer';

import CoreButton from '@/CIBase/CoreButton';
import { useInitialOptions } from '@/hooks/useInitialOptions';
import { FilterInfo } from '@/shared/core/constants/interface/decorator';
import { ObjectType, PropertyTypeFactory } from '@/shared/types/common';
import { resetFilterState } from '@/state/slices/searchFilterSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import 'reflect-metadata';

import SearchBar, { SearchBarProps } from '../SearchBar';

import FilterConditionOnTable from './FilterConditionOnTable';
import { FilterGroup } from './FilterGroup';
import { DrawerTitle, List, ListItem, ListItemText, Nav, StyledFilterSearchWrapper } from './styles';

interface CoreFilterProps<T> {
	tableId: string;
	tableDataCount?: number;
	isDisplayCondition?: boolean;
	searchOptions?: SearchBarProps;
	queryDto: () => ObjectType<T>;
	unused?: PropertyTypeFactory<T>;
	handleClickFilter?: () => void;
}

function CoreFilter<T extends object>({
	tableId,
	tableDataCount,
	isDisplayCondition = true,
	searchOptions,
	queryDto,
	unused,
	handleClickFilter,
}: CoreFilterProps<T>) {
	const dispatch = useAppDispatch();
	const filteredData = useAppSelector((state) => state.searchFilter.filterManager[tableId]);

	const [drawer, setDrawerOpen] = useState<boolean>(false);
	const [clear, setClear] = useState(1);

	const queryInstance = plainToClass(queryDto(), {}, { exposeUnsetFields: true });
	const propertiesMap = queryInstance ? getPropertiesMap<T>(queryInstance) : null;
	const unusedProperties = unused && propertiesMap ? unused(propertiesMap) : [];

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setDrawerOpen(open);
	};

	const optionData = useInitialOptions();

	const filterFields =
		queryInstance &&
		Object.keys(queryInstance).reduce<FilterField[]>((accumulator, key) => {
			const filterInfo: FilterInfo = Reflect.getMetadata('filterInfo', queryInstance, key);

			if (unusedProperties.find((p) => p === key)) return accumulator;

			if (filterInfo) {
				accumulator.push({
					key,
					label: filterInfo.label ?? '',
					type: filterInfo.type ?? FilterType.SELECT,
					options: (optionData as { [key in OptionNames]?: MultiValue<SelectOption> })?.[filterInfo.options] ?? [],
					sequence: filterInfo.sequence ?? 0,
					placeholder: filterInfo.placeholder,
					startDateKey: filterInfo.startDateKey,
					endDateKey: filterInfo.endDateKey,
					menuPlacement: filterInfo.menuPlacement,
				});
			}

			return accumulator;
		}, []);

	const filterList = () =>
		filterFields &&
		filterFields
			.sort((f1, f2) => f1.sequence - f2.sequence)
			.map((field, index) => (
				<ListItem key={field.key + index} type={field.type}>
					{field.type !== FilterType.DATETIME_END && <ListItemText primary={field.label} />}

					<FilterGroup field={field} tableId={tableId} clear={clear} />
				</ListItem>
			));

	useEffect(() => {
		return () => {
			dispatch(resetFilterState());
		};
	}, [dispatch]);

	return (
		<Box>
			{/*  Right Site Filter Section */}
			<Drawer anchor='right' open={drawer} onClose={toggleDrawer(false)} closeAfterTransition={false}>
				<DrawerTitle>
					篩選
					<IconButton onClick={toggleDrawer(false)}>
						<CloseIcon sx={{ fontSize: 18 }} />
					</IconButton>
				</DrawerTitle>
				<Nav>
					<List>{filterList()}</List>
				</Nav>

				<Box mx={3}>
					<CoreButton
						color='default'
						iconType='filterClear'
						variant='outlined'
						label='清除'
						aria-label='DrawerClear'
						size='large'
						width='100%'
						onClick={() => {
							setClear((prev) => prev + 1);
							dispatch(resetFilterState());
						}}
					/>
				</Box>
			</Drawer>

			{/*  Table Filter Section */}
			<StyledFilterSearchWrapper>
				{searchOptions && <SearchBar {...searchOptions}></SearchBar>}
				<CoreButton
					color='default'
					iconType='tableFilter'
					label='篩選'
					size='small'
					onClick={(event) => {
						toggleDrawer(true)(event);

						if (handleClickFilter) handleClickFilter();
					}}
				/>
			</StyledFilterSearchWrapper>

			{isDisplayCondition && filterFields && (
				<FilterConditionOnTable
					tableId={tableId}
					filterFields={filterFields}
					filteredData={filteredData}
					tableDataCount={tableDataCount ?? 0}
					setClear={setClear}
				/>
			)}
		</Box>
	);
}

export default CoreFilter;
