import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, CircularProgress } from '@mui/material';
import { DialogAction, GetPublishedCoursesResponseDTO, UpdatePublishedCoursesSortingRequestDTO } from '@repo/shared';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest, useRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

import * as Components from '../shared/Components';

const tableHeader = [
	{ label: '', width: '60px' },
	{ label: '課程編號', width: '100px' },
	{ label: '課程名稱', width: '220px' },
	{ label: '授課板類', width: '120px' },
	{ label: '課程下架時間', width: '120px' },
];

interface ManagePublishedCourseModalProps {
	handleCloseModal?: (action: DialogAction) => void;
}

const ManagePublishedCourseModal = ({ handleCloseModal }: ManagePublishedCourseModalProps) => {
	// State declarations
	const [courseList, setCourseList] = useState<GetPublishedCoursesResponseDTO[]>([]);
	const [departmentId, setDepartmentId] = useState<string>('');

	// --- API ---
	const storedDepartmentId = localStorage.getItem('departmentId') ?? '';

	const { data: getCoursePublishedListData, loading: getCoursePublishedListLoading } = useRequest(
		() => api.getCoursePublishedList({ departmentId: storedDepartmentId }),
		{
			onError: generalErrorHandler,
		},
	);

	const [updateCoursePublishedList, { loading: isUpdating }] = useLazyRequest(api.updateCoursePublishedList, {
		onError: (error) => {
			console.error('Error updating course order:', error);
			generalErrorHandler(error);
		},
		onSuccess: () => {
			showToast('已更新課程排序', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
		},
	});

	// Set course list and department ID when data is loaded
	useEffect(() => {
		if (getCoursePublishedListData && getCoursePublishedListData.result) {
			const courses = Array.isArray(getCoursePublishedListData.result)
				? getCoursePublishedListData.result
				: [getCoursePublishedListData.result];

			setCourseList(courses);
			setDepartmentId(storedDepartmentId);

			console.log('Published course list set:', courses);
			console.log('Department ID set:', storedDepartmentId);
		}
	}, [getCoursePublishedListData, storedDepartmentId]);

	// Handle course reordering
	const handleDragEnd = (result: DropResult) => {
		const { destination, source } = result;

		// dropped outside the list
		if (!destination) return;

		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		// Create a new copy of the courseList
		const newCourseList = [...courseList];
		const [removed] = newCourseList.splice(source.index, 1);
		newCourseList.splice(destination.index, 0, removed);

		setCourseList(newCourseList);
	};

	// Handle submission of updated order
	const handleSubmit = () => {
		console.log('DepartmentId when submitting:', departmentId);

		// Validate departmentId
		if (!departmentId || departmentId.trim() === '') {
			showToast('找不到部門ID，請重新登入', 'error');
			return;
		}

		// Check if courses exist
		if (courseList.length === 0) {
			showToast('無排序資料', 'error');
			return;
		}

		// Prepare the payload with updated sequence numbers based on current order
		const courseSequences = courseList.map((course, index) => ({
			id: course.id,
			sequence: index + 1, // Sequence starts from 1
		}));

		// Create the payload as a single object
		const payload: UpdatePublishedCoursesSortingRequestDTO = {
			departmentId,
			courses: courseSequences,
		};

		console.log('Updating course sequences with payload:', payload);
		updateCoursePublishedList(payload);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<CoreModalContent padding='24px 0'>
				<Components.Row header tableHeader={tableHeader}>
					{tableHeader.map(({ label, width }) => (
						<Components.StyledCell header key={label} width={width}>
							{label}
						</Components.StyledCell>
					))}
				</Components.Row>

				{getCoursePublishedListLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
						<CircularProgress size={30} />
					</Box>
				) : courseList.length === 0 ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>無課程資料</Box>
				) : (
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId='droppable-list'>
							{(droppableProvided, snapshot) => (
								<Box
									ref={droppableProvided.innerRef}
									{...droppableProvided.droppableProps}
									className={snapshot.isDraggingOver ? 'isDraggingOver' : ''}
									sx={{
										display: 'flex',
										flexDirection: 'column',
										'&.isDraggingOver': {
											backgroundColor: 'primary.light',
										},
									}}
								>
									{courseList.map((course, index) => {
										return (
											<Draggable key={course.id} draggableId={course.id} index={index}>
												{(provided, snapshot) => (
													<Box {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
														<Components.Row
															sx={{
																opacity: snapshot.isDragging ? 0.9 : 1,
																backgroundColor: snapshot.isDragging ? '#F9FAFB' : '#FFF',
																':hover': {
																	backgroundColor: snapshot.isDragging ? '#FFF' : '#F9FAFB',
																},
															}}
														>
															<Components.StyledCell width='60px'>
																<DragIndicatorIcon color='disabled' />
															</Components.StyledCell>
															<Components.StyledCell width='100px'>{course.no || '---'}</Components.StyledCell>
															<Components.StyledCell width='220px'>{course.name}</Components.StyledCell>
															<Components.StyledCell width='120px'>
																{(() => {
																	// Convert ski type to Chinese
																	switch (Number(course.skiType)) {
																		case 0:
																			return '單板和雙板';
																		case 1:
																			return '單板';
																		case 2:
																			return '雙板';
																		default:
																			return course.skiType || '---';
																	}
																})()}
															</Components.StyledCell>
															<Components.StyledCell width='120px'>{course.removalDate || '---'}</Components.StyledCell>
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
				)}
			</CoreModalContent>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 24px 24px', gap: '12px' }}>
				<CoreButton
					color='default'
					variant='outlined'
					label='取消'
					onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
				/>
				<CoreButton
					color='primary'
					variant='contained'
					label='確認'
					onClick={handleSubmit}
					disabled={isUpdating || getCoursePublishedListLoading || courseList.length === 0}
				/>
			</Box>
		</Box>
	);
};

export default ManagePublishedCourseModal;
