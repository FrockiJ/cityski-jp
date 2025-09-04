import { SvgIcon, SvgIconProps } from '@mui/material';

interface ChevronIconProps extends SvgIconProps {
	direction?: 'down' | 'up' | 'left' | 'right';
}

const ChevronIcon = ({ direction = 'down', ...props }: ChevronIconProps) => {
	return (
		<SvgIcon
			{...props}
			style={{
				transition: '300ms',
				transform:
					direction === 'up'
						? 'rotate(-180deg)'
						: direction === 'left'
							? 'rotate(90deg)'
							: direction === 'right'
								? 'rotate(-90deg)'
								: 'rotate(0deg)',
			}}
		>
			<path
				d='M12.0003 15.5112C11.7666 15.5116 11.5402 15.4302 11.3603 15.2812L5.3603 10.2812C4.93504 9.9277 4.87684 9.29642 5.2303 8.87116C5.58376 8.4459 6.21504 8.3877 6.6403 8.74116L12.0003 13.2212L17.3603 8.90116C17.5669 8.73339 17.8318 8.65489 18.0965 8.68305C18.3611 8.7112 18.6036 8.84368 18.7703 9.05116C18.9554 9.25902 19.0456 9.53464 19.019 9.81172C18.9924 10.0888 18.8516 10.3423 18.6303 10.5112L12.6303 15.3412C12.4452 15.4667 12.2234 15.5265 12.0003 15.5112Z'
				fill='currentColor'
			/>
		</SvgIcon>
	);
};

export default ChevronIcon;
