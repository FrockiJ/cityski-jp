import SearchIcon from '@mui/icons-material/Search';
import { Box, debounce } from '@mui/material';
import { Form, Formik } from 'formik';
import PropsLink from 'src/template-only/components/PropsLink';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreInput from '@/CIBase/CoreInput';
import CoreLabel from '@/CIBase/CoreLabel';
import FormikInput from '@/CIBase/Formik/FormikInput';
import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';

const InputDocs = () => {
	return (
		<>
			<PageControl title='Input' hasNav />

			<PropsLink url={'/docs/props/input'} />
			<Intro title='Basic Input' />
			<Box sx={{ '> div': { mr: '16px' } }}>
				<CoreInput />
				<CoreInput title='Input Title with Tooltip' />
				<CoreInput title='Input Title & SubTitle with Tooltip' subTitle='SubTitle' />
				<CoreInput title='Input Title with startNode' startNode={<SearchIcon />} />
				<CoreInput title='Input Title with endNode' endNode={<SearchIcon />} />
				<CoreInput title='Input Title with Tooltip & isRequired' isRequired />
				<CoreInput
					title='Input Title with variant=headerSearch'
					variant='headerSearch'
					placeholder='Search'
					startAdornment={<SearchIcon />}
				/>
			</Box>
			<Intro
				title='Some props in Input'
				content={
					<>
						Add <CoreLabel color='info'>width="400px"</CoreLabel>, <CoreLabel color='info'>info="...word"</CoreLabel>,{' '}
						<CoreLabel color='info'>isRequired</CoreLabel>,{' '}
						<CoreLabel color='info'>size="small"(default), "medium"</CoreLabel>,{' '}
						<CoreLabel color='info'>defaultValue="hello"</CoreLabel>.
						<br />
						See code implementation for more information.
					</>
				}
			/>
			<Box sx={{ '> div': { mb: '16px' } }}>
				<CoreInput
					title={`width="400px", size="medium", defaultValue="hello"`}
					size='medium'
					defaultValue='hello'
					inputStyle={{ width: 400 }}
					onChange={debounce((event) => {
						console.log(event.target.value);
					})}
				/>
				<CoreInput
					title={`width="100%", size="medium", info="...word", isRequired, defaultValue="hello"`}
					subTitle='some information'
					size='medium'
					inputStyle={{ width: '100%' }}
					isRequired
					onChange={debounce((event) => {
						console.log(event.target.value);
					})}
				/>
			</Box>
			<Line />
			<Intro title='Formik Input' content='An input field with validation.' />
			<Formik
				initialValues={{
					exampleInput1: '',
					exampleInput2: '',
					exampleInput3: '',
				}}
				validationSchema={Yup.object().shape({
					exampleInput1: Yup.string()
						.min(6, 'Minimum 6 characters')
						.max(20, 'The maximum allowed characters is 20')
						.required('This field is required'),
					exampleInput2: Yup.string()
						.min(6, 'Minimum 6 characters')
						.max(20, 'The maximum allowed characters is 20')
						.required('This field is required'),
					exampleInput3: Yup.string()
						.min(6, 'Minimum 6 characters')
						.max(20, 'The maximum allowed characters is 20')
						.required('This field is required'),
				})}
				onSubmit={() => {}}
			>
				{({ values }) => (
					<Form autoComplete='off'>
						<FormikInput
							title='Input'
							name='exampleInput1'
							placeholder='Enter Input'
							info='Info message'
							helperText='This is the helper text'
						/>
						<FormikInput
							title='Input with count'
							name='exampleInput2'
							isRequired
							width='100%'
							hasTextCountAdornment
							textCount={values.exampleInput2.length}
							maxTextCount={40}
						/>
						<FormikInput
							title='Input with Multiline and Count'
							name='exampleInput3'
							margin='0 0 24px 0'
							width='100%'
							isRequired
							multiline
							rows={3}
							hasClearIcon={false}
							hasTextCountAdornment
							textCount={values.exampleInput3.length}
							maxTextCount={160}
						/>
						<CoreButton variant='contained' color='primary' label='Submit' type='submit' margin='0 0 0 15px' />
					</Form>
				)}
			</Formik>
		</>
	);
};

export default InputDocs;
