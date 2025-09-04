import { useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { alpha, Box, FormControl, IconButton, SxProps, Tooltip, Typography } from '@mui/material';
import { useField, useFormikContext } from 'formik';

import CoreInput from '@/CIBase/CoreInput';
import useGetYoutubeImage from '@/hooks/useGetYoutubeImage';
import InfoIcon from '@/Icon/InfoIcon';

import CoreLoaders from '../../CoreLoaders';
import { FormikErrorMessage } from '../common/FormikComponents';

import { StyledTitle } from './styles';

export interface FormikYoutubeThumbnailProps {
	name: string;
	isRequired?: boolean;
	info?: string;
	title?: string;
	placeholder?: string;
	width?: number | string;
	margin?: string;
	wrapperSxProps?: SxProps;
}

const FormikYoutubeThumbnail = ({
	name,
	isRequired,
	info,
	title,
	placeholder = 'Enter',
	width,
	margin,
	wrapperSxProps,
}: FormikYoutubeThumbnailProps) => {
	const [field, meta, helpers] = useField(name);
	const { setFieldValue } = useFormikContext();
	const { videoThumbnail, videoTitle, videoLoading, videoValid } = useGetYoutubeImage({ url: field.value });
	const error = !!meta.error && !!meta.touched;

	const handleCloseThumbnail = () => {
		helpers.setValue('');
		helpers.setTouched(true, true);
	};

	useEffect(() => {
		if (videoTitle) {
			setFieldValue('name', videoTitle);
		}
	}, [setFieldValue, videoTitle]);

	useEffect(() => {
		if (!field.value) {
			setFieldValue('name', field.value);
		}
	}, [field.value, setFieldValue]);

	return (
		<FormControl
			sx={{
				width: width ? width : 'initial',
				margin: margin ? margin : '0 0 20px 0',
				...wrapperSxProps,
			}}
		>
			{title && (
				<StyledTitle>
					{isRequired && <Box sx={{ color: 'error.main', marginRight: '2px' }}>*</Box>}
					{title}
					{info && (
						<Tooltip title={info}>
							<span style={{ display: 'inherit' }}>
								<InfoIcon color='info' sx={{ ml: 1 }} />
							</span>
						</Tooltip>
					)}
				</StyledTitle>
			)}

			<Box
				sx={{
					padding: 2,
					borderRadius: 2,
					backgroundColor: 'grey.200',
				}}
			>
				<CoreInput
					rootStyle={{ width: '100%', background: '#FFF' }}
					value={field.value}
					placeholder={placeholder}
					isError={error}
					onChange={(value) => {
						helpers.setValue(value, true);
					}}
				/>
				<FormikErrorMessage name={field.name} />

				<Box
					sx={(theme) => ({
						display: 'flex',
						position: 'relative',
						alignItems: 'center',
						justifyContent: 'space-between',
						borderRadius: 3,
						border: `1px dashed ${alpha(theme.palette.text.quaternary, 0.48)}`,
						overflow: 'hidden',
						backgroundColor: '#FFF',
						marginTop: 1.25,
						opacity: videoValid ? 1 : 0,
						height: videoValid ? 77 : 0,
						visibility: videoValid ? 'visible' : 'hidden',
						transition: 'all ease 0.4s',
					})}
				>
					{videoLoading && <CoreLoaders hasOverlay />}
					<Box
						sx={{
							width: 100,
							height: 75,
							backgroundImage: `url("${videoThumbnail}")`,
							backgroundPosition: 'center',
							backgroundSize: 'contain',
							backgroundRepeat: 'no-repeat',
							backgroundColor: '#EDEFF1',
						}}
					/>
					<Box
						sx={{
							position: 'relative',
							height: 75,
							flex: 1,
							padding: '16px 36px 13px 16px',
						}}
					>
						<Typography
							variant='body2'
							sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
						>
							{videoTitle}
						</Typography>
						<IconButton onClick={handleCloseThumbnail} size='small' sx={{ position: 'absolute', top: 0, right: 0 }}>
							<CancelIcon />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</FormControl>
	);
};

export default FormikYoutubeThumbnail;
