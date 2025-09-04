import { SvgIcon, SvgIconProps } from '@mui/material';

const CheckboxIndeterminateIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props}>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M7 2C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H7ZM9 13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H9C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13Z'
				fill='currentColor'
			/>
		</SvgIcon>
	);
};

export default CheckboxIndeterminateIcon;
