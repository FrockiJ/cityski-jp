import React from 'react';
import { Noto_Sans_TC, Poppins } from 'next/font/google';
import Image from 'next/image';

const notoSansTC = Noto_Sans_TC({
	weight: ['500'],
	subsets: ['latin'],
});

const poppins = Poppins({
	weight: ['400'],
	subsets: ['latin'],
});

export const SkiResortSection = () => {
	return (
		<div>
			<div className={`mt-[214px] text-center text-[#B38607] text-xl ${poppins.className} max-xs:mt-[100px]`}>
				Japan Ski Resort
			</div>
			<div className='mt-5 flex justify-center items-center relative'>
				<Image src='/image/overseas/resort-title.svg' alt='resort title' width='192' height='35' aria-hidden='true' />
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
			</div>
			<div
				className={`mt-[100px] flex justify-center gap-8 text-[#073064] ${notoSansTC.className} text-[18px] font-normal max-xs:mt-[100px] max-xs:px-5`}
			>
				<div className='flex gap-4 max-xs:flex-col max-xs:items-stretch max-xs:gap-6 max-xs:w-full'>
					<div className='w-[248px] h-[290px] relative overflow-hidden rounded-2xl cursor-pointer max-xs:w-full'>
						<Image
							src='/image/overseas/resort-1.png'
							alt='resort image 1'
							width={248}
							height={290}
							className='rounded-2xl object-cover transition-transform duration-300 hover:scale-110'
							style={{ width: '100%', height: '290px' }}
							aria-hidden='true'
						/>
						<div className={`absolute bottom-5 left-5 text-white text-[20px] font-medium ${notoSansTC.className}`}>
							北海道地區
						</div>
					</div>
					<div className='w-[248px] h-[290px] relative overflow-hidden rounded-2xl cursor-pointer max-xs:w-full'>
						<Image
							src='/image/overseas/resort-2.png'
							alt='resort image 2'
							width={248}
							height={290}
							className='rounded-2xl object-cover transition-transform duration-300 hover:scale-110'
							style={{ width: '100%', height: '290px' }}
							aria-hidden='true'
						/>
						<div className={`absolute bottom-5 left-5 text-white text-[20px] font-medium ${notoSansTC.className}`}>
							東北地區
						</div>
					</div>
					<div className='w-[248px] h-[290px] relative overflow-hidden rounded-2xl cursor-pointer max-xs:w-full'>
						<Image
							src='/image/overseas/resort-3.png'
							alt='resort image 3'
							width={248}
							height={290}
							className='rounded-2xl object-cover transition-transform duration-300 hover:scale-110'
							style={{ width: '100%', height: '290px' }}
							aria-hidden='true'
						/>
						<div className={`absolute bottom-5 left-5 text-white text-[20px] font-medium ${notoSansTC.className}`}>
							中部地區
						</div>
					</div>
					<div className='w-[248px] h-[290px] relative overflow-hidden rounded-2xl cursor-pointer max-xs:w-full'>
						<Image
							src='/image/overseas/resort-4.png'
							alt='resort image 4'
							width={248}
							height={290}
							className='rounded-2xl object-cover transition-transform duration-300 hover:scale-110'
							style={{ width: '100%', height: '290px' }}
							aria-hidden='true'
						/>
						<div className={`absolute bottom-5 left-5 text-white text-[20px] font-medium ${notoSansTC.className}`}>
							關東地區
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
