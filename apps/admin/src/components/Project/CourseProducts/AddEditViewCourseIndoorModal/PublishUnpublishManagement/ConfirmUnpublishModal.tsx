import { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DialogAction } from '@repo/shared';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

interface ConfirmUnpublishModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	courseId?: string;
	onSuccess?: () => void;
}

const ConfirmUnpublishModal = ({ handleCloseModal, courseId, onSuccess }: ConfirmUnpublishModalProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const [unpublishCourse] = useLazyRequest(api.unpublishCourse, {
		onError: (error) => {
			console.error('Error unpublishing course:', error);
			generalErrorHandler(error);
			setIsLoading(false);
		},
		onSuccess: () => {
			showToast('課程已成功下架', 'success');
			setIsLoading(false);
			onSuccess?.();
			handleCloseModal?.(DialogAction.CONFIRM);
			window.location.reload(); // TODO: 改用 refetch
		},
	});

	const handleUnpublish = () => {
		if (!courseId) {
			showToast('找不到課程ID', 'error');
			return;
		}

		setIsLoading(true);
		unpublishCourse({ courseId });
	};

	return (
		<Box>
			<Box sx={{ marginBottom: '24px' }}>一旦下架，此課程將無法再被訂購。</Box>

			<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
				<CoreButton
					color='default'
					variant='outlined'
					label='取消'
					onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
					disabled={isLoading}
				/>
				<CoreButton
					color='default'
					variant='contained'
					label='下架'
					sx={{
						backgroundColor: '#FF5630',
						'&:hover': { backgroundColor: '#E04A29' },
						'&.Mui-disabled': { backgroundColor: '#FFB3A6' },
					}}
					onClick={handleUnpublish}
					disabled={isLoading}
					startIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : undefined}
				/>
			</Box>
		</Box>
	);
};

export default ConfirmUnpublishModal;
