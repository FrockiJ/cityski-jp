import React, { useEffect, useRef, useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelIcon from '@mui/icons-material/Cancel';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { DialogAction } from '@repo/shared';
import { FieldConfig, useField, useFormikContext } from 'formik';
import Image from 'next/image';
import * as Yup from 'yup';

import useModalProvider from '@/hooks/useModalProvider';

import { FormikErrorMessage } from '../common/FormikComponents';

import CropImageModal from './CropImageModal';
import PreviewImage from './PreviewImage';
import {
	StyledDescription,
	StyledFileUploadImage,
	StyledImageBrowseWrapper,
	StyledLabel,
	StyledRemoveFileIconWrapper,
	StyledZoomInIconWrapper,
} from './styles';
import UploadImageWrapper from './UploadImageWrapper';

export { UploadImageWrapper };
export type ImageSizeType = { width: number; height: number };
export const yupImageCheck = (required: boolean) => {
	return Yup.lazy((value) => {
		switch (typeof value) {
			case 'object': // when value is null
				return Yup.mixed()
					.nullable()
					.transform((_, val) => val)
					.test('checkFileSize', '圖檔應小於 2MB', () => false); // image size is greater than 2MB
			case 'boolean': // when value is false -> extension
				return Yup.mixed().test('checkFileExtension', '副檔名僅支援 JPG 及 PNG', () => false);
			case 'undefined': // when value is undefined (initialValues)
				return required ? Yup.string().trim().required('必填欄位') : Yup.string().trim();
			default:
				return Yup.mixed();
		}
	});
};

interface FormikFileUploadImageProps extends FieldConfig {
	name: string;
	accept?: string;
	allowExtensions?: string[];
	fileMaxSize?: number;
	description?: string;
	isDisabled?: boolean;
	hasPreview?: boolean;
	aspectType: 'banner_desktop' | 'banner_mobile' | 'cover_desktop' | 'cover_mobile' | 'other_desktop' | 'other_mobile';
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, file: File) => void;
	onUploadComplete?: (imgUrl: string, fileInfo: { name: string; type: string }) => void;
}

