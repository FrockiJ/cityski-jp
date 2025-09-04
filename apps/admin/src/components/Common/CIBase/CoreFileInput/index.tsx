import { useRef } from 'react';
import { Box, Tooltip } from '@mui/material';

import { StyledInput, StyledInputWrapper } from '@/CIBase/Formik/FormikInput/styles';
import InfoIcon from '@/Icon/InfoIcon';
import { SizeBreakPoint } from '@/shared/types/general';

import { StyledFormControl, StyledTitleWrapper } from './styles';

export interface CoreFileInputProps {
	title?: string;
	info?: string;
	onChange: (files: FileList | null) => void;
	width?: string | number;
	size?: Exclude<SizeBreakPoint, 'large'>;
	margin?: string;
	accept?: string;
}

const CoreFileInput = ({ title, width, size = 'medium', info, onChange, margin, ...restProps }: CoreFileInputProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	return (
		<StyledFormControl width={width} customMargin={margin}>
			<Box display='flex' justifyContent='center' flexDirection='column'>
				{title && (
					<StyledTitleWrapper>
						{title}
						{info && (
							<Tooltip title={info}>
								<InfoIcon color='info' sx={{ ml: 1 }} />
							</Tooltip>
						)}
					</StyledTitleWrapper>
				)}
				<StyledInputWrapper width={width} size={size} onClick={() => inputRef.current?.focus()}>
					<StyledInput
						ref={inputRef}
						onChange={(e: { target: { files: FileList | null } }) => onChange(e.target.files)}
						spellCheck='false'
						type='file'
						{...restProps}
					/>
				</StyledInputWrapper>
			</Box>
		</StyledFormControl>
	);
};

export default CoreFileInput;
