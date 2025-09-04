import React, { useEffect, useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, FormControl, Radio, Stack, styled, SxProps, Tooltip } from '@mui/material';
import { CourseBkgType, CourseStatusType, CourseType, CreateCoursePlanRequestDto, ModalType } from '@repo/shared';
import dayjs from 'dayjs';
import { FieldConfig, useField } from 'formik';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreLabel from '@/components/Common/CIBase/CoreLabel';
import CoreBlockRow from '@/components/Common/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import { FormikErrorMessage } from '@/components/Common/CIBase/Formik/common/FormikComponents';
import AddEditPlanModal from '@/components/Project/CourseProducts/AddEditViewCourseIndoorModal/PlanDetails/AddEditPlanModal';
import * as Components from '@/components/Project/shared/Components';
import useModalProvider from '@/hooks/useModalProvider';
import InfoIcon from '@/Icon/InfoIcon';

// Helper function to format session dates nicely
const formatSessionDates = (sessions?: any[]) => {
	if (!sessions || !sessions.length) return '';

	return sessions
		.map((session) => {
			const startTime = dayjs(session.startTime);
			const endTime = dayjs(session.endTime);

			if (!startTime.isValid() || !endTime.isValid()) return '';

			return `${startTime.format('YYYY/MM/DD HH:mm')}-${endTime.format('HH:mm')}`;
		})
		.join('\n');
};

const StyledTitle = styled('div')(({ theme }) => ({
	...theme.typography.body2,
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.grey['700'],
	marginBottom: '8px',
	fontWeight: 500,
}));

const StyledSessionsList = styled('div')(({ theme }) => ({
	whiteSpace: 'pre-line',
	maxHeight: '100px',
	overflowY: 'auto',
	fontSize: '14px',
	color: theme.palette.text.secondary,
}));

export interface CoursePlanTableProps extends FieldConfig {
	name: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
	info?: string;
	title?: string;
	width?: string;
	margin?: string;
	isRequired?: boolean;
	disabled?: boolean;
	wrapperSxProps?: SxProps;
	courseType: CourseType;
	bkgType: CourseBkgType;
	planList: CreateCoursePlanRequestDto[];
	updatePlanList: (planList: CreateCoursePlanRequestDto[]) => void;
	hasSubmitted?: boolean;
	isSavingDraft?: boolean;
	courseStatusType?: CourseStatusType;
}

