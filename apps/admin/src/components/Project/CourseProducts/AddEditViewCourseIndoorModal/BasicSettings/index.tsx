import React from 'react';
import { Stack } from '@mui/material';
import { CourseSkiType, CourseStatusType, CourseType } from '@repo/shared';
import { useFormikContext } from 'formik';

import CoreLabel from '@/components/Common/CIBase/CoreLabel';
import CoreBlockCard from '@/components/Common/CIBase/CoreModal/CoreAnchorModal/CoreBlockCard';
import FormikInput from '@/components/Common/CIBase/Formik/FormikInput';
import FormikRadio from '@/components/Common/CIBase/Formik/FormikRadio';
import BlockArea from '@/components/Project/shared/BlockArea';

interface BasicSettingsProps {
	courseInfo: {
		no: string;
		type: string;
		teachingType: string;
		status: string;
	};
	courseStatusType: CourseStatusType;
	courseType: CourseType;
}

const BasicSettings: React.FC<BasicSettingsProps> = ({ courseInfo, courseStatusType, courseType }) => {
	// Get Formik context to access values
	console.log('courseInfo', courseInfo);
	const { values } = useFormikContext<{ name: string }>();

	return (
		<>
			<BlockArea>
				<Stack direction='row' width='100%' mb={3}>
					<CoreBlockCard title='課程編號' content={courseInfo.no} width='calc(100% /4)' />
					<CoreBlockCard title='類型' content={courseInfo.type} width='calc(100% /4)' />
					<CoreBlockCard title='授課方式' content={courseInfo.teachingType} width='calc(100% /4)' />
					<CoreBlockCard
						title='狀態'
						content={
							<CoreLabel
								color={
									{
										[CourseStatusType.DRAFT]: 'warning',
										[CourseStatusType.PUBLISHED]: 'success',
										[CourseStatusType.SCHEDULED]: 'primary',
										[CourseStatusType.UNPUBLISHED]: 'default',
									}[courseStatusType] as never
								}
							>
								{courseInfo.status}
							</CoreLabel>
						}
						width='calc(100% /4)'
					/>
				</Stack>
			</BlockArea>

			<FormikInput
				name='name'
				title='課程名稱'
				placeholder='輸入'
				width='100%'
				isRequired
				hasTextCountAdornment
				textCount={values.name.length}
				maxTextCount={12}
				disabled={courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED}
			/>
			<FormikRadio
				name='skiType'
				title='授課板類'
				isRequired
				margin='24px 0 0 0'
				disabled={courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED}
				radios={[
					{
						label: '單板和雙板',
						value: String(CourseSkiType.BOTH),
					},
					{
						label: '單板',
						value: String(CourseSkiType.SNOWBOARD),
					},
					{
						label: '雙板',
						value: String(CourseSkiType.SKI),
					},
				]}
			/>
		</>
	);
};

export default BasicSettings;
