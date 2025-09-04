import React, { useEffect, useState } from 'react';
import { CourseStatusType } from '@repo/shared';
import { AttachmentRequestDTO } from '@repo/shared/dist/dto/files/attachment-request-dto';
import { useFormikContext } from 'formik';

import CoreBlockRow from '@/components/Common/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import FormikFileUploadImage from '@/components/Common/CIBase/Formik/FormikFileUploadImage';
import { UploadImageWrapper } from '@/components/Common/CIBase/Formik/FormikFileUploadImage';
import FormikInput from '@/components/Common/CIBase/Formik/FormikInput';

interface CourseIntroProps {
	onAttachmentsUpdate: (attachments: AttachmentRequestDTO[]) => void;
	initialAttachments?: AttachmentRequestDTO[];
	courseStatusType?: CourseStatusType;
}

interface FormValues {
	description: string;
	explanation: string;
	promotion: string;
}

const CourseIntro: React.FC<CourseIntroProps> = ({
	onAttachmentsUpdate,
	initialAttachments = [],
	courseStatusType,
}) => {
	const { values } = useFormikContext<FormValues>();
	if (!values.description) values.description = '';
	if (!values.explanation) values.explanation = '';

	const createEmptyAttachment = (sequence: number) => ({
		key: '',
		sequence,
		originalName: '',
		mediaType: '',
		deviceType: 'D',
	});

	const [attachments, setAttachments] = useState(() => {
		const newAttachments = Array(6)
			.fill(null)
			.map((_, index) => {
				const sequence = index + 1;
				const existingAttachment = initialAttachments.find((a) => a.sequence === sequence);
				// console.log(`@Sequence ${sequence}:`, existingAttachment);
				return existingAttachment || createEmptyAttachment(sequence);
			});
		// console.log('@Initial attachments:', newAttachments);
		return newAttachments;
	});

	const handleImageUpload = (sequence: number, uploadedFileUrl: string, fileInfo: { name: string; type: string }) => {
		setAttachments((prev) => {
			const newAttachments = prev.map((attachment) =>
				attachment.sequence === sequence
					? {
							...attachment,
							key: uploadedFileUrl.split('/').pop() ?? '',
							originalName: fileInfo.name,
							mediaType: fileInfo.type,
						}
					: attachment,
			);
			// Merge with initial attachments to preserve existing ones
			const mergedAttachments = newAttachments.map((attachment) => {
				const existingAttachment = initialAttachments.find((a) => a.sequence === attachment.sequence);
				return attachment.key ? attachment : existingAttachment || attachment;
			});
			// console.log('@Updated attachments:', mergedAttachments);
			return mergedAttachments;
		});
	};

	useEffect(() => {
		const filteredAttachments = attachments.filter((a) => a.key !== '');
		// console.log('@Sending to parent:', filteredAttachments);
		onAttachmentsUpdate(filteredAttachments);
	}, [attachments, onAttachmentsUpdate]);

	return (
		<>
			<CoreBlockRow>
				<FormikInput
					name='description'
					title='課程封面簡介'
					margin='0 0 24px 0'
					placeholder='輸入'
					width='100%'
					isRequired
					multiline
					rows={3}
					hasTextCountAdornment
					textCount={values.description ? values.description.length : 0}
					maxTextCount={40}
					disabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
				/>
			</CoreBlockRow>
			<UploadImageWrapper title='封面圖片' width='100%' margin='0 0 24px 0' isRequired>
				<FormikFileUploadImage
					name='coverImg'
					description='建議尺寸 1280x 1280'
					aspectType='cover_desktop'
					hasPreview
					isDisabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
					onUploadComplete={(uploadedFileUrl, fileInfo) => {
						if (!uploadedFileUrl) return;
						handleImageUpload(1, uploadedFileUrl, fileInfo);
					}}
				/>
			</UploadImageWrapper>
			<CoreBlockRow>
				<FormikInput
					name='explanation'
					title='課程說明'
					margin='0 0 24px 0'
					placeholder='輸入'
					width='100%'
					isRequired
					multiline
					rows={3}
					hasTextCountAdornment
					textCount={values.explanation ? values.explanation.length : 0}
					maxTextCount={200}
					disabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
				/>
			</CoreBlockRow>
			<UploadImageWrapper
				title='其他介紹圖片'
				helperText='第一張為大圖，其餘四張為小圖'
				width='100%'
				margin='0 0 24px 0'
				isRequired
			>
				<FormikFileUploadImage
					name='otherImg1'
					description='建議尺寸 1920x1080'
					aspectType='cover_desktop'
					hasPreview
					isDisabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
					onUploadComplete={(uploadedFileUrl, fileInfo) => {
						if (!uploadedFileUrl) return;
						handleImageUpload(2, uploadedFileUrl, fileInfo);
					}}
				/>
				<FormikFileUploadImage
					name='otherImg2'
					description='建議尺寸 1920x1080'
					aspectType='cover_desktop'
					hasPreview
					isDisabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
					onUploadComplete={(uploadedFileUrl, fileInfo) => {
						if (!uploadedFileUrl) return;
						handleImageUpload(3, uploadedFileUrl, fileInfo);
					}}
				/>
				<FormikFileUploadImage
					name='otherImg3'
					description='建議尺寸 1920x1080'
					aspectType='cover_desktop'
					hasPreview
					isDisabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
					onUploadComplete={(uploadedFileUrl, fileInfo) => {
						if (!uploadedFileUrl) return;
						handleImageUpload(4, uploadedFileUrl, fileInfo);
					}}
				/>
				<FormikFileUploadImage
					name='otherImg4'
					description='建議尺寸 1920x1080'
					aspectType='cover_desktop'
					hasPreview
					isDisabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
					onUploadComplete={(uploadedFileUrl, fileInfo) => {
						if (!uploadedFileUrl) return;
						handleImageUpload(5, uploadedFileUrl, fileInfo);
					}}
				/>
				<FormikFileUploadImage
					name='otherImg5'
					description='建議尺寸 1920x1080'
					aspectType='cover_desktop'
					hasPreview
					isDisabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
					onUploadComplete={(uploadedFileUrl, fileInfo) => {
						if (!uploadedFileUrl) return;
						handleImageUpload(6, uploadedFileUrl, fileInfo);
					}}
				/>
			</UploadImageWrapper>
			<CoreBlockRow>
				<FormikInput
					name='promotion'
					title='課程優惠說明'
					placeholder='輸入'
					width='100%'
					helperText='非必填，但可以強調這個課程的優惠條件，譬如「教練1對2 優惠不加價」、「團體課冬令營優惠85折」'
					hasTextCountAdornment
					textCount={values.promotion ? values.promotion.length : 0}
					maxTextCount={12}
					disabled={
						courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED
					}
				/>
			</CoreBlockRow>
		</>
	);
};

export default CourseIntro;
