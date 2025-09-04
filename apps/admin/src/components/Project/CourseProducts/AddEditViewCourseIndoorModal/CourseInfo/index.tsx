import React, { useEffect, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Droppable } from '@hello-pangea/dnd';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, FormHelperText, TextField, Typography } from '@mui/material';
import { CourseStatusType } from '@repo/shared';
import { useFormikContext } from 'formik';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreBlockRow from '@/components/Common/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import FormikInput from '@/components/Common/CIBase/Formik/FormikInput';
import * as Components from '@/components/Project/shared/Components';

import { CourseDescItem } from '../types';

interface CourseInfoProps {
	courseTarget: CourseDescItem[];
	setCourseTarget: React.Dispatch<React.SetStateAction<CourseDescItem[]>>;
	practiceContent: CourseDescItem[];
	setPracticeContent: React.Dispatch<React.SetStateAction<CourseDescItem[]>>;
	hasErrors?: boolean;
	isSavingDraft?: boolean;
	courseStatusType?: CourseStatusType;
	hasSubmitted?: boolean;
}

const tableHeaderCourseTarget = [
	{ label: '', width: '60px' },
	{ label: '說明', width: '600px' },
	{ label: '', width: '100px' },
];

const tableHeaderPracticeContent = [
	{ label: '', width: '60px' },
	{ label: '說明', width: '600px' },
	{ label: '', width: '100px' },
];

