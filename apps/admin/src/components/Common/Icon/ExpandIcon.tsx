import { SvgIcon, SvgIconProps } from '@mui/material';

const ExpandIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props}>
			<path
				d='M15.8805 9.29995L12.0005 13.1799L8.12047 9.29995C7.73047 8.90995 7.10047 8.90995 6.71047 9.29995C6.32047 9.68995 6.32047 10.3199 6.71047 10.7099L11.3005 15.2999C11.6905 15.6899 12.3205 15.6899 12.7105 15.2999L17.3005 10.7099C17.6905 10.3199 17.6905 9.68995 17.3005 9.29995C16.9105 8.91995 16.2705 8.90995 15.8805 9.29995Z'
				fill='currentColor'
			/>
		</SvgIcon>
	);
};

export default ExpandIcon;
