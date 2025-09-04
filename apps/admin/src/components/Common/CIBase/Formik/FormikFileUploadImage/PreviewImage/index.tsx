import CloseIcon from '@mui/icons-material/Close';
import { alpha, Dialog, DialogContent, IconButton } from '@mui/material';
import Image from 'next/image';

import { ImageSizeType } from '..';

const PreviewImage = ({
	open,
	handleClose,
	imageUrl,
	imageSize,
}: {
	open: boolean;
	handleClose: () => void;
	imageUrl?: string;
	imageSize: ImageSizeType;
}) => {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			closeAfterTransition={false}
			scroll='body'
			slotProps={{
				backdrop: {
					sx: { backgroundColor: alpha('#000', 0.8) },
				},
			}}
			PaperProps={{
				elevation: 0,
				sx: {
					margin: 0,
					borderRadius: 0,
					overflowY: 'initial',
					position: 'initial',
					backgroundColor: 'initial',
					color: 'initial',
				},
			}}
		>
			<IconButton
				aria-label='close'
				onClick={handleClose}
				sx={{
					position: 'absolute',
					right: 12,
					top: 19,
					color: '#FFF',
					'&:hover': {
						backgroundColor: alpha('#FFF', 0.5),
					},
				}}
			>
				<CloseIcon />
			</IconButton>
			<DialogContent sx={{ p: 0 }}>
				<Image
					unoptimized
					src={imageUrl || ''}
					width={imageSize.width}
					height={imageSize.height}
					alt='image preview'
					style={{ width: '100%', height: 'auto' }}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default PreviewImage;
