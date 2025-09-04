import { SvgIcon, SvgIconProps } from '@mui/material';

interface ArrowIconProps extends SvgIconProps {
	direction?: 'down' | 'up' | 'left' | 'right';
}

const ArrowIcon = ({ direction = 'down', ...props }: ArrowIconProps) => {
	return (
		<SvgIcon
			{...props}
			style={{
				transition: '200ms',
				transform:
					direction === 'up'
						? 'rotate(180deg)'
						: direction === 'left'
							? 'rotate(90deg)'
							: direction === 'right'
								? 'rotate(270deg)'
								: 'rotate(0deg)',
			}}
		>
			<path
				d='M20 12.0099L18.59 10.5999L13 16.1799V4.00989H11V16.1799L5.42 10.5899L4 12.0099L12 20.0099L20 12.0099Z'
				fill='currentColor'
			/>
		</SvgIcon>
	);
};

export default ArrowIcon;
