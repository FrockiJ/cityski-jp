'use client';

import React, { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/pagination';

import 'swiper/css';

interface MobileHeroSectionProps {
	images: { id: string; src: string }[];
}

const MobileHeroSection = ({ images }: MobileHeroSectionProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleSlideChange = (swiper: SwiperType) => {
		setCurrentIndex(swiper.realIndex);
	};

	return (
		<div className='w-full h-[240px] relative'>
			<Swiper
				modules={[Pagination]}
				spaceBetween={0}
				slidesPerView={1}
				loop={true}
				onSlideChange={handleSlideChange}
				className='w-full h-full'
			>
				{images.map((image, index) => (
					<SwiperSlide key={image.id}>
						<img src={image.src} alt={`Slide ${index + 1}`} className='w-full h-full object-cover' />
					</SwiperSlide>
				))}
			</Swiper>

			{/* Custom image counter */}
			<div className='absolute bottom-3 right-3 px-3 py-1 rounded-[99px] bg-[#2B2B2B] text-white text-sm z-10'>
				{currentIndex + 1}/{images.length}
			</div>
		</div>
	);
};

export default MobileHeroSection;
