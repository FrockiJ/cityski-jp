'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { BlurFade } from '@/components/Effects/BlurFade';

interface FloatingMarkerProps {
	top: number | string;
	left: number | string;
	delay?: number;
	imageWidth?: number;
	imageHeight?: number;
	imageSrc?: string;
	startUp?: boolean;
}

export const FloatingMarker = ({
	top,
	left,
	delay = 0.3,
	imageWidth = 32,
	imageHeight = 42,
	imageSrc = '/image/overseas/location-marker.svg',
	startUp = true,
}: FloatingMarkerProps) => {
	const topValue = typeof top === 'number' ? `${top}px` : top;
	const leftValue = typeof left === 'number' ? `${left}px` : left;

	return (
		<BlurFade className='absolute z-10 !h-auto' style={{ top: topValue, left: leftValue }} delay={delay}>
			<motion.div
				initial={{ y: startUp ? 0 : -8 }}
				animate={{
					y: startUp ? [0, -8, 0] : [-8, 0, -8],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			>
				<Image src={imageSrc} alt='location marker' width={imageWidth} height={imageHeight} aria-hidden='true' />
			</motion.div>
		</BlurFade>
	);
};
