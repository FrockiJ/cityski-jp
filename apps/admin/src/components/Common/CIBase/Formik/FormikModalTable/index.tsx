import React from 'react';
import { Box, FormControl, SxProps, Tooltip } from '@mui/material';
import { FieldConfig, useField } from 'formik';

import * as Components from '@/components/Project/shared/Components';
import InfoIcon from '@/Icon/InfoIcon';

import { FormikErrorMessage } from '../common/FormikComponents';

import { StyledTitle } from './styles';

export interface FormikModalTableProps extends FieldConfig {
	name: string;
	info?: string;
	title?: string;
	width?: string;
	margin?: string;
	isRequired?: boolean;
	disabled?: boolean;
	wrapperSxProps?: SxProps;
	tableHeader: {
		label: string;
		width: string;
		show: boolean;
	}[];
	tableRowCell: {
		width: string;
		label?: string;
		component?: React.ReactNode;
		show: boolean;
	}[][];
}

const FormikModalTable = ({
	name,
	disabled,
	info,
	title,
	width,
	margin,
	isRequired,
	wrapperSxProps,
	tableHeader,
	tableRowCell,
}: FormikModalTableProps) => {
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

			<Components.Row header tableHeader={tableHeader}>
				{tableHeader
					.filter((x) => x.show)
					.map(({ label, width }, index) => (
						<Components.StyledCell header key={index} width={width}>
							{label}
						</Components.StyledCell>
					))}
			</Components.Row>

			{tableRowCell.map((row, index) => (
				<Components.Row key={index}>
					{row
						.filter((x) => x.show)
						.map(({ label, component, width }, index) => (
							<Components.StyledCell key={index} dense width={width}>
								{component && component}
								{label && label}
							</Components.StyledCell>
						))}
				</Components.Row>
			))}
			<FormikErrorMessage name={field.name} />
		</FormControl>
	);
};

export default FormikModalTable;
