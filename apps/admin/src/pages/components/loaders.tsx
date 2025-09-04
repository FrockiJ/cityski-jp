import { Box } from '@mui/material';

import CoreLoaders from '@/CIBase/CoreLoaders';
import PageControl from '@/components/PageControl';
import Code from '@/Example/Code';
import Intro from '@/Example/Intro';
import { StyledLink } from '@/Example/styles';

const LoadingDocs = () => {
	return (
		<>
			<PageControl title='Loaders' hasNav />

			<div>
				<Intro
					title='Loaders | UI Ball'
					content={
						<>
							UI Ball Loaders link :{' '}
							<StyledLink href='https://uiball.com/loaders/' rel='noreferrer' target='_blank'>
								UI Ball Loaders
							</StyledLink>
						</>
					}
				/>
				<Code
					code={`import CoreLoaders from '@/CIBase/CoreLoaders';;
				
<CoreLoading />
<CoreLoading type="DotSpinner" noText/>
<CoreLoaders text='Loading...' />
<CoreLoaders hasOverlay />
`}
				/>
				<Box display='flex' mb='30px' gap='50px'>
					<CoreLoaders />
					<CoreLoaders type='DotSpinner' />
					<CoreLoaders text='Loading...' />
				</Box>
				<Intro
					title='react-loading-icons'
					content={
						<>
							Another recommended loading library is react-loading-icons, storybook demo link :{' '}
							<StyledLink href='https://loading.damiankress.de/' rel='noreferrer' target='_blank'>
								react-loading-icons
							</StyledLink>
						</>
					}
				/>
			</div>
		</>
	);
};

export default LoadingDocs;
