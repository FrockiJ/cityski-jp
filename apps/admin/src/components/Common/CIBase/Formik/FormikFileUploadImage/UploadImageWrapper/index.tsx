import { ReactNode } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box } from '@mui/material';

import { StyledFormHelperText, StyledTitle, StyledTooltip, StyledWrapper } from '../styles';

const FormikFileUploadImageWrapper = ({
	isRequired = false,
	helperText,
	title,
	margin,
	info,
	width,
	children,
}: {
	children: ReactNode;
	isRequired?: boolean;
	hasPreview?: boolean;
	helperText?: string;
	title?: string;
	margin?: string;
	info?: string;
	width?: number | string;
}) => {
	return (
		<Box display='flex' flexDirection='column' width={width} margin={margin}>
			{title && (
				<StyledTitle>
					{isRequired && (
						<Box component='span' sx={{ color: 'error.main', mr: 0.5 }}>
							*
						</Box>
					)}
					{title}
					{info && (
						<StyledTooltip title={info}>
							<InfoOutlinedIcon color='primary' sx={{ ml: 1 }} />
						</StyledTooltip>
					)}
				</StyledTitle>
			)}
			<StyledWrapper>{children}</StyledWrapper>
			{helperText && <StyledFormHelperText>{helperText}</StyledFormHelperText>}
		</Box>
	);
};

export default FormikFileUploadImageWrapper;
