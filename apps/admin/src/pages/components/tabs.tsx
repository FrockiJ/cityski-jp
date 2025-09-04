import { useState } from 'react';
import { Box, Stack } from '@mui/material';

import CoreTabs, { CoreTab } from '@/CIBase/CoreTabs';
import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';
import { StyledLink } from '@/Example/styles';
import { StatusTabs } from '@/shared/constants/enums';

const TabsDocs = () => {
	const [tabValue, setTabValue] = useState<number>(StatusTabs.ALL);
	const [tabValue2, setTabValue2] = useState<number>(StatusTabs.ALL);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};
	const handleTabChange2 = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue2(newValue);
	};

	return (
		<>
			<PageControl title='tabs' hasNav />
			<Intro
				title='Default'
				content={
					<>
						Here, only the standard style of the template is modified. For more information, please refer to{' '}
						<StyledLink href='https://mui.com/material-ui/react-tabs/' rel='noreferrer' target='_blank'>
							https://mui.com/material-ui/react-tabs/
						</StyledLink>
					</>
				}
			/>
			<Stack>
				<div>
					<CoreTabs value={tabValue} onChange={handleTabChange}>
						<CoreTab value={0} label='Section 1' />
						<CoreTab value={1} label='Section 2' />
						<CoreTab value={2} label='Section 3' />
					</CoreTabs>
					<p>{`this is Section ${tabValue + 1}`}</p>
				</div>
				<Line />
				<Intro title='Scrollable tabs & Section2 is disabled' />
				<Box sx={{ maxWidth: '500px' }}>
					<CoreTabs value={tabValue2} onChange={handleTabChange2} variant='scrollable' scrollButtons='auto'>
						<CoreTab value={0} label='Section 1' />
						<CoreTab value={1} label='Section 2' disabled />
						<CoreTab value={2} label='Section 3' />
						<CoreTab value={3} label='Section 4' />
						<CoreTab value={4} label='Section 5' />
						<CoreTab value={5} label='Section 6' />
						<CoreTab value={6} label='Section 7' />
					</CoreTabs>
					<p>{`this is Section ${tabValue2 + 1}`}</p>
				</Box>
			</Stack>
		</>
	);
};

export default TabsDocs;
