import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLabel from '@/CIBase/CoreLabel';
import CoreSelect from '@/CIBase/CoreSelect';
import FormikSelect from '@/CIBase/Formik/FormikSelect';
import PageControl from '@/components/PageControl';
import { fakeOptions } from '@/Example/fakeData';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';
import { StyledLink } from '@/Example/styles';

const SelectDocs = () => {
	const validationSchema = Yup.object().shape({
		exampleSelect: Yup.string().required('This field is required'),
	});

	return (
		<>
			<PageControl title='Select' hasNav />
			<Intro title='Normal Select' />
			{/* SELECT dropdown direction = DOWN */}
			<CoreSelect
				title='Normal Select'
				options={fakeOptions}
				margin='0 0 10px 15px'
				menuPlacement='bottom'
				onChange={(selectedOption) => {
					console.log(selectedOption);
				}}
			/>
			{/* SELECT dropdown direction = UP */}
			<CoreSelect
				title='Normal Select With Default'
				defaultValue={fakeOptions[2]}
				options={fakeOptions}
				menuPlacement='top'
				margin='0 0 10px 15px'
				onChange={(selectedOption) => {
					console.log(selectedOption);
				}}
			/>
			{/* SELECT disabled select */}
			<CoreSelect
				title='Disabled Select'
				disabled
				options={fakeOptions}
				margin='0 0 10px 15px'
				onChange={(selectedOption) => {
					console.log(selectedOption);
				}}
			/>
			<Line />
			<Intro
				title='Multi Select'
				content={
					<>
						To use multi select, give the Select component the <CoreLabel color='info'>isMulti</CoreLabel> prop.
					</>
				}
			/>
			{/* MULTI-SELECT dropdown direction = DOWN */}
			<CoreSelect
				isMulti
				title='Multi Select'
				options={fakeOptions}
				margin='0 0 10px 15px'
				onChange={(selectedOption) => {
					console.log(selectedOption);
				}}
			/>
			<CoreSelect
				isMulti
				title='Multi Select With Default'
				defaultValue={[fakeOptions[2], fakeOptions[3]]}
				options={fakeOptions}
				margin='0 0 10px 15px'
				onChange={(selectedOption) => {
					console.log(selectedOption);
				}}
			/>
			<CoreSelect
				isMulti
				disabled
				title='Disabled Multi Select'
				defaultValue={[fakeOptions[2], fakeOptions[3]]}
				options={fakeOptions}
				margin='0 0 10px 15px'
				onChange={(selectedOption) => {
					console.log(selectedOption);
				}}
			/>
			<Line />
			<Intro title='Formik Select' content='A Select field with validation.' />
			<Formik
				initialValues={{
					exampleSelect: '',
				}}
				validationSchema={validationSchema}
				onSubmit={(values) => console.log({ values })}
			>
				{({ values, handleBlur }) => (
					<Form autoComplete='off'>
						<FormikSelect
							title='Formik Select'
							menuPlacement='top'
							isRequired
							name='exampleSelect'
							options={fakeOptions}
							optionValue={values.exampleSelect}
							onBlur={handleBlur}
							width={250}
							margin='0 20px 0 0'
						/>
						<CoreButton label='Submit' type='submit' margin='30px 0 0 0' />
					</Form>
				)}
			</Formik>
			<Line />
			<Intro
				title='Reference'
				noBackground
				content={
					<ul>
						<li>
							<StyledLink href='https://react-select.com/home' rel='noreferrer' target='_blank'>
								https://react-select.com/home
							</StyledLink>
						</li>
					</ul>
				}
			/>
		</>
	);
};

export default SelectDocs;
