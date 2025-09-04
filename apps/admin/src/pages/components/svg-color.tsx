import { Box, Link } from '@mui/material';

import CoreLabel from '@/CIBase/CoreLabel';
import PageControl from '@/components/PageControl';
import Code from '@/Example/Code';
import Intro from '@/Example/Intro';
import Line from '@/Example/Line';
import EditIcon from '@/Icon/EditIcon';

const SvgColor = () => {
	return (
		<>
			<PageControl title='SvgColor' hasNav />
			<Intro
				// title="Basic usage"
				content={
					<>
						If you need a custom SVG icon, I recommend you can use the
						<CoreLabel color='primary'>SvgIcon</CoreLabel> wrapper.
						<br />
						<Box
							component='span'
							fontWeight='700'
						>{`* If your icon size is 24px, you can remove the outer <svg... />`}</Box>
						,
						<Box component='span' color='error.main' fontWeight='700'>
							{' '}
							{`otherwise you need to add <svg... />`}
						</Box>
						<Code
							code={`import { SvgIcon, SvgIconProps } from '@mui/material';
				
const EditIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      // Icon size is 24px
      <path
        ... 
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default EditIcon;
`}
						/>
						Advantage is flexible use of svgIcon props in mui5
					</>
				}
			/>

			<EditIcon />

			<Intro
				title='Color'
				content={
					<>
						Add{' '}
						<CoreLabel color='info'>
							color="inherit"(default), "default", "action", "disabled", "primary", "secondary", "error" ...
						</CoreLabel>
					</>
				}
			/>
			<EditIcon />
			<EditIcon color='default' />
			<EditIcon color='action' />
			<EditIcon color='disabled' />
			<EditIcon color='primary' />
			<EditIcon color='secondary' />
			<EditIcon color='error' />
			<EditIcon color='info' />
			<EditIcon color='success' />
			<EditIcon color='warning' />

			<Line />
			<Intro
				title='Size'
				content={
					<>
						Add <CoreLabel color='info'>fontSize="small"(20px), "medium"(default)(24px), "large"(35px) ...</CoreLabel>
					</>
				}
			/>
			<EditIcon fontSize='small' />
			<EditIcon />
			<EditIcon fontSize='large' />

			<Intro
				title='Custom Color and Size'
				content={
					<>
						Add <CoreLabel color='info'>{`sx={{color: '#f24', fontSize: '50px'}}`}</CoreLabel>
					</>
				}
			/>
			<EditIcon sx={{ color: '#f24', fontSize: '50px' }} />

			<Intro
				title='Reference'
				noBackground
				content={
					<ul>
						<li>
							<Link href='https://mui.com/material-ui/icons/#svgicon' rel='noreferrer' target='_blank'>
								https://mui.com/material-ui/icons/#svgicon
							</Link>
						</li>
					</ul>
				}
			/>
		</>
	);
};

export default SvgColor;
