import { Box } from '@mui/material';

import CoreButton from '@/CIBase/CoreButton';
import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';
import { StyledLink } from '@/Example/styles';
import { showToast } from '@/utils/ui/general';

const snackbar = () => {
	return (
		<>
			<PageControl title='Snackbar' hasNav />
			<Box sx={{ '& button': { m: 2, ml: 0, mb: 1 } }}>
				<CoreButton
					variant='contained'
					label='Info'
					color='info'
					onClick={() => showToast('This is an info', 'info')}
				/>
				<CoreButton
					variant='contained'
					label='Success'
					color='success'
					onClick={() => showToast('This is an success', 'success')}
				/>
				<CoreButton
					variant='contained'
					label='Warning'
					color='warning'
					onClick={() => showToast('This is an warning', 'warning')}
				/>
				<CoreButton
					variant='contained'
					label='Error'
					color='error'
					onClick={() => showToast('This is an error', 'error')}
				/>
			</Box>
			<Intro
				title='Reference'
				noBackground
				content={
					<ul>
						<li>
							<StyledLink href='https://fkhadra.github.io/react-toastify/introduction' rel='noreferrer' target='_blank'>
								https://fkhadra.github.io/react-toastify/introduction
							</StyledLink>
						</li>
					</ul>
				}
			/>
		</>
	);
};

export default snackbar;
