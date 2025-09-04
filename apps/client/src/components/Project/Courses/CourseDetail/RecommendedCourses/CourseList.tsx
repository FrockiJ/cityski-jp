import { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import { FadeIn } from '@/components/Effects/FadeIn';
import NavigationArrowIcon from '@/components/Icon/NavigationArrowIcon';

import CourseCard from './CourseCard';

interface CourseListProps {
	courses: Array<{
		id: string;
		imageUrl: string;
		title: string;
		price: number;
		showPriceLabel?: boolean;
	}>;
}

function CourseList({ courses }: CourseListProps) {
	const swiperRef = useRef<SwiperRef>(null);

	return (
		<div className='relative w-full mt-5'>
			<FadeIn>
				<Swiper
					slidesPerView='auto'
					ref={swiperRef}
					spaceBetween={14}
					watchSlidesProgress={true}
					preventInteractionOnTransition={true}
					loop={true}
				>
					{courses?.map((course, index) => (
						<SwiperSlide
							key={index}
							style={{
								width: '290px',
							}}
						>
							<Link href={`/courses/course-detail?id=${course.id}`}>
								<CourseCard key={`${course.title}-${index}`} {...course} />
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
				{courses?.length > 4 && (
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
			</FadeIn>
		</div>
	);
}

export default CourseList;
