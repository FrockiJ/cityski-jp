import { useRef, useState } from 'react';
import ReactCrop, { convertToPixelCrop, PercentCrop, PixelCrop } from 'react-image-crop';
import { Box } from '@mui/material';
import { DialogAction, HttpStatusCode } from '@repo/shared';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import useDebounceEffect from '@/hooks/useDebounceFn';
import { getS3MediaUrl } from '@/utils/general';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

import { canvasPreview, centerAspectCrop } from './utils';

import 'react-image-crop/dist/ReactCrop.css';

const aspectRatio = {
	banner_desktop: 1800 / 540, // 桌機使用 1800x540
	banner_mobile: 750 / 880, // 手機使用 750x880
	cover_desktop: 960 / 640, // 封面圖片_desktop，建議尺寸 1280x 1280
	cover_mobile: 960 / 640, // 封面圖片_mobile，建議尺寸 960x 960
	other_desktop: 395 / 120, // 其他介紹圖片_desktop，建議尺寸 1920x1080
	other_mobile: 395 / 120, // 其他介紹圖片_mobile，建議尺寸 960x540
};

interface CropImageModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	fileInfo: { name: string; type: string };
	imgSrc: string;
	onFileUploadCallback: (imgUrl: string, fileInfo?: { name: string; type: string }) => void;
	aspectType: 'banner_desktop' | 'banner_mobile' | 'cover_desktop' | 'cover_mobile' | 'other_desktop' | 'other_mobile';
}

const CropImageModal = ({
	handleCloseModal,
	imgSrc,
	fileInfo,
	onFileUploadCallback,
	aspectType,
}: CropImageModalProps) => {
	const [crop, setCrop] = useState<PercentCrop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const aspect = aspectRatio[aspectType];

	// --- API ---

	const [fileUpload, { loading: fileUploadLoading }] = useLazyRequest(api.fileUpload, {
		onError: generalErrorHandler,
	});

	// --- EFFECTS ---

	useDebounceEffect(
		async () => {
			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
				// We use canvasPreview as it's much faster than imgPreview.
				canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
			}
		},
		100,
		[completedCrop],
	);

	// --- FUNCTIONS ---

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		window.URL.revokeObjectURL(imgSrc);

		if (imgRef.current && aspect) {
			const { width, height } = e.currentTarget;
			const newCrop = centerAspectCrop(width, height, aspect);

			// Updates the crop
			setCrop(newCrop);

			// Updates the preview
			setCompletedCrop(convertToPixelCrop(newCrop, width, height));
		}
	};

	const handleCropClick = async () => {
		if (!imgRef.current || !previewCanvasRef.current || !completedCrop) {
			throw new Error('Crop canvas does not exist');
		}

		// This will size relative to the uploaded image
		// size. If you want to size according to what they
		// are looking at on screen, remove scaleX + scaleY
		const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
		const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

		const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY);
		const ctx = offscreen.getContext('2d');
		if (!ctx) {
			throw new Error('No 2d context');
		}

		ctx.drawImage(
			previewCanvasRef.current,
			0,
			0,
			previewCanvasRef.current.width,
			previewCanvasRef.current.height,
			0,
			0,
			offscreen.width,
			offscreen.height,
		);

		// You might want { type: "image/jpeg", quality: <0 to 1> } to
		// reduce image size
		const blob = await offscreen.convertToBlob({
			type: fileInfo.type,
		});

		const file = new File([blob], fileInfo.name, { type: fileInfo.type });

		const { result, statusCode } = await fileUpload(file);

		if (statusCode === HttpStatusCode.OK) {
			console.log('CropImageModal success, calling callback with:', {
				url: getS3MediaUrl(result.key),
				fileInfo,
			});
			onFileUploadCallback(getS3MediaUrl(result.key), fileInfo);
			handleCloseModal?.(DialogAction.CONFIRM);
		}
	};

	return (
		<Box display='flex' justifyContent='center' padding='24px 0'>
			{fileUploadLoading && <CoreLoaders hasOverlay />}
			{!!imgSrc && (
				<ReactCrop
					crop={crop}
					onChange={(_, percentCrop) => setCrop(percentCrop)}
					onComplete={(crop) => setCompletedCrop(crop)}
					aspect={aspect}
				>
					<img ref={imgRef} alt='Crop me' src={imgSrc} onLoad={onImageLoad} crossOrigin='anonymous' />
				</ReactCrop>
			)}
			{!!completedCrop && <canvas ref={previewCanvasRef} style={{ display: 'none' }} />}
			<StyledAbsoluteModalActions justifyContent='flex-end'>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<CoreButton
						color='default'
						variant='outlined'
						label='取消'
						isSubmitting={fileUploadLoading}
						onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
					/>
					<CoreButton
						variant='contained'
						color='primary'
						label='裁切'
						isSubmitting={fileUploadLoading}
						onClick={handleCropClick}
					/>
				</Box>
			</StyledAbsoluteModalActions>
		</Box>
	);
};

export default CropImageModal;