const CoursePlanTable = ({
	name,
	disabled,
	onChange,
	info,
	title,
	width,
	margin,
	isRequired,
	wrapperSxProps,
	bkgType,
	courseType,
	planList,
	updatePlanList,
	hasSubmitted = false,
	isSavingDraft = false,
	courseStatusType,
}: CoursePlanTableProps) => {
	// console.log('planList', planList);
	const modal = useModalProvider();
	const [field, meta, helpers] = useField(name);
	const error = !!meta.error && !!meta.touched;
	const [value, setValue] = useState('');

	// Only show validation error when form has been submitted and not saving as draft
	const showError = hasSubmitted && !isSavingDraft && planList.length === 0;

	useEffect(() => {
		if (field.value) {
			setValue(field.value);

			helpers.setValue(field.value);
		}
	}, [field.value, helpers]);

	const handleAddEditPlan = ({
		modalType,
		rowData,
	}: {
		modalType: ModalType;
		rowData?: CreateCoursePlanRequestDto;
	}) => {
		modal.openModal({
			title: `${modalType === ModalType.ADD ? '新增' : modalType === ModalType.VIEW ? '檢視' : '編輯'}方案`,
			width: 480,
			noEscAndBackdrop: true,
			noAction: true,
			marginBottom: true,
			children: (
				<AddEditPlanModal
					modalType={modalType}
					bkgType={bkgType}
					courseType={courseType}
					planList={planList}
					updatePlanList={updatePlanList}
					rowData={rowData}
					disabled={disabled}
				/>
			),
		});
	};

	const tableHeaderCoursePlan = [
		{ label: '', width: '100px' },
		{ label: '推薦', width: '140px' },
		{ label: '方案名稱', width: '400px' },
		{ label: '價錢 (NT$)', width: '250px' },
		{ label: '堂數', width: '200px' },
		{ label: '開始時間', width: '600px' },
		{ label: '', width: '300px' },
	];

	return (
		<FormControl
			sx={{
				width: width ? width : 'initial',
				margin: margin ? margin : '0 0 20px 0',
				...wrapperSxProps,
			}}
		>
			{title && (
				<StyledTitle>
					{isRequired && <Box sx={{ color: 'error.main', marginRight: '2px' }}>*</Box>}
					{title}
					{info && (
						<Tooltip title={info}>
							<span style={{ display: 'inherit' }}>
								<InfoIcon color='info' sx={{ ml: 1 }} />
							</span>
						</Tooltip>
					)}
				</StyledTitle>
			)}
			{planList.length === 0 && (
				<>
					<Box
						sx={(theme) => ({
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							padding: '16px 24px',
							borderRadius: 2,
							backgroundColor: 'background.light',
							border: `1px solid ${showError ? theme.palette.error.main : 'transparent'}`,
						})}
					>
						{
							{
								[CourseType.GROUP]: '每堂課按照參加人數計費，等級相似可併班',
								[CourseType.INDIVIDUAL]: '每堂課費用固定，不可併班',
								[CourseType.PRIVATE]: '每堂課費用固定，超過基本人數再加價，不可併班',
							}[courseType]
						}
						{!disabled && (
							<CoreButton
								variant='contained'
								label='新增方案'
								onClick={() => handleAddEditPlan({ modalType: ModalType.ADD })}
							/>
						)}
					</Box>
					{showError && (
						<Box sx={{ color: 'error.main', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
							請新增至少一個方案
						</Box>
					)}
				</>
			)}
			<FormikErrorMessage name={field.name} />
			{planList.length > 0 && (
				<CoreBlockRow flexDirection='column'>
					<Components.Row header tableHeader={tableHeaderCoursePlan}>
						{tableHeaderCoursePlan
							.filter(({ label }) => (bkgType === CourseBkgType.FIXED ? true : label !== '開始時間'))
							.map(({ label, width }, index) => (
								<Components.StyledCell header key={index} width={width}>
									{label}
								</Components.StyledCell>
							))}
					</Components.Row>

					<DragDropContext
						onDragEnd={(result: DropResult) => {
							// If disabled, don't allow reordering
							if (disabled) return;

							const { destination, source } = result;
							if (!destination) return;
							if (destination.droppableId === source.droppableId && destination.index === source.index) return;

							const newCoursePlan = Array.from(planList);
							const [removed] = newCoursePlan.splice(source.index, 1);
							newCoursePlan.splice(destination.index, 0, removed);

							// Update sequences based on new order
							const updatedPlanList = newCoursePlan.map((plan, index) => ({
								...plan,
								sequence: index + 1,
							}));

							updatePlanList(updatedPlanList);
						}}
					>
						<Droppable droppableId='droppable-list'>
							{(droppableProvided, snapshot) => (
								<Box
									ref={droppableProvided.innerRef}
									{...droppableProvided.droppableProps}
									className={snapshot.isDraggingOver ? 'isDraggingOver' : ''}
									sx={{
										display: 'flex',
										flexDirection: 'column',
										// '&.isDraggingOver': {
										// 	backgroundColor: 'primary.light',
										// },
									}}
								>
									{planList
										.sort((a, b) => a.sequence - b.sequence)
										.map((item, index) => {
											// console.log(item);
											const draggableId = `plan-${item.id || index}`;

											return (
												<Draggable key={draggableId} draggableId={draggableId} index={index}>
													{(provided, snapshot) => (
														<Box
															ref={provided.innerRef}
															{...provided.draggableProps}
															sx={{
																opacity: snapshot.isDragging ? 0.9 : 1,
																backgroundColor: snapshot.isDragging ? '#F9FAFB' : 'transparent',
															}}
														>
															<Components.Row>
																<Components.StyledCell width='100px' {...(!disabled && provided.dragHandleProps)}>
																	<DragIndicatorIcon color='disabled' />
																</Components.StyledCell>
																<Components.StyledCell width='140px'>
																	<Radio
																		name='suggestion'
																		value={item.suggestion ? '1' : '0'}
																		checked={item.suggestion}
																		disabled={disabled}
																		onChange={() => {
																			const updatedList = planList.map((plan) => ({
																				...plan,
																				suggestion: plan.sequence === item.sequence ? !plan.suggestion : false,
																			}));
																			updatePlanList(updatedList);
																		}}
																	/>
																</Components.StyledCell>
																<Components.StyledCell width='400px'>
																	{item.name}
																	<Stack ml={1}>
																		{item.promotion ? <CoreLabel color='warning'>優惠</CoreLabel> : ''}
																	</Stack>
																	<Stack ml={1}>
																		{item.suggestion ? <CoreLabel color='success'>推薦</CoreLabel> : ''}
																	</Stack>
																</Components.StyledCell>
																<Components.StyledCell width='250px'>{item.price}</Components.StyledCell>
																<Components.StyledCell width='200px'>{item.number}</Components.StyledCell>
																{bkgType === CourseBkgType.FIXED && (
																	<Components.StyledCell width='600px'>
																		<StyledSessionsList>
																			{item.sessions && item.sessions.length > 0
																				? formatSessionDates(item.sessions)
																				: '(尚未設定課程時間)'}
																		</StyledSessionsList>
																	</Components.StyledCell>
																)}
																<Components.StyledCell width='300px'>
																	<CoreButton
																		variant='text'
																		label={disabled ? '檢視' : '編輯'}
																		onClick={() =>
																			handleAddEditPlan({
																				modalType: disabled ? ModalType.VIEW : ModalType.EDIT,
																				rowData: item,
																			})
																		}
																		margin='0 12px 0 0'
																		sx={{ fontWeight: 400 }}
																	/>
																</Components.StyledCell>
															</Components.Row>
														</Box>
													)}
												</Draggable>
											);
										})}
									{droppableProvided.placeholder}
								</Box>
							)}
						</Droppable>
					</DragDropContext>

					{!disabled && (
						<CoreButton
							iconType='add'
							variant='outlined'
							label='新增方案'
							onClick={() => handleAddEditPlan({ modalType: ModalType.ADD })}
							width='116px'
							margin='24px 0 0 0'
						/>
					)}
				</CoreBlockRow>
			)}
		</FormControl>
	);
};

export default CoursePlanTable;