const CourseInfo: React.FC<CourseInfoProps> = ({
	courseTarget,
	setCourseTarget,
	practiceContent,
	setPracticeContent,
	hasErrors = false,
	isSavingDraft = false,
	courseStatusType,
	hasSubmitted,
}) => {
	const isPublished = courseStatusType === CourseStatusType.PUBLISHED;
	const isUnpublished = courseStatusType === CourseStatusType.UNPUBLISHED;
	const isDisabled = isPublished || isUnpublished;

	// Track validation state
	const [targetErrors, setTargetErrors] = useState<boolean[]>([]);
	const [practiceErrors, setPracticeErrors] = useState<boolean[]>([]);
	const { submitCount } = useFormikContext() || { submitCount: 0 };

	// Update error states when the form is submitted
	useEffect(() => {
		if ((submitCount > 0 || hasErrors) && !isSavingDraft) {
			setTargetErrors(courseTarget.map((item) => !item.explanation || item.explanation.trim() === ''));
			setPracticeErrors(practiceContent.map((item) => !item.explanation || item.explanation.trim() === ''));
		} else if (isSavingDraft) {
			// Clear all errors when saving as draft
			setTargetErrors(courseTarget.map(() => false));
			setPracticeErrors(practiceContent.map(() => false));
		}
	}, [submitCount, courseTarget, practiceContent, hasErrors, isSavingDraft]);

	// Ensure all items have unique IDs for drag and drop
	useEffect(() => {
		if (courseTarget.length > 0) {
			setCourseTarget((prev) =>
				prev.map((item, index) => ({
					...item,
					id: item.id || `temp-target-${index}`,
				})),
			);
		}

		if (practiceContent.length > 0) {
			setPracticeContent((prev) =>
				prev.map((item, index) => ({
					...item,
					id: item.id || `temp-content-${index}`,
				})),
			);
		}
	}, [courseTarget.length, practiceContent.length, setCourseTarget, setPracticeContent]);

	return (
		<>
			<CoreBlockRow flexDirection='column'>
				<Typography variant='body2' color='text.secondary' mb={1}>
					<span style={{ color: '#FF5630' }}>*</span>課程對象
				</Typography>
				<Components.Row header tableHeader={tableHeaderCourseTarget}>
					{tableHeaderCourseTarget.map(({ label, width }, index) => (
						<Components.StyledCell header key={index} width={width}>
							{label}
						</Components.StyledCell>
					))}
				</Components.Row>

				<DragDropContext
					key={`target-${courseTarget.length}`}
					onDragEnd={(result: DropResult) => {
						// If disabled, don't allow reordering
						if (isDisabled) return;

						const { destination, source } = result;
						if (!destination) return;
						if (destination.droppableId === source.droppableId && destination.index === source.index) return;

						const newCourseDesc = Array.from(courseTarget);
						const [removed] = newCourseDesc.splice(source.index, 1);
						newCourseDesc.splice(destination.index, 0, removed);
						setCourseTarget(newCourseDesc);

						// Update error states when items are reordered
						if (submitCount > 0 && !isSavingDraft) {
							const newErrors = [...targetErrors];
							const [removedError] = newErrors.splice(source.index, 1);
							newErrors.splice(destination.index, 0, removedError);
							setTargetErrors(newErrors);
						}
					}}
				>
					<Droppable droppableId='droppable-target-list'>
						{(droppableProvided, snapshot) => (
							<Box
								ref={droppableProvided.innerRef}
								{...droppableProvided.droppableProps}
								className={snapshot.isDraggingOver ? 'isDraggingOver' : ''}
								sx={{
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								{courseTarget.map((item, index) => (
									<Draggable
										key={item.id || `target-item-${index}`}
										draggableId={String(item.id || `target-item-${index}`)}
										index={index}
										isDragDisabled={isDisabled}
									>
										{(provided) => (
											<Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<Components.Row>
													<Components.StyledCell width='60px'>
														<DragIndicatorIcon color={isDisabled ? 'disabled' : 'action'} />
													</Components.StyledCell>
													<Components.StyledCell width='600px'>
														<Box sx={{ width: '100%' }}>
															<TextField
																fullWidth
																size='small'
																placeholder='輸入'
																value={item.explanation || ''}
																inputProps={{ required: false }}
																error={submitCount > 0 && targetErrors[index] && !isSavingDraft}
																disabled={isDisabled}
																onChange={(e) => {
																	const newValue = e.target.value;
																	setCourseTarget((prev) =>
																		prev.map((desc, idx) =>
																			idx === index ? { ...desc, explanation: newValue } : desc,
																		),
																	);

																	// Update error state for this item
																	if (submitCount > 0 && !isSavingDraft) {
																		const newErrors = [...targetErrors];
																		newErrors[index] = !newValue || newValue.trim() === '';
																		setTargetErrors(newErrors);
																	}
																}}
																sx={{
																	'& .MuiOutlinedInput-root': {
																		'&.Mui-focused fieldset': {
																			borderColor: '#637381',
																			borderWidth: '1px',
																		},
																		'&.Mui-error fieldset': {
																			borderColor: '#FF5630',
																		},
																	},
																}}
															/>
															{submitCount > 0 && targetErrors[index] && !isSavingDraft && (
																<FormHelperText error sx={{ marginLeft: '14px' }}>
																	必填欄位
																</FormHelperText>
															)}
														</Box>
													</Components.StyledCell>
													<Components.StyledCell width='100px'>
														{courseTarget.length > 1 && !isDisabled && (
															<CoreButton
																color='error'
																variant='text'
																label='移除'
																onClick={() => {
																	setCourseTarget((prev) => prev.filter((_, idx) => idx !== index));

																	// Update error states when an item is removed
																	if (submitCount > 0 && !isSavingDraft) {
																		setTargetErrors((prev) => prev.filter((_, idx) => idx !== index));
																	}
																}}
																margin='0 12px 0 0'
																sx={{ fontWeight: 400 }}
															/>
														)}
													</Components.StyledCell>
												</Components.Row>
											</Box>
										)}
									</Draggable>
								))}
								{droppableProvided.placeholder}
							</Box>
						)}
					</Droppable>
				</DragDropContext>

				{!isDisabled && (
					<CoreButton
						iconType='add'
						variant='outlined'
						label='新增說明'
						onClick={() => {
							setCourseTarget((prev) => [
								...prev,
								{
									id: `new-target-${Date.now()}`,
									explanation: '',
									type: 'T',
									sequence: prev.length + 1,
								} as CourseDescItem,
							]);

							// Add error state for the new item
							if (submitCount > 0 && !isSavingDraft) {
								setTargetErrors((prev) => [...prev, true]);
							} else {
								// Add non-error state for draft mode
								setTargetErrors((prev) => [...prev, false]);
							}
						}}
						width='116px'
						margin='24px 0 0 0'
					/>
				)}
			</CoreBlockRow>
			<CoreBlockRow flexDirection='column'>
				<Typography variant='body2' color='text.secondary' mb={1}>
					<span style={{ color: '#FF5630' }}>*</span>練習內容
				</Typography>
				<Components.Row header tableHeader={tableHeaderPracticeContent}>
					{tableHeaderPracticeContent.map(({ label, width }, index) => (
						<Components.StyledCell header key={index} width={width}>
							{label}
						</Components.StyledCell>
					))}
				</Components.Row>

				<DragDropContext
					key={`content-${practiceContent.length}`}
					onDragEnd={(result: DropResult) => {
						// If disabled, don't allow reordering
						if (isDisabled) return;

						const { destination, source } = result;
						if (!destination) return;
						if (destination.droppableId === source.droppableId && destination.index === source.index) return;

						const newCourseDesc = Array.from(practiceContent);
						const [removed] = newCourseDesc.splice(source.index, 1);
						newCourseDesc.splice(destination.index, 0, removed);
						setPracticeContent(newCourseDesc);

						// Update error states when items are reordered
						if (submitCount > 0 && !isSavingDraft) {
							const newErrors = [...practiceErrors];
							const [removedError] = newErrors.splice(source.index, 1);
							newErrors.splice(destination.index, 0, removedError);
							setPracticeErrors(newErrors);
						}
					}}
				>
					<Droppable droppableId='droppable-content-list'>
						{(droppableProvided, snapshot) => (
							<Box
								ref={droppableProvided.innerRef}
								{...droppableProvided.droppableProps}
								className={snapshot.isDraggingOver ? 'isDraggingOver' : ''}
								sx={{
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								{practiceContent.map((item, index) => {
									return (
										<Draggable
											key={item.id || `content-item-${index}`}
											draggableId={String(item.id || `content-item-${index}`)}
											index={index}
											isDragDisabled={isDisabled}
										>
											{(provided) => (
												<Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
													<Components.Row>
														<Components.StyledCell width='60px'>
															<DragIndicatorIcon color={isDisabled ? 'disabled' : 'action'} />
														</Components.StyledCell>
														<Components.StyledCell width='600px'>
															<Box sx={{ width: '100%' }}>
																<TextField
																	fullWidth
																	size='small'
																	placeholder='輸入'
																	value={item.explanation || ''}
																	inputProps={{ required: false }}
																	error={submitCount > 0 && practiceErrors[index] && !isSavingDraft}
																	disabled={isDisabled}
																	onChange={(e) => {
																		const newValue = e.target.value;
																		setPracticeContent((prev) =>
																			prev.map((desc, idx) =>
																				idx === index ? { ...desc, explanation: newValue } : desc,
																			),
																		);

																		// Update error state for this item
																		if (submitCount > 0 && !isSavingDraft) {
																			const newErrors = [...practiceErrors];
																			newErrors[index] = !newValue || newValue.trim() === '';
																			setPracticeErrors(newErrors);
																		}
																	}}
																	sx={{
																		'& .MuiOutlinedInput-root': {
																			'&.Mui-focused fieldset': {
																				borderColor: '#637381',
																				borderWidth: '1px',
																			},
																			'&.Mui-error fieldset': {
																				borderColor: '#FF5630',
																			},
																		},
																	}}
																/>
																{submitCount > 0 && practiceErrors[index] && !isSavingDraft && (
																	<FormHelperText error sx={{ marginLeft: '14px' }}>
																		必填欄位
																	</FormHelperText>
																)}
															</Box>
														</Components.StyledCell>
														<Components.StyledCell width='100px'>
															{practiceContent.length > 1 && !isDisabled && (
																<CoreButton
																	color='error'
																	variant='text'
																	label='移除'
																	onClick={() => {
																		setPracticeContent((prev) => prev.filter((_, idx) => idx !== index));

																		// Update error states when an item is removed
																		if (submitCount > 0 && !isSavingDraft) {
																			setPracticeErrors((prev) => prev.filter((_, idx) => idx !== index));
																		}
																	}}
																	margin='0 12px 0 0'
																	sx={{ fontWeight: 400 }}
																/>
															)}
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

				{!isDisabled && (
					<CoreButton
						iconType='add'
						variant='outlined'
						label='新增說明'
						onClick={() => {
							setPracticeContent((prev) => [
								...prev,
								{
									id: `new-content-${Date.now()}`,
									explanation: '',
									type: 'C',
									sequence: prev.length + 1,
								} as CourseDescItem,
							]);

							// Add error state for the new item
							if (submitCount > 0 && !isSavingDraft) {
								setPracticeErrors((prev) => [...prev, true]);
							} else {
								// Add non-error state for draft mode
								setPracticeErrors((prev) => [...prev, false]);
							}
						}}
						width='116px'
						margin='24px 0 0 0'
					/>
				)}
			</CoreBlockRow>
			<CoreBlockRow>
				<FormikInput
					name='courseFee'
					title='費用包含'
					margin='0 0 24px 0'
					placeholder='輸入'
					width='100%'
					isRequired={!isSavingDraft}
					multiline
					rows={3}
					disabled={isDisabled}
				/>
			</CoreBlockRow>
		</>
	);
};

export default CourseInfo;
