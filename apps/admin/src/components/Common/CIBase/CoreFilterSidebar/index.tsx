import React, { useEffect, useId, useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton } from '@mui/material';
import { Option, SelectOption, TableType } from '@repo/shared';

import CoreButton from '@/CIBase/CoreButton';
import { Translation } from '@/shared/constants/translation';
import { deleteFilterItem, resetFilterState } from '@/state/slices/searchFilterSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import {
	StyledClearButtonWrapper,
	StyledContent,
	StyledDrawerTitle,
	StyledFilterConditionCategory,
	StyledFilterConditionItem,
	StyledFilterConditionItemName,
	StyledFilterConditionWrapper,
	StyledFilterWrapper,
	StyledNav,
	StyledResultCount,
	StyledResultWrapper,
} from './styles';
interface CoreFilterSidebarProps {
	children?: React.ReactNode;
	startElement?: React.ReactNode;
	tableDataCount?: number;
	tableId: TableType;
}

const CoreFilterSidebar = ({ children, startElement, tableDataCount, tableId }: CoreFilterSidebarProps) => {
	const dispatch = useAppDispatch();
	const filteredData = useAppSelector((state) => state.searchFilter.filterManager[tableId]);
	const hasFilterData =
		filteredData &&
		Object.entries(filteredData).length > 0 &&
		Object.entries(filteredData).some(([_, values]) => {
			if (Array.isArray(values) && values.length === 0) {
				return false;
			}
			if (
				typeof values === 'object' &&
				values !== null &&
				!Array.isArray(values) &&
				!(values as SingleValue<Option>)?.value
			) {
				return false;
			}
			return true;
		});

	const [drawer, setDrawerOpen] = useState<boolean>(false);

	const [clear, setClear] = useState(1);

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setDrawerOpen(open);
	};

	useEffect(() => {
		return () => {
			dispatch(resetFilterState());
		};
	}, [dispatch]);

	const uniqueId = useId();

	return (
		<>
			{/* Filter Button */}
			<StyledFilterWrapper>
				{startElement}
				<CoreButton color='default' iconType='tableFilter' label='Filter' size='small' onClick={toggleDrawer(true)} />
			</StyledFilterWrapper>

			{hasFilterData && (
				<>
					<StyledResultWrapper>
						<StyledResultCount>{tableDataCount}</StyledResultCount> 筆查詢結果
					</StyledResultWrapper>

					<StyledFilterConditionWrapper>
						<>
							{Object.entries(filteredData).map(([key, values]) => {
								if (Array.isArray(values) && values.length === 0) {
									return null;
								}
								if (
									typeof values === 'object' &&
									values !== null &&
									!Array.isArray(values) &&
									!(values as SingleValue<Option>)?.value
								) {
									return null;
								}

								return (
									<StyledFilterConditionItem key={key}>
										<StyledFilterConditionCategory>{Translation[key]}</StyledFilterConditionCategory>
										<StyledFilterConditionWrapper>
											{values && (values as MultiValue<Option>)?.length > 0 ? (
												(values as MultiValue<Option>)?.map(({ label, value }: SelectOption) => (
													<StyledFilterConditionItemName key={label}>
														{label}
														<IconButton
															onClick={() => {
																const restFilteredData =
																	(filteredData['key'] as MultiValue<Option>)?.filter(
																		(f: SelectOption) => f.value !== value,
																	) ?? [];
																// dispatch(deleteFilterItem({ tableId, key, option: restFilteredData }));
																dispatch(
																	deleteFilterItem({
																		tableId,
																		key,
																		option: restFilteredData,
																	}),
																);
															}}
														>
															<CancelIcon sx={{ fontSize: '13px' }} />
														</IconButton>
													</StyledFilterConditionItemName>
												))
											) : (
												<StyledFilterConditionItemName key={(values as SingleValue<Option>)?.label}>
													{(values as SingleValue<Option>)?.label}
													<IconButton
														onClick={() => {
															dispatch(
																deleteFilterItem({
																	tableId,
																	key,
																	option: values,
																}),
															);
														}}
													>
														<CancelIcon sx={{ fontSize: '13px' }} />
													</IconButton>
												</StyledFilterConditionItemName>
											)}
										</StyledFilterConditionWrapper>
									</StyledFilterConditionItem>
								);
							})}

							<CoreButton
								label='清除'
								color='error'
								size='small'
								iconType='delete'
								variant='text'
								onClick={() => {
									setClear((prev) => prev + 1);
									dispatch(resetFilterState());
								}}
							/>
						</>
					</StyledFilterConditionWrapper>
				</>
			)}

			{/* Right Sidebar */}
			<Drawer anchor='right' open={drawer} onClose={toggleDrawer(false)} closeAfterTransition={false}>
				<StyledDrawerTitle>
					篩選
					<IconButton onClick={toggleDrawer(false)}>
						<CloseIcon sx={{ fontSize: '18px' }} />
					</IconButton>
				</StyledDrawerTitle>
				<StyledNav>
					<StyledContent>
						{React.Children.map(children, (child) => {
							if (React.isValidElement(child)) {
								return React.cloneElement(child as React.ReactElement, {
									key: `${uniqueId}-${clear}`,
									filteredData,
								});
							}
							return child;
						})}
					</StyledContent>
				</StyledNav>

				<StyledClearButtonWrapper>
					<CoreButton
						label='清除'
						color='default'
						size='large'
						iconType='filterClear'
						variant='outlined'
						width='100%'
						onClick={() => {
							setClear((prev) => prev + 1);
							dispatch(resetFilterState());
						}}
					/>
				</StyledClearButtonWrapper>
			</Drawer>
		</>
	);
};

export default CoreFilterSidebar;
