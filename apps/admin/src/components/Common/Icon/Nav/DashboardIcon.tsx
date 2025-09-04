import { SvgIcon, SvgIconProps } from '@mui/material';

const DashboardIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props}>
			<path
				d='M7.8 20H3.2C2.53726 20 2 19.4627 2 18.8V14.2C2 13.5373 2.53726 13 3.2 13H7.8C8.46274 13 9 13.5373 9 14.2V18.8C9 19.4627 8.46274 20 7.8 20Z'
				fill='currentColor'
			/>
			<path
				d='M20.8 20H12.2C11.5373 20 11 19.4627 11 18.8V14.2C11 13.5373 11.5373 13 12.2 13H20.8C21.4627 13 22 13.5373 22 14.2V18.8C22 19.4627 21.4627 20 20.8 20Z'
				fill='currentColor'
			/>
			<path
				opacity='0.48'
				d='M20.8 11H3.2C2.53726 11 2 10.4627 2 9.8V5.2C2 4.53726 2.53726 4 3.2 4H20.8C21.4627 4 22 4.53726 22 5.2V9.8C22 10.4627 21.4627 11 20.8 11Z'
				fill='currentColor'
			/>
		</SvgIcon>
	);
};

export default DashboardIcon;
