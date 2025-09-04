import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreCheckboxGroup from '@/CIBase/CoreCheckboxGroup';
import FormikCheckbox from '@/CIBase/Formik/FormikCheckbox';
import PageControl from '@/components/PageControl';
import { fakeShapeCheckboxData, fakeSportCheckboxData } from '@/Example/fakeData';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';

const CheckboxDocs = () => {
	const [checkboxValue, setCheckboxValue] = useState([fakeSportCheckboxData[0].value]);

	const validationSchema = Yup.object().shape({
		shape: Yup.array().min(1, 'This field is required'),
	});

	return (
		<>
			<PageControl title='checkbox' hasNav />
			<Intro
				title='Normal Checkbox'
				content='To use a normal checkbox group with no validation, simply import the CheckboxGroup component. Below is an example.'
			/>
			<Stack sx={{ '& .MuiFormGroup-root': { mt: 2 } }}>
				<CoreCheckboxGroup
					label='Select with row'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<CoreCheckboxGroup
					label='Select with column'
					direction='column'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<Box mt={1}>
					{fakeSportCheckboxData
						.filter((e) => checkboxValue.includes(e.value))
						.map((item) => item.label)
						.join(', ')}{' '}
					are chosen
				</Box>
			</Stack>
			<Line />
			<Intro title='Color' />
			<Stack sx={{ '& .MuiFormGroup-root': { mr: 3, mb: 3 } }}>
				<CoreCheckboxGroup
					label='Default'
					color='default'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<CoreCheckboxGroup
					label='Primary'
					color='primary'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<CoreCheckboxGroup
					label='Secondary'
					color='secondary'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<CoreCheckboxGroup
					label='Info'
					color='info'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<CoreCheckboxGroup
					label='Warning'
					color='warning'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<CoreCheckboxGroup
					label='Success'
					color='success'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
				<CoreCheckboxGroup
					label='Error'
					color='error'
					value={checkboxValue}
					options={fakeSportCheckboxData}
					onChange={(e) => {
						const { checked, value } = e.target;
						if (checked) {
							setCheckboxValue((prevState) => [...prevState, value]);
						} else {
							setCheckboxValue((prevState) => prevState.filter((item) => item !== value));
						}
					}}
				/>
			</Stack>
			<Intro
				title='Formik Checkbox'
				content='Formik checkbox is the same as checkbox, just with validation. Below is an example.'
			/>
			<Formik
				initialValues={{
					shape: [] as string[],
				}}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					alert(
						`You Chose ${fakeShapeCheckboxData
							.filter((e) => values.shape.includes(e.value))
							.map((item) => item.label)
							.join(', ')}`,
					);
				}}
			>
				{({ values, setFieldValue }) => (
					<Form autoComplete='off'>
						<FormikCheckbox
							label='please choose shape'
							name='shape'
							direction='column'
							options={fakeShapeCheckboxData}
							onChange={(e) => {
								const { checked, value } = e.target;
								if (checked) {
									setFieldValue('shape', [...values.shape, value]);
								} else {
									setFieldValue(
										'shape',
										values.shape.filter((item) => item !== value),
									);
								}
							}}
						/>
						<CoreButton size='medium' variant='contained' color='primary' label='Submit' type='submit' />
					</Form>
				)}
			</Formik>
		</>
	);
};

export default CheckboxDocs;
