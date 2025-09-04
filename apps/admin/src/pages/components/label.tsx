import CoreLabel from '@/CIBase/CoreLabel';
import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';

const label = () => {
	return (
		<>
			<PageControl title='Label' hasNav />
			<Intro
				title='Basic usage'
				content={
					<>
						Add{' '}
						<CoreLabel color='info'>
							color="default"(default), "primary", "info", "success", "warning", "error"
						</CoreLabel>
						, to control color of label
					</>
				}
			/>
			<CoreLabel sx={{ ml: 2 }}>Default</CoreLabel>
			<CoreLabel color='primary' sx={{ ml: 2 }}>
				Primary
			</CoreLabel>
			<CoreLabel color='secondary' sx={{ ml: 2 }}>
				Secondary
			</CoreLabel>
			<CoreLabel color='info' sx={{ ml: 2 }}>
				Info
			</CoreLabel>
			<CoreLabel color='success' sx={{ ml: 2 }}>
				Success
			</CoreLabel>
			<CoreLabel color='warning' sx={{ ml: 2 }}>
				Warning
			</CoreLabel>
			<CoreLabel color='error' sx={{ ml: 2 }}>
				Error
			</CoreLabel>
		</>
	);
};

export default label;
