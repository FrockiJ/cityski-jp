import { Box, Collapse, Divider } from '@mui/material';

const input = () => {
	return (
		<>
			<Box sx={{ width: '1000px' }}>
				<Box sx={{ fontSize: '24px', fontWeight: 700 }}>Input Props</Box>
				<Box mt='12px'>props of input</Box>
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>name</Box>
					<Box mt='12px'>Formik field name</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>value</Box>
					<Box mt='12px'>Formik field value</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>title</Box>
					<Box mt='12px'>Formik field title</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>placeholder</Box>
					<Box mt='12px'>Formik field placeholder</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>disabled</Box>
					<Box mt='12px'>Formik field disable</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>readOnly</Box>
					<Box mt='12px'>Formik field readOnly</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>info</Box>
					<Box mt='12px'>Formik field tooltip context</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>type</Box>
					<Box mt='12px'>Formik text field or password field</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>autoFocus</Box>
					<Box mt='12px'>Formik field auto focus</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>style</Box>
					<Box mt='12px'>Formik field style</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: {`Record<string, string>`}
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>width</Box>
					<Box mt='12px'>Formik field width</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string | number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>size</Box>
					<Box mt='12px'>Formik field size</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: small | medium
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>errorText</Box>
					<Box mt='12px'>Formik field validation error text</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>margin</Box>
					<Box mt='12px'>Formik field margin style</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>defaultValue</Box>
					<Box mt='12px'>Formik field default value</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>onInputChange</Box>
					<Box mt='12px'>When you enter text, it triggers a callback function with a parameter.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>iconType</Box>
					<Box mt='12px'>Formik field icon type</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>multiline</Box>
					<Box mt='12px'>Formik field allow enter multiline</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>rows</Box>
					<Box mt='12px'>Formik field display rows when multiline is true</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>remarkText</Box>
					<Box mt='12px'>Formik field remark context</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>endText</Box>
					<Box mt='12px'>Formik field suffix context</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>hasClearIcon</Box>
					<Box mt='12px'>Formik field clear button</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>headerSearch</Box>
					<Box mt='12px'>Formik field search style, iconType recommended to "search"</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>onChange</Box>
					<Box mt='12px'>When you enter text, it triggers a callback function with a parameter.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>onBlur</Box>
					<Box mt='12px'>When field lost focus, it triggers a callback function with a parameter.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
				<Divider />
			</Box>
		</>
	);
};

export default input;
