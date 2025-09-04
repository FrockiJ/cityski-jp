import React, { useEffect, useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Stack } from '@mui/material';
import { DialogAction, HttpStatusCode, MemberType } from '@repo/shared';
import dayjs from 'dayjs';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreAnchorModal from '@/CIBase/CoreModal/CoreAnchorModal';
import CoreBlock from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlock';
import CoreBlockCard from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlockCard';
import CoreBlockRow from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import FormikInput from '@/Formik/FormikInput';
import FormikSelect from '@/Formik/FormikSelect';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest, useRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

import BlockArea from '../shared/BlockArea';

const anchorItems = [
	{ id: 'memberManagement', label: '會員管理', requireFields: [] },
	{ id: 'accountInfo', label: '帳戶資訊', requireFields: [] },
	{ id: 'lastTimeTeach', label: '最近一次教學紀錄', requireFields: [] },
];

interface InitialValuesProps {
	name: string;
	snowboardLevel: string;
	skiLevel: string;
	note: string;
}

interface FrontendMemberManagementModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
	memberId: string;
}

const FrontendMemberManagementModal = ({
	memberId,
	handleCloseModal,
	handleRefresh,
}: FrontendMemberManagementModalProps) => {
	const [memberInfo, setMemberInfo] = useState({
		no: '',
		birthday: '',
		type: '',
		phone: '',
		email: '',
		createdTime: '',
		lineId: '',
		lineName: '',
		updatedTime: '',
	});

	// --- API ---

	const { data: getMemberDetailData, loading: getMemberDetailLoading } = useRequest(
		() => api.getMemberDetail(memberId),
		{
			onError: generalErrorHandler,
		},
	);

	const [updateMemberDetail, { loading: updateMemberDetailLoading }] = useLazyRequest(api.updateMemberDetail, {
		onError: generalErrorHandler,
		onSuccess: () => showToast('已更新', 'success'),
	});

	// --- EFFECTS ---

	useEffect(() => {
		if (getMemberDetailData) {
			setInitialValues({
				name: getMemberDetailData.result.name,
				snowboardLevel: String(getMemberDetailData.result.snowboard),
				skiLevel: String(getMemberDetailData.result.skis),
				note: getMemberDetailData.result.note ?? '',
			});

			setMemberInfo({
				no: getMemberDetailData.result.no,
				birthday: `${dayjs().diff(getMemberDetailData.result.birthday, 'year')} (${dayjs(getMemberDetailData.result.birthday).format('YYYY/MM/DD')})`,
				type: getMemberDetailData.result.type === MemberType.E ? 'Email' : 'LINE',
				phone: getMemberDetailData.result.phone ?? '--',
				email: getMemberDetailData.result.email ?? '--',
				createdTime: dayjs(getMemberDetailData.result.createdTime).format('YYYY/MM/DD'),
				lineId: getMemberDetailData.result.lineId ?? '--',
				lineName: getMemberDetailData.result.lineName ?? '--',
				updatedTime: dayjs(getMemberDetailData.result.updatedTime).format('YYYY/MM/DD'),
			});
		}
	}, [getMemberDetailData]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		name: '',
		snowboardLevel: '1',
		skiLevel: '1',
		note: '',
	});

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('必填欄位'),
		snowboardLevel: Yup.string().required('必填欄位'),
		skiLevel: Yup.string().required('必填欄位'),
		note: Yup.string(),
	});

	const handleFormSubmit = async (values: InitialValuesProps) => {
		const { statusCode } = await updateMemberDetail({
			memberId,
			name: values.name,
			snowboardLevel: Number(values.snowboardLevel),
			skiLevel: Number(values.skiLevel),
			note: values.note,
		});

		if (statusCode === HttpStatusCode.OK) {
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		}
	};

	const isLoading = getMemberDetailLoading || updateMemberDetailLoading;

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleFormSubmit}
			validationSchema={validationSchema}
			enableReinitialize
		>
			{({ isSubmitting }) => {
				return (
					<Form>
						{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
						<FormikScrollToError />
						<CoreAnchorModal anchorItems={anchorItems}>
							<CoreBlock title='會員管理'>
								<CoreBlockRow
									sx={{
										display: 'inline-flex',
										flexWrap: 'wrap',
									}}
								>
									<Stack direction='row' alignItems='flex-start' width='100%' mb={3} spacing={1}>
										<FormikInput
											name='name'
											title='姓名'
											placeholder='輸入'
											width='100%'
											isRequired
											wrapperSxProps={{ width: 'calc(100% /3)' }}
										/>
										<FormikSelect
											name='snowboardLevel'
											title='單板等級'
											placeholder='選擇'
											options={[
												...new Array(20)
													.fill({ label: '', value: 0 })
													.map((x, i) => ({ label: String(i + 1), value: String(i + 1) })),
											]}
											width='calc(100% /3)'
											menuPortal
											margin='24px 0 0 0'
										/>
										<FormikSelect
											name='skiLevel'
											title='雙板等級'
											placeholder='選擇'
											options={[
												...new Array(20)
													.fill({ label: '', value: 0 })
													.map((x, i) => ({ label: String(i + 1), value: String(i + 1) })),
											]}
											width='calc(100% /3)'
											menuPortal
											margin='24px 0 0 0'
										/>
									</Stack>
									<Stack direction='row' alignItems='flex-start' width='100%' mb={3} spacing={1}>
										<CoreBlockCard
											title='訂單紀錄'
											content={
												<CoreButton
													variant='outlined'
													label='檢視'
													iconPlacement='end'
													customIcon={<ArrowOutwardIcon />}
													onClick={() =>
														console.log(`點擊訂單紀錄的「檢視」按鈕，原網頁開啟「訂單管理」頁面
															a. 依據此使用者篩選訂單資料
															b. 若後台人員無權限檢視，顯示無資料`)
													}
												/>
											}
											width='calc(100% /3)'
										/>
										<CoreBlockCard
											title='預約紀錄'
											content={
												<CoreButton
													variant='outlined'
													label='檢視'
													iconPlacement='end'
													customIcon={<ArrowOutwardIcon />}
													onClick={() =>
														console.log(`點擊預約紀錄的「檢視」按鈕，原網頁開啟「預約管理」頁面
															a. 依據此使用者篩選預約資料
															b. 若後台人員無權限檢視，顯示無資料`)
													}
												/>
											}
											width='calc(100% /3)'
										/>
									</Stack>
									<Stack direction='row' width='100%'>
										<FormikInput
											name='note'
											title='備註'
											margin='0 0 24px 0'
											placeholder='輸入'
											width='100%'
											multiline
											rows={3}
										/>
									</Stack>
								</CoreBlockRow>
							</CoreBlock>
							<CoreBlock title='帳戶資訊'>
								<BlockArea>
									<Stack direction='row' width='100%' mb={3}>
										<CoreBlockCard title='會員編號' content={memberInfo.no} width='33.3%' />
										<CoreBlockCard title='年齡' content={memberInfo.birthday} width='33.3%' />
										<CoreBlockCard title='註冊方式' content={memberInfo.type} width='33.3%' />
									</Stack>
									<Stack direction='row' width='100%' mb={3}>
										<CoreBlockCard title='手機' content={memberInfo.phone} width='33.3%' />
										<CoreBlockCard title='Email' content={memberInfo.email} width='33.3%' />
										<CoreBlockCard title='建立日期' content={memberInfo.createdTime} width='33.3%' />
									</Stack>
									<Stack direction='row' width='100%' mb={3}>
										{/* <CoreBlockCard title='LINE ID' content={memberInfo.lineId} width='33.3%' /> */}
										<CoreBlockCard title='LINE 名稱' content={memberInfo.lineName} width='33.3%' />
										<CoreBlockCard title='最後編輯日期' content={memberInfo.updatedTime} width='33.3%' />
									</Stack>
								</BlockArea>
							</CoreBlock>
							<CoreBlock title='最近一次教學紀錄'>
								<CoreBlockRow sx={{ padding: '16px 24px', borderRadius: 2, backgroundColor: 'background.light' }}>
									<CoreBlockCard
										title='2024/09/01 團體課-雙板'
										subTitle='台中店 - 林雨欣'
										content='教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄'
									/>
								</CoreBlockRow>
								<CoreBlockRow sx={{ padding: '16px 24px', borderRadius: 2, backgroundColor: 'background.light' }}>
									<CoreBlockCard
										title='2024/09/02 私人課-單板'
										subTitle='台中店 - 林雨欣'
										content='教學紀錄2教學紀錄2教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄教學紀錄'
									/>
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

export default FrontendMemberManagementModal;
