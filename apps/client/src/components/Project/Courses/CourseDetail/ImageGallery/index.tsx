'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

// interface GalleryImage {
// 	src: string;
// 	alt: string;
// }

export default function ImageGallery({
	images,
	initialIndex,
	onClose,
}: {
	images: { id: string; src: string }[];
	initialIndex: number;
	onClose: () => void;
}) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	const handlePrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				handlePrevious();
			} else if (event.key === 'ArrowRight') {
				handleNext();
			} else if (event.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<div className='fixed inset-0 bg-black z-50 flex items-center justify-center'>
			<div className='relative w-full mx-auto px-6'>
				{/* Close button */}
				<div className='fixed top-4 right-4 z-10'>
					<Button
						variant='ghost'
						size='icon'
						className='text-white hover:text-white hover:bg-white/10'
						onClick={onClose}
					>
						<X className='h-6 w-6' />
						<span className='sr-only'>Close gallery</span>
					</Button>
				</div>

				{/* Main image container with counter and navigation */}
				<div className='relative max-w-[1080px] mx-auto'>
					{/* Image counter */}
					<div className='absolute left-1/2 -translate-x-1/2 -top-[62px] bg-white/40 px-3 py-1 rounded-[24px] text-white text-sm'>
						{currentIndex + 1}/{images.length}
					</div>

					<div className='relative aspect-[16/9] w-full'>
						<Image
							src={images[currentIndex].src}
							alt={images[currentIndex].src}
							fill
							className='object-cover rounded-lg'
							priority
						/>
					</div>

					<Button
						variant='ghost'
						size='icon'
						className='absolute left-[-48px] top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10'
						onClick={handlePrevious}
					>
						<ChevronLeft className='h-8 w-8' />
						<span className='sr-only'>Previous image</span>
					</Button>

					<Button
						variant='ghost'
						size='icon'
						className='absolute right-[-48px] top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10'
						onClick={handleNext}
					>
						<ChevronRight className='h-8 w-8' />
						<span className='sr-only'>Next image</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
