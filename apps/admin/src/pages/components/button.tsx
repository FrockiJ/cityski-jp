import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Stack } from '@mui/material';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreLabel from '@/components/Common/CIBase/CoreLabel';
import CoreLink from '@/components/Common/CIBase/CoreLink';
import ShieldLockIcon from '@/components/Common/Icon/ShieldLockIcon';
import Intro from '@/components/Example/Intro';
import Line from '@/components/Example/Line';
import PageControl from '@/components/PageControl';

const ComponentExamples = () => (
	<>
		<PageControl title='Button' hasNav />
		<Stack sx={{ gap: '20px' }}>
			<Box sx={{ '& button': { m: 2, ml: 0, mb: 1 } }}>
				<Intro
					title='Basic usage'
					content={
						<>
							Add <CoreLabel color='info'>variant="text"(default)</CoreLabel>,{' '}
							<CoreLabel color='info'>variant="contained"</CoreLabel>,{' '}
							<CoreLabel color='info'>variant="outlined"</CoreLabel> to control style of button
						</>
					}
				/>
				<Box>
					<CoreButton label='text' />
					<CoreButton variant='contained' label='contained' />
					<CoreButton variant='outlined' label='outlined' />
				</Box>
				<Line />
				<Intro
					title='Color'
					content={
						<>
							Add <CoreLabel color='info'>color="default"(default), "primary", "secondary", "error" ...</CoreLabel> to
							control color of button
						</>
					}
				/>
				<Box>
					<CoreButton label='default' color='default' />
					<CoreButton label='primary' color='primary' />
					<CoreButton label='secondary' color='secondary' />
					<CoreButton label='error' color='error' />
					<CoreButton label='info' color='info' />
					<CoreButton label='warning' color='warning' />
					<CoreButton label='success' color='success' />
				</Box>
				<Box>
					<CoreButton variant='contained' label='default' color='default' />
					<CoreButton variant='contained' label='primary' color='primary' />
					<CoreButton variant='contained' label='secondary' color='secondary' />
					<CoreButton variant='contained' label='error' color='error' />
					<CoreButton variant='contained' label='info' color='info' />
					<CoreButton variant='contained' label='warning' color='warning' />
					<CoreButton variant='contained' label='success' color='success' />
				</Box>
				<Box>
					<CoreButton variant='outlined' label='default' color='default' />
					<CoreButton variant='outlined' label='primary' color='primary' />
					<CoreButton variant='outlined' label='secondary' color='secondary' />
					<CoreButton variant='outlined' label='error' color='error' />
					<CoreButton variant='outlined' label='info' color='info' />
					<CoreButton variant='outlined' label='warning' color='warning' />
					<CoreButton variant='outlined' label='success' color='success' />
				</Box>
				<Line />
				<Intro
					title='Size'
					content={
						<>
							Add <CoreLabel color='info'>size="small"(default), "medium", "large" ...</CoreLabel> to control size of
							button
						</>
					}
				/>
				<Box>
					<CoreButton size='small' variant='contained' label='Small' color='primary' />
					<CoreButton variant='contained' label='Medium' color='primary' />
					<CoreButton size='large' variant='contained' label='Large' color='primary' />
				</Box>

				<Line />

				<Intro
					title='Button with All variant (and iconType or customIcon)'
					content={
						<>
							<Box>
								Add <CoreLabel color='info'>iconType="add", "delete", "tableFilter", "filterClear"</CoreLabel> to
								control start icon of button or set up customIcon props.
							</Box>
							If you want to use a custom SVG icon, please place it in the
							<CoreLabel>components/Icon</CoreLabel> folder.
							<br />
							Use the
							<CoreLabel color='primary'>SvgIcon</CoreLabel> wrapper, then change the value of the "fill" attribute to{' '}
							<CoreLabel color='info'>"currentColor"</CoreLabel>.<br />
							More information: <CoreLink href='/components/svg-color'>/components/svg-color</CoreLink>
							The purpose is to achieve flexibility in usage.
						</>
					}
				/>

				<Box>
					<CoreButton label='add' iconType='add' variant='contained' size='small' />
					<CoreButton label='add' iconType='add' variant='contained' size='medium' />
					<CoreButton label='add' iconType='add' variant='contained' size='large' />
					<CoreButton label='add' iconType='add' variant='contained' disabled />
					<CoreButton label='add' iconType='add' />
					<CoreButton label='add' iconType='add' variant='outlined' />
				</Box>
				<Box>
					<CoreButton label='delete' iconType='delete' color='error' />
					<CoreButton label='delete' iconType='delete' color='error' variant='contained' />
					<CoreButton label='tableFilter' iconType='tableFilter' />
					<CoreButton label='Filter' iconType='tableFilter' color='default' size='small' />
					<CoreButton label='tableFilter' iconType='tableFilter' color='info' variant='contained' />
					<CoreButton label='filterClear' iconType='filterClear' color='secondary' variant='contained' />
					<CoreButton label='filterClear' iconType='filterClear' color='secondary' variant='outlined' />
				</Box>
				<Box>
					<CoreButton label='ShieldLockIcon' customIcon={<ShieldLockIcon />} disabled variant='outlined' />
					<CoreButton label='VisibilityIcon' customIcon={<VisibilityIcon />} />
					<CoreButton label='CloseIcon' customIcon={<CloseIcon />} color='info' />
					<CoreButton label='ArrowForwardIosIcon' customIcon={<ArrowForwardIosIcon />} color='warning' />
				</Box>
			</Box>
		</Stack>
	</>
);

export default ComponentExamples;
