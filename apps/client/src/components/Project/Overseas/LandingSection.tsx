import React from 'react';
import Image from 'next/image';

import { BlurFade } from '@/components/Effects/BlurFade';
import { FloatingMarker } from '@/components/Project/Overseas/FloatingMarker';

export const LandingSection = () => {
	return (
		<div className='relative h-[80vh]'>
			{/* Japan Map Container - web view */}
			<div className='absolute left-1/2 top-[120px] -translate-x-1/2 w-full max-w-[800px] min-h-[558px] aspect-[1440/820] max-xs:hidden'>
				<div className='relative w-full h-full'>
					<BlurFade className='absolute left-[-190px] !h-auto' delay={1.3}>
						<Image
							src='/image/overseas/overseas-title.svg'
							alt='overseas title'
							priority
							width='602'
							height='178'
							aria-hidden='true'
						/>
					</BlurFade>
					<BlurFade className='absolute top-[91px] left-[477px] z-10 !h-auto cursor-pointer' delay={0.3}>
						<Image src='/image/overseas/location-1.svg' alt='location 1' width='150' height='38' aria-hidden='true' />
					</BlurFade>
					<FloatingMarker top={88} left={632} delay={0.3} startUp={true} />
					<BlurFade className='absolute top-[224px] left-[424px] z-10 !h-auto cursor-pointer' delay={0.5}>
						<Image src='/image/overseas/location-2.svg' alt='location 2' width='122' height='38' aria-hidden='true' />
					</BlurFade>
					<FloatingMarker top={233} left={550} delay={0.5} startUp={false} />
					<BlurFade className='absolute top-[325px] left-[334px] z-10 !h-auto cursor-pointer' delay={0.7}>
						<Image src='/image/overseas/location-3.svg' alt='location 3' width='122' height='38' aria-hidden='true' />
					</BlurFade>
					<FloatingMarker top={328} left={462} delay={0.7} startUp={true} />
					<BlurFade className='absolute top-[412px] left-[515px] z-10 !h-auto cursor-pointer' delay={0.9}>
						<Image src='/image/overseas/location-4.svg' alt='location 4' width='122' height='38' aria-hidden='true' />
					</BlurFade>
					<FloatingMarker top={415} left={475} delay={0.9} startUp={false} />
					<Image
						src='/image/overseas/japan-map.svg'
						alt='Japan Map'
						fill
						priority
						aria-hidden='true'
						className='pointer-events-none'
					/>
				</div>
			</div>
			{/* Japan Map Container - mobile view */}
			<div className='hidden max-xs:block'>
				<div className='flex justify-center mt-[68px]'>
					<BlurFade className='!h-auto w-full' delay={1.3}>
						<Image
							src='/image/overseas/overseas-title.svg'
							alt='overseas title'
							priority
							width='480'
							height='200'
							className='w-full h-auto max-w-[480px]'
							aria-hidden='true'
						/>
					</BlurFade>
				</div>
				<div className='flex justify-center'>
					<div className='relative mt-12 w-full max-w-[480px]'>
						<div className='relative w-full aspect-[480/500]'>
							<Image
								src='/image/overseas/japan-map-mobile.svg'
								alt='Japan Map'
								fill
								priority
								aria-hidden='true'
								className='object-contain'
							/>
							<BlurFade className='absolute top-[11%] left-[45%] z-10 !h-auto w-[26%]' delay={0.3}>
								<Image
									src='/image/overseas/location-1.svg'
									alt='location 1'
									width='126'
									height='30'
									className='w-full h-auto'
									aria-hidden='true'
								/>
							</BlurFade>
							<FloatingMarker top='9%' left='72%' delay={0.3} startUp={true} />
							<BlurFade className='absolute top-[34%] left-[45%] z-10 !h-auto w-[22%]' delay={0.5}>
								<Image
									src='/image/overseas/location-2.svg'
									alt='location 2'
									width='102'
									height='30'
									className='w-full h-auto'
									aria-hidden='true'
								/>
							</BlurFade>
							<FloatingMarker top='33%' left='68%' delay={0.5} startUp={false} />
							<BlurFade className='absolute top-[51%] left-[34%] z-10 !h-auto w-[22%]' delay={0.7}>
								<Image
									src='/image/overseas/location-3.svg'
									alt='location 3'
									width='102'
									height='30'
									className='w-full h-auto'
									aria-hidden='true'
								/>
							</BlurFade>
							<FloatingMarker top='51%' left='57%' delay={0.7} startUp={true} />
							<BlurFade className='absolute top-[61%] left-[70%] z-10 !h-auto w-[22%]' delay={0.9}>
								<Image
									src='/image/overseas/location-4.svg'
									alt='location 4'
									width='102'
									height='30'
									className='w-full h-auto'
									aria-hidden='true'
								/>
							</BlurFade>
							<FloatingMarker top='60%' left='63%' delay={0.9} startUp={false} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
