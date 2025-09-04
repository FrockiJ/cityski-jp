import { Box, FormGroup } from '@mui/material';

import CoreLabel from '@/CIBase/CoreLabel';
import CoreSwitch from '@/CIBase/CoreSwitch';
import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';

const SwitchComponentExamples = () => {
	return (
		<>
			<PageControl title='Switch' hasNav />
			<Intro title='Basic usage' />
			<Box sx={{ '.MuiSwitch-root': { ml: 2 } }}>
				<CoreSwitch
					onChange={({ target: { checked } }) => {
						console.log('basic checked', checked);
					}}
				/>
				<CoreSwitch defaultChecked />
			</Box>
			<Intro
				title='Color'
				content={
					<>
						Add <CoreLabel color='info'>color="primary"(default), "secondary", "error" ...</CoreLabel> to control color
						of switch.
					</>
				}
			/>
			<Box sx={{ '.MuiSwitch-root': { ml: 2 } }}>
				<CoreSwitch defaultChecked />
				<CoreSwitch color='secondary' defaultChecked />
				<CoreSwitch color='error' defaultChecked />
				<CoreSwitch color='warning' defaultChecked />
				<CoreSwitch color='info' defaultChecked />
				<CoreSwitch color='success' defaultChecked />
			</Box>
			<Line />
			<Intro
				title='Label'
				content={
					<>
						If you use
						<CoreLabel color='info'>label=""</CoreLabel>,component <CoreLabel color='info'>FormControlLabel</CoreLabel>{' '}
						will be added to the outer layer.
						<br />
						Add <CoreLabel color='info'>labelPlacement="top", "start", "bottom", "end"</CoreLabel> to control label
						direction.
					</>
				}
			/>

			<FormGroup sx={{ '.MuiFormControlLabel-root': { mb: 1 } }}>
				<CoreSwitch label='啟用/停用' defaultChecked />
				<CoreSwitch label='啟用/停用' disabled />
			</FormGroup>
			<FormGroup aria-label='position' row>
				<CoreSwitch label='Top' disabled labelPlacement='top' />
				<CoreSwitch label='Start' disabled labelPlacement='start' />
				<CoreSwitch label='Bottom' disabled labelPlacement='bottom' />
				<CoreSwitch label='End' disabled labelPlacement='end' />
			</FormGroup>
			<Line />
			<Intro
				title='Size'
				content={
					<>
						Add <CoreLabel color='info'>size="small", "medium"(default)</CoreLabel> to control size of switch.
					</>
				}
			/>
			<Box sx={{ '.MuiSwitch-root': { ml: 2 } }}>
				<CoreSwitch defaultChecked size='small' />
				<CoreSwitch defaultChecked />
			</Box>
		</>
	);
};

export default SwitchComponentExamples;
