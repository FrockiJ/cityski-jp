import { useState } from 'react';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreDatePicker from '@/CIBase/CoreDatePicker';
import CoreDatePickerRange from '@/CIBase/CoreDatePickerRange';
import CoreLabel from '@/CIBase/CoreLabel';
import FormikDatePickerRange from '@/CIBase/Formik/FormikDatePickerRange';
import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';

const FormSchema = Yup.object().shape({
	rangeStartDate: Yup.mixed()
		.test('is-required-date', '此欄位必填', (value) => dayjs.isDayjs(value))
		.test('is-valid-date', '錯誤格式 (yyyy/mm/dd)', (value) => dayjs.isDayjs(value) && dayjs(value).isValid())
		.test('is-valid-range', 'Should be less than end date', function (value) {
			const { rangeEndDate } = this.parent;
			if (!dayjs(rangeEndDate).isValid()) return true;
			return dayjs.isDayjs(value) && dayjs(value).isBefore(rangeEndDate, 'day');
		}),
	rangeEndDate: Yup.mixed()
		.test('is-required-date', '此欄位必填', (value) => dayjs.isDayjs(value))
		.test('is-valid-date', '錯誤格式 (yyyy/mm/dd)', (value) => dayjs.isDayjs(value) && dayjs(value).isValid())
		.required('Range End Date is required'),
});

const DatePickerDocs = () => {
	const [startDate1, setStartDate1] = useState<Dayjs | null>(dayjs());

	const [value, setValue] = useState<{
		startDate: Dayjs | null;
		endDate: Dayjs | null;
	}>({ startDate: dayjs(), endDate: dayjs().add(3, 'day') });

	// const [value2, setValue2] = useState<{
	//   startDate: Dayjs | null;
	//   endDate: Dayjs | null;
	// }>({ startDate: null, endDate: null });

	return (
		<>
			<PageControl title='DatePicker' hasNav />
			<Intro title='Basic usage' />
			<CoreDatePicker
				title='General'
				value={startDate1}
				onChange={setStartDate1}
				onError={(error, value) => console.log({ error, value })}
			/>

			<Intro
				content={
					<>
						Add <CoreLabel color='info'>size="medium"</CoreLabel> to control its size.
						<br />
						Add <CoreLabel color='info'>width="400px"</CoreLabel> to control its width.
						<br />
						Add <CoreLabel color='info'>width="100%"</CoreLabel> to control its full width.
					</>
				}
			/>
			<Box sx={{ '> div:first-of-type': { mb: 3 } }}>
				<CoreDatePicker
					title={`size="medium", width="400px"`}
					width='400px'
					size='medium'
					value={startDate1}
					onChange={setStartDate1}
				/>
				<CoreDatePicker
					title={`size="medium", width="100%"`}
					width='100%'
					size='medium'
					value={startDate1}
					onChange={setStartDate1}
				/>
			</Box>
			<Line />

			<Intro title='Datepicker range' />

			<CoreDatePickerRange
				size='medium'
				value={value}
				onChange={(newValue) => {
					setValue(newValue);
				}}
				checkHasError={(error) => {
					console.log('range error', error);
				}}
				startTitle='Start'
				endTitle='End'
			/>

			<Intro
				content={
					<>
						Add <CoreLabel color='info'>direction="column"</CoreLabel>,{' '}
						<CoreLabel color='info'>width="400px"</CoreLabel> to control its direction, width
					</>
				}
			/>

			<CoreDatePickerRange
				width='400px'
				direction='column'
				size='medium'
				value={value}
				onChange={(newValue) => {
					setValue(newValue);
				}}
				checkHasError={(error) => {
					console.log('range error', error);
				}}
				startTitle='Start'
				endTitle='End'
			/>

			<Line />

			<Intro title='Formik react date picker range' content='date picker range with validation' />

			<Box height='300px'>
				<Formik
					initialValues={{
						rangeStartDate: null,
						rangeEndDate: null,
					}}
					validationSchema={FormSchema}
					onSubmit={(value) => {
						console.log('onSubmit value', value);
					}}
				>
					{() => (
						<Form autoComplete='off'>
							<FormikDatePickerRange
								size='medium'
								startName='rangeStartDate'
								endName='rangeEndDate'
								startTitle='開始日期'
								endTitle='結束日期'
							/>
							<CoreButton variant='contained' color='primary' label='Submit' type='submit' margin='30px 0 0 0' />
						</Form>
					)}
				</Formik>
			</Box>
		</>
	);
};

export default DatePickerDocs;
