'use client';

export default function VideoPlayIcon() {
	return (
		<svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<rect width='28' height='28' rx='14' fill='url(#paint0_linear_5163_1361)' fillOpacity='0.7' />
			<g filter='url(#filter0_d_5163_1361)'>
				<path
					d='M11 17.2723V10.7277C11 9.95889 11.8315 9.47765 12.4981 9.86062L18.1943 13.1329C18.8635 13.5173 18.8635 14.4827 18.1943 14.8671L12.4981 18.1394C11.8315 18.5224 11 18.0411 11 17.2723Z'
					stroke='white'
					strokeWidth='1.5'
					shapeRendering='crispEdges'
				/>
			</g>
			<defs>
				<filter
					id='filter0_d_5163_1361'
					x='8.25'
					y='7.9751'
					width='13.1963'
					height='14.0498'
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
					<feOffset dy='1' />
					<feGaussianBlur stdDeviation='1' />
					<feComposite in2='hardAlpha' operator='out' />
					<feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0' />
					<feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_5163_1361' />
					<feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_5163_1361' result='shape' />
				</filter>
				<linearGradient id='paint0_linear_5163_1361' x1='14' y1='0' x2='14' y2='28' gradientUnits='userSpaceOnUse'>
					<stop stopColor='white' />
					<stop offset='1' stopColor='#AAAAAA' />
				</linearGradient>
			</defs>
		</svg>
	);
}
