import React, { useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { CourseReleaseType, CourseRemovalType, CourseStatusType } from '@repo/shared';
import { useFormikContext } from 'formik';

import CoreBlockRow from '@/components/Common/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import FormikDatePicker from '@/components/Common/CIBase/Formik/FormikDatePicker';
import FormikRadio from '@/components/Common/CIBase/Formik/FormikRadio';

interface PublishUnpublishManagementProps {
	courseStatusType: CourseStatusType;
	courseBkgType?: string;
}

interface FormValues {
	releaseType: CourseReleaseType;
	removalType: CourseRemovalType;
	releaseDate: string | null;
	removalDate: string | null;
}

const PublishUnpublishManagement: React.FC<PublishUnpublishManagementProps> = ({ courseStatusType, courseBkgType }) => {
	const { values, setFieldValue } = useFormikContext<FormValues>();

	// Reset dates when radio selection changes
	useEffect(() => {
		if (values.releaseType === CourseReleaseType.IMMEDIATE) {
			setFieldValue('releaseDate', null);
		}
	}, [values.releaseType, setFieldValue]);

	useEffect(() => {
		if (values.removalType === CourseRemovalType.ULIMIT) {
			setFieldValue('removalDate', null);
		}
	}, [values.removalType, setFieldValue]);

	return (
		<>
			<CoreBlockRow
				sx={{
					display: 'inline-flex',
					flexWrap: 'wrap',
				}}
			>
				<Stack direction='row' width='100%' gap={1.25}>
					<Box sx={{ width: 'calc(100% /2)' }}>
						<FormikRadio
							name='releaseType'
							title='上架時間'
							isRequired
							margin='0'
							width='100%'
							disabled={
								courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
							}
							radios={[
								{
									label: '指定時間',
									value: CourseReleaseType.DESIGNATE,
								},
								{
									label: '立即上架',
									value: CourseReleaseType.IMMEDIATE,
								},
							]}
						/>
						<FormikDatePicker
							name='releaseDate'
							isRequired
							placeholder={values.releaseType === CourseReleaseType.IMMEDIATE ? '即刻起' : 'yyyy/mm/dd'}
							width='100%'
							margin='0'
							format='YYYY/MM/DD'
							disablePast
							disabled={
								values.releaseType === CourseReleaseType.IMMEDIATE ||
								courseStatusType === CourseStatusType.PUBLISHED ||
								courseStatusType === CourseStatusType.UNPUBLISHED
							}
						/>
					</Box>
					<Box sx={{ width: 'calc(100% /2)' }}>
						<FormikRadio
							name='removalType'
							title='下架時間'
							isRequired
							margin='0'
							width='100%'
							disabled={courseStatusType === CourseStatusType.UNPUBLISHED}
							radios={[
								{
									label: '指定時間',
									value: CourseRemovalType.DESIGNATE,
								},
								{
									label: '無期限',
									value: CourseRemovalType.ULIMIT,
								},
							]}
						/>
						<FormikDatePicker
							name='removalDate'
							isRequired
							placeholder={values.removalType === CourseRemovalType.ULIMIT ? '無期限' : 'yyyy/mm/dd'}
							width='100%'
							margin='0'
							format='YYYY/MM/DD'
							disablePast
							disabled={
								values.removalType === CourseRemovalType.ULIMIT || courseStatusType === CourseStatusType.UNPUBLISHED
							}
						/>
					</Box>
				</Stack>
			</CoreBlockRow>
		</>
	);
};

export default PublishUnpublishManagement;
