'use client';

export default function NavigationArrowIcon({ position }: { position: 'left' | 'right' }) {
	return (
		<svg
			className={`${position === 'left' ? 'rotate-180' : 'rotate-0'}`}
			width='64'
			height='61'
			viewBox='0 0 64 61'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g filter='url(#filter0_dd_5146_358)'>
				<path
					d='M38.5349 8.67993H25.4649C23.3249 8.67993 21.3449 9.81993 20.2649 11.6799L13.7249 22.9999C12.6549 24.8599 12.6549 27.1399 13.7249 28.9999L20.2649 40.3199C21.3349 42.1799 23.3149 43.3199 25.4649 43.3199H38.5349C40.6749 43.3199 42.6549 42.1799 43.7349 40.3199L50.2749 28.9999C51.3449 27.1399 51.3449 24.8599 50.2749 22.9999L43.7349 11.6799C42.6649 9.81993 40.6849 8.67993 38.5349 8.67993Z'
					fill='white'
				/>
			</g>
			<path
				d='M30.3989 31.8706L35.736 26.5336L30.3989 21.1965'
				stroke='#2B2B2B'
				strokeWidth='1.60111'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<defs>
				<filter
					id='filter0_dd_5146_358'
					x='0.113447'
					y='0.140654'
					width='63.7726'
					height='60.2577'
					filterUnits='userSpaceOnUse'
					colorInterpolationFilters='sRGB'
				>
					<feFlood floodOpacity='0' result='BackgroundImageFix' />
					<feColorMatrix
						in='SourceAlpha'
						type='matrix'
						values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
						result='hardAlpha'
					/>
					<feOffset dy='4.26964' />
					<feGaussianBlur stdDeviation='6.40446' />
					<feComposite in2='hardAlpha' operator='out' />
					<feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0' />
					<feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_5146_358' />
					<feColorMatrix
						in='SourceAlpha'
						type='matrix'
						values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
						result='hardAlpha'
					/>
					<feOffset dy='-1.06741' />
					<feGaussianBlur stdDeviation='2.13482' />
					<feComposite in2='hardAlpha' operator='out' />
					<feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0' />
					<feBlend mode='normal' in2='effect1_dropShadow_5146_358' result='effect2_dropShadow_5146_358' />
					<feBlend mode='normal' in='SourceGraphic' in2='effect2_dropShadow_5146_358' result='shape' />
				</filter>
			</defs>
		</svg>
	);
}
