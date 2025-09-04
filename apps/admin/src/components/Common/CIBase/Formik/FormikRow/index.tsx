import React from 'react';
import { Box, FormControl, SxProps, Tooltip } from '@mui/material';
import { FieldConfig, useField } from 'formik';

import InfoIcon from '@/Icon/InfoIcon';

import { FormikErrorMessage } from '../common/FormikComponents';

import { StyledTitle } from './styles';

export interface FormikRowProps extends FieldConfig {
	name: string;
	info?: string;
	title?: string;
	width?: string;
	margin?: string;
	isRequired?: boolean;
	disabled?: boolean;
	wrapperSxProps?: SxProps;
	children: React.ReactNode;
}

const FormikRow = ({
	name,
	disabled,
	info,
	title,
	width,
	margin,
	isRequired,
	wrapperSxProps,
	children,
}: FormikRowProps) => {
	const [field, meta, helpers] = useField(name);
	const error = !!meta.error && !!meta.touched;

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
				sx={(theme) => ({
					display: 'flex',
					alignItems: 'center',
					padding: '12px 16px',
					borderRadius: 2,
					backgroundColor: 'background.light',
					border: `1px solid ${error ? theme.palette.error.main : 'transparent'}`,
				})}
			>
				{children}
			</Box>
			<FormikErrorMessage name={field.name} />
		</FormControl>
	);
};

export default FormikRow;
