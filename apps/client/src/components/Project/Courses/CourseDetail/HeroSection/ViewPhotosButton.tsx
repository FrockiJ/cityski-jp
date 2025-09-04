import React, { useState } from 'react';

import ImageGallery from '../ImageGallery';

const ViewPhotosButton = ({ images }: { images: { id: string; src: string }[] }) => {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleClick = (index: number) => {
		setSelectedIndex(index);
		setIsGalleryOpen(true);
	};

	const handleCloseGallery = () => {
		setIsGalleryOpen(false);
	};

	return (
		<div className='absolute right-6 bottom-6'>
			<button
				className='overflow-hidden gap-2.5 self-start px-5 py-2 text-sm leading-6 text-center whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-800 text-zinc-800'
				onClick={() => handleClick(0)}
				aria-label='View photos'
			>
				查看照片
			</button>
			{isGalleryOpen && <ImageGallery images={images} initialIndex={selectedIndex} onClose={handleCloseGallery} />}
		</div>
	);
};

export default ViewPhotosButton;
