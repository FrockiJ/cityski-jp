import { SvgIcon, SvgIconProps } from '@mui/material';

const InventoryIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props}>
			<path
				d='M9 2C7.89543 2 7 2.89543 7 4V5H4C2.89543 5 2 5.89543 2 7V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V7C22 5.89543 21.1046 5 20 5H17V4C17 2.89543 16.1046 2 15 2H9ZM15 5H9V4H15V5ZM4 7H20V20H4V7Z'
				fill='currentColor'
			/>
			<path
				d='M6 10H18V12H6V10Z'
				fill='currentColor'
				opacity='0.48'
			/>
			<path
				d='M6 14H18V16H6V14Z'
				fill='currentColor'
				opacity='0.48'
			/>
		</SvgIcon>
	);
};

export default InventoryIcon;
