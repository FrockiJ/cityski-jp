'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import BoxReveal from '@/components/Effects/BoxReveal';
import ForwardRightIcon from '@/components/Icon/ForwardRightIcon';
import useSize from '@/hooks/useSize';

const CLASS_DATA = [
	{ title: '團體班', price: 1600, url: '/' },
	{ title: '私人班', price: 3000, url: '/' },
];
export default function BannerSection() {
	const windowSize = useSize();
	const [videoUrl, setVideoUrl] = useState(null);

	useEffect(() => {
		setVideoUrl(
			windowSize?.[0] <= 480
				? 'https://res.cloudinary.com/dfkw9hdq3/video/upload/q_auto:best/cityski/cityski_landing_mobile_h265_tg4lpw.mp4'
				: 'https://res.cloudinary.com/dfkw9hdq3/video/upload/q_auto:best/cityski/cityski_landing_desktop_h265_xf2gko.mp4',
		);
	}, [windowSize]);
	return (
		<div className='relative h-screen overflow-hidden'>
			<div className='absolute h-screen w-screen overflow-hidden'>
				<video key={videoUrl} preload='auto' autoPlay muted loop playsInline className='h-full w-full object-cover'>
					<source src={videoUrl} type='video/mp4' />
					您的瀏覽器不支援影片播放。
				</video>
			</div>
			<div className='container relative z-10'>
				<div className='flex flex-col item-end h-screen gap-0 xs:gap-10'>
					<div className='flex-auto max-w-xl text-white flex flex-col justify-center items-center xs:justify-end xs:items-start text-center xs:text-left mt-12'>
						<div className='font-poppins font-bold text-5xl xs:text-[76px] xs:leading-[68px] uppercase '>
							<BoxReveal boxColor={'#ECFFFD'} duration={0.5}>
								<>
									<span className='text-transparent text-stroke max-xs:hidden'>Discover the</span>
									<span className='text-transparent text-stroke text-6xl xs:hidden max-[375px]:text-5xl'>Discover</span>
								</>
							</BoxReveal>
							<BoxReveal boxColor={'#D0ECEB'} duration={0.5}>
								<>
									<span className='text-transparent text-stroke text-6xl xs:hidden max-[375px]:text-5xl'>the </span>
									<span className='max-xs:text-6xl max-[375px]:text-5xl'>Thrill</span>
								</>
							</BoxReveal>
						</div>
						<BoxReveal boxColor={'#D0ECEB'} duration={0.5}>
							<div className='mt-4 text-xl xs:text-2xl max-xs:text-2xl max-[375px]:text-xl'>
								台中最好玩的室內滑雪學校
							</div>
						</BoxReveal>
					</div>
					<div className='flex-initial flex mb-14 xs:mb-20 justify-center xs:justify-start'>
						{/* <div className='bg-neutral-80 xs:bg-white px-6 py-3 xs:p-6 rounded-xl flex items-center text-neutral-20 xs:text-system-navy font-medium'> */}
						<div className='relative'>
							<svg
								className='text-neutral-80 xs:text-system-white'
								width='100%'
								height='76'
								viewBox='0 0 560 76'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								xmlnsXlink='http://www.w3.org/1999/xlink'
							>
								<path
									d='M0 30.5723C-3.74868e-07 26.3335 1.63956 22.2683 4.55802 19.2709L18.7813 4.68119C21.6997 1.68388 25.658 -8.19422e-08 29.7853 0L544.438 5.72205e-06C553.032 5.89268e-06 560 7.15566 560 15.9826V45.4277C560 49.6665 558.36 53.7317 555.442 56.729L541.218 71.3188C538.3 74.3161 534.342 76 530.214 76H15.5621C6.96741 76 2.84372e-05 68.8443 2.76566e-05 60.0174L0 30.5723Z'
									fill='currentColor'
								/>
							</svg>

							<div className='flex z-1 size-full absolute bottom-0 top-0 z-0 items-center justify-center font-medium text-neutral-20 xs:text-system-navy'>
								{CLASS_DATA.map((item, index) => (
									<React.Fragment key={item.title}>
										<div className='flex items-center gap-1 xs:gap-2 text-sm xs:text-xl whitespace-nowrap'>
											{item.title}
											<span className='text-xl xs:text-[32px] font-semibold text-white xs:text-system-navy xs:text-stroke xs:text-shadow tracking-tighter'>
												{item.price.toLocaleString()}
											</span>
											元起
											<Link href={item.url} className='hidden xs:block'>
												<ForwardRightIcon />
											</Link>
										</div>
										{index + 1 < CLASS_DATA.length && (
											<div className='xs:bg-neutral-5 w-px h-4 xs:h-[28px] bg-gray-200 mx-5 xs:mx-[26px]' />
										)}
									</React.Fragment>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
