import React from 'react';

import { BlurFade } from '@/components/Effects/BlurFade';

interface ImageGridProps {
	images: { id: string; src: string }[];
}

const ImageGrid = ({ images }: ImageGridProps) => {
	return (
		<div className='flex z-0 flex-col justify-center gap-2 min-w-[240px] w-[480px] h-full max-xs:max-w-full'>
			<div className='flex flex-1 gap-2 w-full'>
				{images.slice(0, 2).map((image, index) => (
					<BlurFade
						key={image.id}
						delay={0.4 + index * 0.2}
						className={`flex overflow-hidden flex-col items-center flex-1 bg-white border border-solid border-black border-opacity-10 
							${index === 1 ? 'rounded-tr-2xl' : ''}`}
					>
						<img
							loading='lazy'
							src={image.src}
							alt={`Grid image ${index + 1}`}
							className='object-cover w-full h-full'
						/>
					</BlurFade>
				))}
			</div>
			<div className='flex flex-1 gap-2 w-full'>
				{images.slice(2, 4).map((image, index) => (
					<BlurFade
						key={image.id}
						delay={0.4 + index * 0.2}
						className={`flex overflow-hidden flex-col items-center flex-1 bg-white border border-solid border-black border-opacity-10 
							${index === 1 ? 'rounded-br-2xl' : ''}`}
					>
						<img
							loading='lazy'
							src={image.src}
							alt={`Grid image ${index + 3}`}
							className='object-cover w-full h-full'
						/>
					</BlurFade>
				))}
			</div>
		</div>
	);
};

export default ImageGrid;
