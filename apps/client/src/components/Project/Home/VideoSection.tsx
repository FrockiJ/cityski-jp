'use client';
import React, { useEffect, useRef, useState } from 'react';
import { GetHomeVideoResponseDTO, ResponseWrapper } from '@repo/shared';
import axios from 'axios';
import { ChevronRight, X } from 'lucide-react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import { FadeIn } from '@/components/Effects/FadeIn';
import NavArrowDownDarkIcon from '@/components/Icon/NavArrowDownDarkIcon';
import NavArrowUpDarkIcon from '@/components/Icon/NavArrowUpDarkIcon';
import NavigationArrowIcon from '@/components/Icon/NavigationArrowIcon';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import YoutubeVideo from '@/components/Youtube';
import useSize from '@/hooks/useSize';

import 'swiper/css/navigation';

import 'swiper/css';

const getYoutubeEmbedCode = (url: string): string => {
	if (!url) return '';

	// Handle YouTube Shorts URL
	if (url.includes('/shorts/')) {
		return url.split('/shorts/')[1].split('?')[0];
	}

	// Handle regular YouTube URL
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);

	return match && match[2].length === 11 ? match[2] : '';
};

export default function VideoSection() {
	const windowSize = useSize();
	const [isOpen, setIsOpen] = useState(false);
	const [video, setVideo] = useState<GetHomeVideoResponseDTO | null>(null);
	const [videos, setVideos] = useState<GetHomeVideoResponseDTO[]>([]);
	const swiperRef = useRef<SwiperRef>(null);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);

	// Minimum swipe distance for navigation (in px)
	const minSwipeDistance = 50;

	useEffect(() => {
		const getVideosData = async () => {
			const response = await axios.get<ResponseWrapper<GetHomeVideoResponseDTO[]>>(
				process.env.NEXT_PUBLIC_BACKEND_URL + '/api/home/videos',
			);

			// Transform the URLs to embed codes
			const processedVideos = response.data.result.map((video) => ({
				...video,
				embedCode: getYoutubeEmbedCode(video.url),
			}));

			setVideos(processedVideos);
		};
		getVideosData();
	}, []);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === 'ArrowUp') {
				const currentIndex = videos.findIndex((v) => v.id === video?.id);
				const nextIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
				setVideo(videos[nextIndex]);
			} else if (e.key === 'ArrowDown') {
				const currentIndex = videos.findIndex((v) => v.id === video?.id);
				const nextIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
				setVideo(videos[nextIndex]);
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [isOpen, video, videos]);

	const handleOpenDialog = (video: GetHomeVideoResponseDTO) => {
		setVideo(video);
		setIsOpen(true);
	};

	const onTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientY);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientY);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isUpSwipe = distance > minSwipeDistance;
		const isDownSwipe = distance < -minSwipeDistance;

		if (isUpSwipe || isDownSwipe) {
			const currentIndex = videos.findIndex((v) => v.id === video?.id);
			let nextIndex;

			if (isUpSwipe) {
				nextIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
			} else {
				nextIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
			}

			setVideo(videos[nextIndex]);
		}

		setTouchStart(null);
		setTouchEnd(null);
	};
	return (
		<FadeIn className='py-[100px] px-[16px]'>
			<div>
				<div className=' text-system-navy text-center'>
					<p>SHORTS</p>
					<p className='text-[26px] xs:text-[40px] leading-[58px] font-bold'>影片專區</p>
				</div>
			</div>
			<div className='relative max-w-[1200px] m-auto mt-[40px]'>
				<Swiper
					ref={swiperRef}
					loop={true}
					slidesPerView='auto'
					watchSlidesProgress={true}
					preventInteractionOnTransition={true}
					breakpoints={{
						480: {
							spaceBetween: 16,
							slidesPerGroup: 5,
						},
						0: {
							spaceBetween: 12,
							slidesPerGroup: 1,
						},
					}}
				>
					{videos.map((video, index) => (
						<SwiperSlide
							key={video.id}
							style={{
								width: windowSize?.[0] <= 480 ? '155px' : '227px',
							}}
						>
							<div className='flex flex-col h-[100%]'>
								<div
									className='relative rounded-xl overflow-hidden flex-1 cursor-pointer'
									onClick={() => handleOpenDialog(video)}
								>
									<div className='absolute top-0 left-0 w-[100%] h-[100%] z-10'></div>
									<YoutubeVideo size='sm' videoId={getYoutubeEmbedCode(video.url)} />
								</div>
								<p className='mt-[8px] text-sm xs:text-basic'>
									{video.name.length > 60 ? video.name.substring(0, video.name.length / 2) + '...' : video.name}
								</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
				{videos.length > 5 && (
					<div className='hidden xs:block'>
						<div
							className='absolute cursor-pointer h-[fit-content] z-10 left-[-34px] top-0 bottom-0 m-auto'
							onClick={() => swiperRef.current?.swiper.slidePrev()}
						>
							<NavigationArrowIcon position='left' />
						</div>
						<div
							className='absolute cursor-pointer h-[fit-content] z-10 right-[-34px] top-0 bottom-0 m-auto'
							onClick={() => swiperRef.current?.swiper.slideNext()}
						>
							<NavigationArrowIcon position='right' />
						</div>
					</div>
				)}
			</div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent
					hideIcon
					className='p-0 w-full max-w-full h-full bg-black border-0 overflow-hidden'
					onTouchStart={windowSize?.[0] <= 480 ? onTouchStart : undefined}
					onTouchMove={windowSize?.[0] <= 480 ? onTouchMove : undefined}
					onTouchEnd={windowSize?.[0] <= 480 ? onTouchEnd : undefined}
				>
					<DialogTitle className='h-[52px] relative'>
						<button
							onClick={() => setIsOpen(false)}
							className='absolute right-4 top-4 text-white hover:opacity-70'
							style={{ border: 'none', outline: 'none' }}
						>
							<X size={24} />
						</button>
					</DialogTitle>
					<div className='h-[calc(100vh-52px)] m-auto'>
						{video && (
							<div>
								<div className={`${windowSize?.[0] <= 480 ? 'w-[calc(100vw)]' : 'w-[460px]'}`}>
									<div className='relative'>
										{windowSize?.[0] > 480 && (
											<div className='absolute right-[-34px] top-1/2 -translate-y-1/2 flex flex-col'>
												<div
													className='cursor-pointer hover:opacity-80 transition-opacity'
													onClick={() => {
														const currentIndex = videos.findIndex((v) => v.id === video?.id);
														const nextIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
														setVideo(videos[nextIndex]);
													}}
												>
													<NavArrowUpDarkIcon />
												</div>
												<div
													className='cursor-pointer hover:opacity-80 transition-opacity'
													onClick={() => {
														const currentIndex = videos.findIndex((v) => v.id === video?.id);
														const nextIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
														setVideo(videos[nextIndex]);
													}}
												>
													<NavArrowDownDarkIcon />
												</div>
											</div>
										)}
										<div className='absolute top-0 left-0 w-[100%] h-[100%] z-10'></div>
										<YoutubeVideo size='lg' videoId={getYoutubeEmbedCode(video.url)} autoPlay loop />
									</div>
								</div>
							</div>
						)}
						<div
							className={`h-40 px-[42px] ${windowSize?.[0] <= 480 ? 'w-[calc(100vw)] flex-col justify-center' : 'w-[460px] flex-col justify-center'}`}
						>
							<div className='flex flex-col w-[376px]'>
								<div className='text-white mt-8'>
									{video?.name?.length > 60 ? video?.name?.substring(0, video?.name?.length / 2) + '...' : video?.name}
								</div>
								<button
									className='bg-white text-black px-4 py-2 rounded-full w-fit text-center mt-3 flex items-center justify-center gap-1'
									onClick={() => setIsOpen(false)}
								>
									<span className='flex items-center'>
										{video?.buttonName}
										<ChevronRight size={16} className='mt-[5px]' />
									</span>
								</button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</FadeIn>
	);
}
