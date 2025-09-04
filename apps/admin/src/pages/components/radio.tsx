import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import FormikRadio from '@/CIBase/Formik/FormikRadio';
import PageControl from '@/components/PageControl';
import { fakeAnimalRadios, fakeGenderRadios } from '@/Example/fakeData';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';

const RadioDocs = () => {
	const [radioValue, setRadioValue] = useState(fakeAnimalRadios[0].value);

	const validationSchema = Yup.object().shape({
		gender: Yup.string().required('This field is required'),
	});

	return (
		<>
			<PageControl title='radio' hasNav />
			<Intro
				title='Normal Radio'
				content='To use a normal radio group with no validation, simply import the RadioGroup component. Below is an example.'
			/>
			<Stack sx={{ '& .MuiFormControl-root': { mt: 2 } }}>
				<CoreRadioGroup
					title='Select an animal with row'
					value={radioValue}
					onChange={(e) => setRadioValue(e.target.value)}
					radios={fakeAnimalRadios}
				/>

				<CoreRadioGroup
					title='Select an animal with column'
					value={radioValue}
					onChange={(e) => setRadioValue(e.target.value)}
					radios={fakeAnimalRadios}
					direction='column'
				/>
				<Box mt={1}>{fakeAnimalRadios.find((e) => e.value === radioValue)?.label} is chosen</Box>
			</Stack>
			<Line />
			<Intro title='Color' />
			<Box sx={{ '& .MuiFormControl-root': { mr: 3, mb: 3 } }}>
				<CoreRadioGroup
					title='Default Gender'
					value={radioValue}
					onChange={(e) => setRadioValue(e.target.value)}
					radios={fakeGenderRadios}
					color='default'
				/>
				<CoreRadioGroup
					title='Secondary Gender'
					value={radioValue}
					onChange={(e) => setRadioValue(e.target.value)}
					radios={fakeGenderRadios}
					color='secondary'
				/>
				<CoreRadioGroup
					title='Info Gender'
					value={radioValue}
					onChange={(e) => setRadioValue(e.target.value)}
					radios={fakeGenderRadios}
					color='info'
				/>
				<CoreRadioGroup
					title='Warning Gender'
					value={radioValue}
					onChange={(e) => setRadioValue(e.target.value)}
					radios={fakeGenderRadios}
					color='warning'
				/>
				<CoreRadioGroup
					title='Error Gender'
					value={radioValue}
					onChange={(e) => setRadioValue(e.target.value)}
					radios={fakeGenderRadios}
					color='error'
				/>
			</Box>
			<Line />
			<Intro
				title='Formik Radio'
				content='Formik radio is the same as radio, just with validation. Below is an example.'
			/>
			<Formik
				initialValues={{
					gender: '',
				}}
				validationSchema={validationSchema}
				onSubmit={(values) => console.log({ values })}
			>
				{() => (
					<Form autoComplete='off'>
						<Stack alignItems='flex-start'>
							<FormikRadio radios={fakeGenderRadios} title='please choose a gender' name='gender' />
							<CoreButton size='medium' variant='contained' color='primary' label='Submit' type='submit' />
						</Stack>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default RadioDocs;
