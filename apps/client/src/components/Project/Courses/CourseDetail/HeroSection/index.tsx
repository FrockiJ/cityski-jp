'use client';

import React from 'react';

import { BlurFade } from '@/components/Effects/BlurFade';

import ImageGrid from './ImageGrid';
import ViewPhotosButton from './ViewPhotosButton';

interface HeroSectionProps {
	images: { id: string; src: string }[];
}

const HeroSection = ({ images }: HeroSectionProps) => {
	return (
		<section className='flex overflow-hidden relative gap-2 h-[480px]' aria-label='Hero Section with Photo Gallery'>
			<BlurFade
				delay={0.2}
				className='flex overflow-hidden z-0 flex-col flex-1 shrink bg-white rounded-l-2xl border border-solid basis-10 border-black border-opacity-10 min-w-[240px] max-xs:max-w-full'
			>
				<img loading='lazy' src={images[1]?.src} alt='Main hero image' className='object-cover w-full h-full' />
			</BlurFade>
			<ImageGrid images={images.slice(2, 6)} />
			<ViewPhotosButton images={[...images]} />
		</section>
	);
};

export default HeroSection;
