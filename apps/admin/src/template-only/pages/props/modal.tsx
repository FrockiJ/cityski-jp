import { Box, Divider } from '@mui/material';

const modal = () => {
	return (
		<>
			<Box sx={{ width: '1000px' }}>
				<Box sx={{ fontSize: '24px', fontWeight: 700 }}>Modal Props</Box>
				<Box mt='12px'>props of modal</Box>
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>title</Box>
					<Box mt='12px'>Modal main title on head</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>width</Box>
					<Box mt='12px'>Custom modal width</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string | number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>height</Box>
					<Box mt='12px'>Custom modal's content height</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string | number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>contentBGColor</Box>
					<Box mt='12px'>Modal content background color , value is same as ccs backgroundColor.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>center</Box>
					<Box mt='12px'>Animation, true is show on center, false is slide in from the right.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
					<Box mt='4px'>
						<strong>Default</strong>: true
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>children</Box>
					<Box mt='12px'>Pass in the main content. string, reactNode, etc.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: any
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>confirmLabel</Box>
					<Box mt='12px'>Custom confirm button's label.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>cancelLabel</Box>
					<Box mt='12px'>Custom cancel button's label.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>fullScreen</Box>
					<Box mt='12px'>FullScreen modal.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
					<Box mt='4px'>
						<strong>Default</strong>: false
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>size</Box>
					<Box mt='12px'>Modal width size.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: 'large' | 'medium'
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>disabledAction</Box>
					<Box mt='12px'>Disable action buttons.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
					<Box mt='4px'>
						<strong>Default</strong>: false
					</Box>
				</Box>
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>disabledEscAndBackdrop</Box>
					<Box mt='12px'>Disable Esc And Backdrop to close modal.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
					<Box mt='4px'>
						<strong>Default</strong>: false
					</Box>
				</Box>

				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>onClose</Box>
					<Box mt='12px'>
						When you press the button, it triggers a callback function with a parameter. If you press 'confirm', it
						returns 'confirm', and if you press 'cancel', it returns 'cancel'.
					</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
				<Divider />
			</Box>
			<Box sx={{ marginTop: '60px', width: '1000px' }}>
				<Box sx={{ fontSize: '24px', fontWeight: 700 }}>Message Modal Props</Box>
				<Box mt='12px'>props of message modal</Box>
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>title</Box>
					<Box mt='12px'>Modal main title on head</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>type</Box>
					<Box mt='12px'>Message type, error, warning, info and confirm.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: 'error' | 'warning' | 'info' | 'confirm'
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>content</Box>
					<Box mt='12px'>message of content</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>confirmLabel</Box>
					<Box mt='12px'>Custom confirm button's label.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>cancelLabel</Box>
					<Box mt='12px'>Custom cancel button's label.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>width</Box>
					<Box mt='12px'>Custom modal width.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string | number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>onClose</Box>
					<Box mt='12px'>
						When you press the button, it triggers a callback function with a parameter. If you press 'confirm', it
						returns 'confirm', and if you press 'cancel', it returns 'cancel'.
					</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default modal;
