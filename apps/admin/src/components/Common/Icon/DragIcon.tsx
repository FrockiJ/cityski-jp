import { SvgIcon, SvgIconProps } from '@mui/material';

const DragIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props}>
			<circle cx='15' cy='12.0001' r='2' fill='currentColor' fillOpacity='0.8' />
			<circle cx='15' cy='5' r='2' fill='currentColor' fillOpacity='0.8' />
			<ellipse cx='15' cy='18.9999' rx='2' ry='2' fill='currentColor' fillOpacity='0.8' />
			<circle cx='8' cy='5' r='2' fill='currentColor' fillOpacity='0.8' />
			<circle cx='8' cy='12' r='2' fill='currentColor' fillOpacity='0.8' />
			<ellipse cx='8' cy='19' rx='2' ry='2' fill='currentColor' fillOpacity='0.8' />
		</SvgIcon>
	);
};

export default DragIcon;
