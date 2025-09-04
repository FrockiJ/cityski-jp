import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Typography } from '@mui/material';
import { DialogAction, GetHomeVideoResponseDTO, HttpStatusCode, ModalType } from '@repo/shared';
import { FieldArray, Form, Formik, FormikProps, getIn } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreAnchorModal from '@/CIBase/CoreModal/CoreAnchorModal';
import CoreBlock from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlock';
import CoreBlockRow from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import useModalProvider from '@/hooks/useModalProvider';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest, useRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

import * as Components from '../shared/Components';

import AddEditVideoModal from './AddEditVideoModal';

const anchorItems = [{ id: 'videoList', label: '影片列表管理', requireFields: [] }];

const tableHeader = [
	{ label: '', width: '60px' },
	{ label: '#', width: '60px' },
	{ label: '影片名稱', width: '500px' },
	{ label: ' ', width: '100px' },
];

const videoData = {
	id: '',
	name: '',
	url: '',
	buttonName: '',
	buttonUrl: '',
	sort: 0,
	currentEditIndex: 0,
};

interface VideoItemType extends GetHomeVideoResponseDTO {
	currentEditIndex: number;
}
interface InitialValuesProps {
	videoList: VideoItemType[];
}

interface ManageVideoModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
}

const ManageVideoModal = ({ handleCloseModal, handleRefresh }: ManageVideoModalProps) => {
	const modal = useModalProvider();
	const [radioValue, setRadioValue] = useState<number>(5);
	const videoListRef = useRef<VideoItemType[]>([]);

	// --- API ---

	const { data: getHomeVideoData, loading: getHomeVideoLoading } = useRequest(() => api.getHomeVideo(), {
		onError: generalErrorHandler,
	});

	const [updateHomeVideo, { loading: updateHomeVideoLoading }] = useLazyRequest(api.updateHomeVideo, {
		onError: generalErrorHandler,
		onSuccess: () => showToast(`已更新`, 'success'),
	});

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		videoList: [],
	});

	const validationSchema = Yup.object().shape({
		videoList: Yup.array()
			.min(5, '至少要5筆影片')
			.of(
				Yup.object().shape({
					name: Yup.string().required('必填欄位'),
					url: Yup.string().url('影片網址無效').required('必填欄位'),
					buttonName: Yup.string().max(6, '按鈕名稱最多6個字').required('必填欄位'),
					buttonUrl: Yup.string().required('必填欄位'),
				}),
			),
	});

	const handleFormSubmit = async (values: InitialValuesProps) => {
		const homeVideoList = values.videoList.map((video, index) => ({
			name: video.name,
			url: video.url,
			buttonName: video.buttonName,
			buttonUrl: video.buttonUrl,
			sort: index + 1,
		}));

		const { statusCode } = await updateHomeVideo(homeVideoList);

		if (statusCode === HttpStatusCode.CREATED) {
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		}
	};

	const handleConfirm = (currentVideoData: VideoItemType) => {
		const newVideoList = [...videoListRef.current];
		newVideoList[currentVideoData.currentEditIndex] = { ...currentVideoData };
		videoListRef.current = newVideoList;

		if (radioValue === 5) {
			setInitialValues({
				videoList: newVideoList.slice(0, 5),
			});
		}
		if (radioValue === 10) {
			setInitialValues({
				videoList: newVideoList,
			});
		}
	};

	const handleOpenVideo = ({
		rowData,
		modalType,
		currentEditIndex,
		handleDelete,
	}: {
		rowData: GetHomeVideoResponseDTO;
		modalType: ModalType;
		currentEditIndex: number;
		handleDelete?: (currentEditIndex: number) => void;
	}) => {
		modal.openModal({
			title: `${modalType === ModalType.ADD ? '新增' : '編輯'}影片`,
			width: 480,
			noAction: true,
			noEscAndBackdrop: true,
			marginBottom: true,
			children: (
				<AddEditVideoModal
					modalType={modalType}
					rowData={rowData}
					handleDelete={handleDelete}
					handleConfirm={handleConfirm}
					currentEditIndex={currentEditIndex}
				/>
			),
		});
	};

	// --- EFFECTS ---

	useEffect(() => {
		if (getHomeVideoData?.statusCode === HttpStatusCode.OK) {
			setInitialValues({
				videoList: getHomeVideoData.result.map((x, i) => ({ ...x, currentEditIndex: i })),
			});

			setRadioValue(getHomeVideoData.result.length);

			// Process the API response data
			// for initial empty result, use currentEditIndex and empty items to increase the length to 10 to update the Ref
			if (getHomeVideoData.result.length === 0) {
				setInitialValues({
					videoList: new Array(10).fill(videoData).map((x, i) => ({ ...x, currentEditIndex: i })),
				});

				videoListRef.current = [...new Array(10).fill(videoData).map((x, i) => ({ ...x, currentEditIndex: i }))];

				setTimeout(() => {
					setRadioValue(5);
				}, 100);
			}

			// Process the API response data
			// use currentEditIndex and empty items to increase the length to 10 to update the Ref
			if (getHomeVideoData.result.length === 5) {
				videoListRef.current = [
					...getHomeVideoData.result.map((x, i) => ({ ...x, currentEditIndex: i })),
					...new Array(5).fill(videoData).map((x, i) => ({ ...x, currentEditIndex: i })),
				];
			}

			// Process the API response data
			// use currentEditIndex to increase the length to 10 to update the Ref
			if (getHomeVideoData.result.length === 10) {
				videoListRef.current = getHomeVideoData.result.map((x, i) => ({ ...x, currentEditIndex: i }));
			}
		}
	}, [getHomeVideoData]);

	useEffect(() => {
		if (radioValue === 5) {
			setInitialValues({
				videoList: videoListRef.current.slice(0, 5),
			});
		}
		if (radioValue === 10) {
			setInitialValues({
				videoList: videoListRef.current,
			});
		}
	}, [radioValue]);

	const isLoading = getHomeVideoLoading || updateHomeVideoLoading;

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleFormSubmit}
			validationSchema={validationSchema}
			enableReinitialize
		>
			{({ isSubmitting, values, errors, submitCount }) => {
				const hasError = Boolean(getIn(errors, 'videoList')) && submitCount > 0;

				return (
					<Form>
						{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
						<FormikScrollToError />
						<CoreAnchorModal anchorItems={anchorItems}>
							<CoreBlock title='影片列表管理' isError={hasError}>
								<Components.MessageHint
									color={hasError ? 'error' : 'primary'}
									message={hasError ? '請新增未完成的影片欄位' : '建議崁入的連結為直式影片'}
								/>
								<CoreBlockRow sx={{ margin: 0 }}>
									<Box>
										<Typography variant='body2' color='text.secondary'>
											前台呈現影片數量
										</Typography>
										<CoreRadioGroup
											value={radioValue}
											onChange={(_event, value) => {
												if (value) setRadioValue(+value);
											}}
											radios={[
												{ label: '5個', value: 5 },
												{ label: '10個', value: 10 },
											]}
										/>
									</Box>
								</CoreBlockRow>
								<CoreBlockRow>
									<Box sx={{ width: '100%' }}>
										<Components.Row header tableHeader={tableHeader}>
											{tableHeader.map(({ label, width }) => (
												<Components.StyledCell header key={label} width={width}>
													{label}
												</Components.StyledCell>
											))}
										</Components.Row>

										<FieldArray name='videoList'>
											{({ move }) => (
												<DragDropContext
													onDragEnd={(result: DropResult) => {
														const { destination, source } = result;

														if (
															!destination ||
															(destination.droppableId === source.droppableId && destination.index === source.index)
														) {
															return;
														}

														// Use Formik's move helper
														move(source.index, destination.index);

														// Update ref to match
														const newRefList = Array.from(videoListRef.current);
														const [removed] = newRefList.splice(source.index, 1);
														newRefList.splice(destination.index, 0, removed);
														videoListRef.current = newRefList;
													}}
												>
													<Droppable droppableId='droppable-list'>
														{(droppableProvided) => (
															<Box
																ref={droppableProvided.innerRef}
																{...droppableProvided.droppableProps}
																sx={{
																	display: 'flex',
																	flexDirection: 'column',
																}}
															>
																{values.videoList &&
																	values.videoList.length > 0 &&
																	values.videoList.map((item, index) => {
																		return (
																			<Draggable key={index} draggableId={`${item.id}${index}`} index={index}>
																				{(provided, snapshot) => (
																					<Box
																						{...provided.draggableProps}
																						{...provided.dragHandleProps}
																						ref={provided.innerRef}
																					>
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
																							<Components.StyledCell width='60px'>{index + 1}</Components.StyledCell>
																							<Components.StyledCell width='500px'>
																								{item.name ? (
																									item.name
																								) : (
																									<CoreButton
																										iconType='add'
																										variant='outlined'
																										label='新增'
																										onClick={() =>
																											handleOpenVideo({
																												rowData: item,
																												modalType: ModalType.ADD,
																												currentEditIndex: index,
																											})
																										}
																									/>
																								)}
																							</Components.StyledCell>
																							<Components.StyledCell width='100px'>
																								{item.name && (
																									<>
																										<CoreButton
																											variant='text'
																											label='編輯'
																											onClick={() =>
																												handleOpenVideo({
																													rowData: item,
																													currentEditIndex: index,
																													modalType: ModalType.EDIT,
																													handleDelete: (currentEditIndex) => {
																														values.videoList[currentEditIndex] = {
																															...videoData,
																															currentEditIndex,
																														};
																														videoListRef.current[currentEditIndex] = {
																															...videoData,
																															currentEditIndex,
																														};
																													},
																												})
																											}
																										/>
																									</>
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
											)}
										</FieldArray>
									</Box>
								</CoreBlockRow>
							</CoreBlock>
						</CoreAnchorModal>
						<StyledAbsoluteModalActions justifyContent='flex-end'>
							<CoreButton
								color='default'
								variant='outlined'
								label='取消'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton color='primary' variant='contained' type='submit' label='確認' />
						</StyledAbsoluteModalActions>
					</Form>
				);
			}}
		</Formik>
	);
};

export default ManageVideoModal;