const FormikFileUploadImage = ({
	name,
	accept = 'image/jpg, image/png',
	allowExtensions = ['jpeg', 'jpg', 'png'],
	fileMaxSize = 2, //2MB
	description,
	isDisabled = false,
	hasPreview = false,
	aspectType,
	onChange,
	onUploadComplete,
}: FormikFileUploadImageProps) => {
	const modal = useModalProvider();
	const { isSubmitting } = useFormikContext();
	const inputFileImageRef = useRef<HTMLInputElement | null>(null);
	const [imagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>();
	const [imageSize, setImageSize] = useState<ImageSizeType>({
		width: 0,
		height: 0,
	});
	const isUploaded = Boolean(imageUrl);
	const [field, meta, helpers] = useField(name);
	const invalid = !!meta.error && !!meta.touched;

	// --- EFFECTS ---

	useEffect(() => {
		if (typeof field.value === 'string') {
			setImageUrl(field.value);
		}
	}, [field.value]);

	// --- FUNCTIONS ---

	const handleImageDelete = async () => {
		// for value validation
		await helpers.setTouched(true);
		await helpers.setValue('');

		// for render
		setImageUrl(undefined);

		// for file path clear
		if (inputFileImageRef.current) {
			inputFileImageRef.current.value = '';
		}
	};

	const handleCloseImagePreview = () => {
		setImagePreviewOpen(false);
	};

	const handleImagePreview = () => {
		setImagePreviewOpen(true);
	};

	const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const fileSize = file.size / 1024 / 1024; //2MB
		const extension = file.name.split('.').at(-1);

		if (extension && !allowExtensions.includes(extension)) {
			// for file path clear
			event.target.value = '';

			// for value validation
			await helpers.setTouched(true);
			await helpers.setValue(false);

			// for render
			setImageUrl(undefined);
			return;
		}

		if (fileSize > fileMaxSize) {
			// for file path clear
			event.target.value = '';

			// for value validation
			await helpers.setTouched(true);
			await helpers.setValue(null);

			// for render
			setImageUrl(undefined);
			return;
		}

		const fileUrl = window.URL.createObjectURL(file);
		const img = new (window as any).Image();

		img.src = fileUrl;
		img.onload = async () => {
			// setImageUrl(fileUrl);
			setImageSize({
				width: img.width,
				height: img.height,
			});

			// avoid repeat image cache
			event.target.value = '';
			// start crop image
			modal.openModal({
				title: '裁切圖片',
				center: true,
				noEscAndBackdrop: true,
				noAction: true,
				marginBottom: true,
				width: 720,
				children: (
					<CropImageModal
						imgSrc={fileUrl}
						onFileUploadCallback={onFileUploadCallback}
						aspectType={aspectType}
						fileInfo={{
							name: file.name,
							type: file.type,
						}}
					/>
				),
				onClose: (action) => {
					if (onChange && action === DialogAction.CONFIRM) {
						onChange(event, file);
					}
				},
			});
		};
	};

	const onFileUploadCallback = async (imgUrl: string, fileInfo?: { name: string; type: string }) => {
		console.log('FormikFileUploadImage onFileUploadCallback:', { imgUrl, fileInfo });
		console.log('onUploadComplete exists?', !!onUploadComplete);

		// for value validation
		await helpers.setTouched(true);
		await helpers.setValue(imgUrl);

		// for render
		setImageUrl(imgUrl);

		// Call the parent's callback if provided
		if (onUploadComplete && fileInfo) {
			console.log('Calling onUploadComplete with:', { imgUrl, fileInfo });
			onUploadComplete(imgUrl, fileInfo);
		}
	};

	return (
		<StyledFileUploadImage>
			<PreviewImage
				open={imagePreviewOpen}
				handleClose={handleCloseImagePreview}
				imageUrl={imageUrl}
				imageSize={imageSize}
			/>
			<StyledLabel
				name={field.name}
				htmlFor={field.name}
				isUploaded={isUploaded}
				isDisabled={isDisabled || isSubmitting}
				isError={invalid}
				onClick={(event: React.MouseEvent) => {
					event.preventDefault();
					event.stopPropagation();

					if (isDisabled) return;
					if (!isUploaded) inputFileImageRef.current?.click();
				}}
			>
				{isUploaded ? (
					<>
						<StyledRemoveFileIconWrapper
							className='remove_icon'
							onClick={(event: React.MouseEvent) => {
								event.preventDefault();
								event.stopPropagation();

								handleImageDelete();
							}}
						>
							{!isDisabled && <CancelIcon />}
						</StyledRemoveFileIconWrapper>
						{hasPreview && (
							<StyledZoomInIconWrapper
								className='zoom_in_icon'
								onClick={(event: React.MouseEvent) => {
									event.preventDefault();
									event.stopPropagation();

									handleImagePreview();
								}}
							>
								<ZoomInIcon fontSize='large' />
							</StyledZoomInIconWrapper>
						)}
						{!isDisabled && (
							<StyledImageBrowseWrapper
								className='browse_icon'
								onClick={(event: React.MouseEvent) => {
									event.preventDefault();
									event.stopPropagation();

									inputFileImageRef.current?.click();
								}}
							>
								瀏覽
							</StyledImageBrowseWrapper>
						)}
						{/* {console.log('imageUrl', imageUrl)} */}
						<Image
							unoptimized
							src={imageUrl ?? ''}
							alt='image thumbnail'
							width={imageSize.width}
							height={imageSize.height}
							priority
							style={{
								objectFit: 'contain',
								maxWidth: '100%',
								maxHeight: '100%',
								width: '100%',
								height: '100%',
							}}
						/>
					</>
				) : (
					<>
						<AddPhotoAlternateIcon sx={{ fontSize: 32 }} />
						選擇檔案
					</>
				)}
			</StyledLabel>
			<input
				id={field.name}
				name={field.name}
				type='file'
				accept={accept} // could also check again within formik validation or backend
				ref={inputFileImageRef}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleImageChange(event)}
				style={{ display: 'none', opacity: 0, position: 'absolute', zIndex: -1 }}
			/>
			{description && <StyledDescription isDisabled={isDisabled}>{description}</StyledDescription>}
			<FormikErrorMessage name={field.name} />
		</StyledFileUploadImage>
	);
};

export default FormikFileUploadImage;
FormikFileUploadImage.displayName = 'FormikFileUploadImage';
