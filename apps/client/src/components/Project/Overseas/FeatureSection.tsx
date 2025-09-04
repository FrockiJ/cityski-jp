'use client';

import React from 'react';
import { Noto_Sans_TC, Poppins } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { VerticalText } from '@/components/Project/Overseas/VerticalText';

const notoSansTC = Noto_Sans_TC({
	weight: ['400'],
	subsets: ['latin'],
});

const poppins = Poppins({
	weight: ['400'],
	subsets: ['latin'],
});

export const FeatureSection = () => {
	const router = useRouter();
	return (
		<div className='max-w-[1440px] mx-auto'>
			<div
				className={`text-center text-[#B38607] text-xl ${poppins.className}`}
				onClick={() => {
					router.push('/overseas/courses');
				}}
			>
				Feature
			</div>
			<div className='mt-5 flex justify-center items-center relative'>
				<Image src='/image/overseas/feature-title.svg' alt='feature title' width='192' height='35' aria-hidden='true' />
				<Image
					src='/image/overseas/styled-divider.svg'
					alt='styled divider'
					width='1200'
					height='60'
					aria-hidden='true'
					className='absolute top-6 max-xs:hidden'
				/>
				<Image
					src='/image/overseas/styled-divider-mobile.svg'
					alt='styled divider mobile'
					width='480'
					height='60'
					aria-hidden='true'
					className='absolute top-10 hidden max-xs:block'
				/>
				{/* Desktop Layout */}
				<div className='absolute top-[120px] left-[80px] max-xs:hidden'>
					<Image
						src='/image/overseas/feature-1.png'
						alt='feature image 1'
						width={416}
						height={277}
						aria-hidden='true'
					/>
				</div>
				<div className='absolute top-[500px] left-[280px] max-xs:hidden'>
					<Image
						src='/image/overseas/feature-2.png'
						alt='feature image 2'
						width={350}
						height={264}
						aria-hidden='true'
					/>
				</div>
				<div className='absolute top-[250px] left-[920px] max-xs:hidden'>
					<Image
						src='/image/overseas/feature-3.png'
						alt='feature image 3'
						width={431}
						height={287}
						aria-hidden='true'
					/>
				</div>
			</div>

			{/* Mobile Layout */}
			<div className='hidden max-xs:flex max-xs:flex-col max-xs:gap-6 max-xs:px-5 max-xs:mt-16'>
				<div className='w-full'>
					<Image
						src='/image/overseas/feature-1.png'
						alt='feature image 1'
						width={416}
						height={277}
						className='w-full h-auto'
						aria-hidden='true'
					/>
				</div>
				<div className='w-full'>
					<Image
						src='/image/overseas/feature-2.png'
						alt='feature image 2'
						width={350}
						height={264}
						className='w-full h-auto'
						aria-hidden='true'
					/>
				</div>
				<div className='w-full'>
					<Image
						src='/image/overseas/feature-3.png'
						alt='feature image 3'
						width={431}
						height={287}
						className='w-full h-auto'
						aria-hidden='true'
					/>
				</div>
			</div>

			<div
				className={`mt-[100px] flex justify-center gap-8 text-[#073064] ${notoSansTC.className} text-[18px] font-normal max-xs:mt-10`}
			>
				<VerticalText text='期待與您在雪場相見！' />
				<VerticalText text='收穫難忘的滑雪體驗。' />
				<VerticalText text='參加CitySki課程，享受熱情款待與高品質教學，' />
				<VerticalText text='學習安全滑雪技巧，快速提升技術。' />
				<VerticalText text='初學者與進階者均可在專業教練指導下' />
				<VerticalText text='於北海道、東北、中部和關東地區舉行。' />
				<VerticalText text='CitySki室內滑雪教室推出日本海外教學課程，' />
			</div>
		</div>
	);
};
