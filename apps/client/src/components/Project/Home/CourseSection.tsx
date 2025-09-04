'use client';
import React, { useEffect, useRef, useState } from 'react';
import { GetClientCoursesResponseDTO, GetDepartmentsResponseDTO, ResponseWrapper } from '@repo/shared';
import Image from 'next/image';
import Link from 'next/link';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import { FadeIn } from '@/components/Effects/FadeIn';
import ArrowIcon from '@/components/Icon/ArrowIcon';
import CoachIcon from '@/components/Icon/CoachIcon';
import OverSeasIcon from '@/components/Icon/OverSeasIcon';
import ScheduleIcon from '@/components/Icon/ScheduleIcon';
import SnowIcon from '@/components/Icon/SnowIcon';
import SnowManIcon from '@/components/Icon/SnowManIcon';
import axios from '@/lib/api';

import './home.css';
import 'swiper/css';
const data = [
	{ icon: <SnowManIcon />, title: '小班制教學', desc: '最多4位學員，親子可共學' },
	{ icon: <ScheduleIcon />, title: '彈性排課', desc: '按照個人進度與板類排課' },
	{ icon: <OverSeasIcon />, title: '海外課程', desc: '日本滑雪體驗營' },
	{ icon: <CoachIcon />, title: '國際認證教練', desc: '專業教練教學' },
];

const courseData = [
	{ courseName: '私人班', img: '/image/home/field-banner.webp' },
	{ courseName: '團體班', img: '/image/home/field-banner.webp' },
	{ courseName: '個人練習', img: '/image/home/field-banner.webp' },
	{ courseName: '個人練習2', img: '/image/home/field-banner.webp' },
	{ courseName: '個人練習3', img: '/image/home/field-banner.webp' },
];

export default function CourseSection() {
	const swiperRef = useRef<SwiperRef>(null);
	const sectionRef = useRef<HTMLDivElement>(null);

	const [departments, setDepartments] = useState<GetDepartmentsResponseDTO[]>();
	const [courses, setCourses] = useState<GetClientCoursesResponseDTO[]>();

	const handleNavigateCourseDetail = () => {};
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				window.dispatchEvent(
					new CustomEvent('courseSectionIntersect', {
						detail: {
							isIntersecting: entry.isIntersecting,
							boundingClientRect: entry.boundingClientRect,
						},
					}),
				);
			},
			{
				threshold: 0.1,
				rootMargin: '-300px 0px 0px 0px',
			},
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const getCourses = async (id: string) => {
			const response = await axios.get<ResponseWrapper<GetClientCoursesResponseDTO[]>>(`/api/courses/${id}/client`);
			if (response.status === 200 && response.data?.result) {
				setCourses(response.data.result);
			}
		};

		const getDepartments = async () => {
			const response = await axios.get<ResponseWrapper<GetDepartmentsResponseDTO[]>>('/api/departments/client');
			if (response.status === 200 && response.data?.result) {
				setDepartments(response.data.result);
				getCourses(response.data.result[0].id);
			}
		};
		getDepartments();
	}, []);
	return (
		<div>
			<div className={`relative overflow-hidden h-[477px] xs:h-[1000px] custom-after`}>
				<Image
					src='/image/home/field-banner.webp'
					alt='footer-bg'
					width={1920}
					height={1000}
					className='hidden xs:block xs:min-w-[1920px] xs:h-[auto] absolute top-0 left-1/2 transform -translate-x-1/2'
				/>
				<Image
					src='/image/home/field-banner-mobile.webp'
					alt='教學場地'
					width={1920}
					height={380}
					className='xs:hidden min-w-[480px] xs:h-[auto] absolute bottom-0 left-1/2 transform -translate-x-1/2'
				/>
				<Image
					src='/image/home/field-banner-mask.webp'
					alt='mask'
					width={1920}
					height={380}
					className='min-w-[960px] xs:min-w-[1920px] xs:h-[auto] absolute bottom-0 left-1/2 transform -translate-x-1/2'
				/>
			</div>
			<div ref={sectionRef} className='pt-[80px] xs:pb-[140px]'>
				<FadeIn>
					<div className=' flex items-center flex-col'>
						<h2 className='w-[275px] xs:w-[auto] text-[40px] xs:text-[48px] text-system-navy text-center font-bold'>
							台中最好玩的室內滑雪學校
						</h2>
						<p className='w-[275px] xs:w-[auto] text-system-navy text-base xs:text-lg text-center font-normal xs:font-medium'>
							在城市裡就能學會滑雪，邊玩邊學習，用最簡單的方式學會滑雪!
						</p>
					</div>
				</FadeIn>

				<FadeIn className='flex gap-6 xs:gap-10 justify-center flex-wrap mt-[40px] xs:mt-[84px]'>
					{data.map((item, index) => (
						<div key={index} className='w-[150px] xs:w-[200px] flex items-center flex-col'>
							{item.icon}
							<p className='text-neutral-80 font-medium text-center'>{item.title}</p>
							<p className='w-[100px] xs:w-[auto] text-sm text-neutral-40 text-center'>{item.desc}</p>
						</div>
					))}
				</FadeIn>
			</div>
			<div className='relative pt-[100px] xs:pb-[200px]'>
				<div className='hidden xs:block absolute left-0 right-0 m-auto w-[1200px] h-[480px]'>
					<div className='absolute z-10 left-[225px] top-[-47px]'>
						<SnowIcon width='100' height='106' />
					</div>
					<div className='absolute left-[-15px] bottom-[-72px]'>
						<SnowIcon width='152' height='159' />
					</div>
					<div className='absolute right-[10px] top-[-90px]'>
						<SnowIcon width='140' height='146' />
					</div>
					<div className='absolute right-[250px] bottom-[-140px]'>
						<SnowIcon />
					</div>
				</div>
				{/* desktop */}
				<FadeIn className='hidden xs:ml-[52px] xs:block'>
					<Swiper ref={swiperRef} freeMode={true} spaceBetween={52} slidesPerView='auto' modules={[FreeMode]}>
						{courses?.map((course, index) => (
							<SwiperSlide key={index} style={{ width: '360px', height: '480px', display: 'flex' }}>
								<div
									key={index}
									className={`home-svg-container w-[360px] relative h-[400px] ${index % 2 === 1 ? 'self-end' : ''}`}
								>
									<Link href={`/courses/course-detail?id=${course.id}`}>
										<svg
											width='360'
											height='400'
											viewBox='0 0 360 400'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
											xmlnsXlink='http://www.w3.org/1999/xlink'
										>
											<defs>
												<linearGradient id='bgGradient' x1='0' y1='0' x2='1' y2='1' gradientTransform='rotate(-45)'>
													<stop offset='0%' style={{ stopColor: '#FE696C' }} />
													<stop offset='100%' style={{ stopColor: '#FD8E4B' }} />
												</linearGradient>
											</defs>
											<defs>
												<clipPath id={`roundedPolygon${index}`}>
													<path d='M0 70.6274C-3.85417e-07 66.3839 1.6857 62.3143 4.68629 59.3137L59.3137 4.68629C62.3143 1.68571 66.384 -8.20314e-08 70.6274 0L344 5.28463e-06C352.837 5.45545e-06 360 7.16345 360 16V329.373C360 333.616 358.314 337.686 355.314 340.686L300.686 395.314C297.686 398.314 293.616 400 289.373 400H16C7.16348 400 2.9265e-05 392.837 2.84624e-05 384L0 70.6274Z' />
												</clipPath>
											</defs>
											<rect
												width='360'
												height='400'
												fill='url(#bgGradient)'
												clipPath={`url(#roundedPolygon${index})`}
											/>
											<image
												className='home-svg-image object-cover'
												clipPath={`url(#roundedPolygon${index})`}
												href={process.env.NEXT_PUBLIC_AWS_S3_URL + course.image}
												width={360}
												height={400}
											/>
										</svg>

										<div className='home-tag absolute cursor-pointer z-10 bottom-[16px] left-[16px] text-sm font-medium py-[6px] px-[16px] inline-block text-system-white rounded-3xl bg-gradient-to-r from-[#FE696C] to-[#FD8E4B]'>
											{course.name}
										</div>
										<div className='home-hover-tag w-[fit-content] h-[fit-content] absolute top-0 bottom-0 right-0 left-0 m-auto  text-system-white'>
											<p className='text-[32px] font-medium'>{course.name}</p>
											<p className='text-sm font-medium flex items-center justify-center'>
												查看課程
												<ArrowIcon />
											</p>
										</div>
									</Link>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</FadeIn>

				{/* mobile */}
				<div className='custom-course-wrapper px-[20px] flex flex-col items-center xs:hidden'>
					{courses?.map((course, index) => (
						<div key={index} className='custom-course-item relative w-[100%] h-[100%]'>
							<Link href={`/courses/course-detail?id=${course.id}`}>
								<svg
									width='100%'
									height='100%'
									viewBox='0 0 335 280'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									xmlnsXlink='http://www.w3.org/1999/xlink'
								>
									<defs>
										<clipPath id={`mobileRoundedPolygon${index}`}>
											<path d='M0 40.6274C-3.85417e-07 36.3839 1.6857 32.3143 4.68629 29.3137L29.3137 4.68629C32.3143 1.68571 36.384 -8.20314e-08 40.6274 0L319 5.28463e-06C327.837 5.45545e-06 335 7.16345 335 16V239.373C335 243.616 333.314 247.686 330.314 250.686L305.686 275.314C302.686 278.314 298.616 280 294.373 280H16C7.16348 280 2.9265e-05 272.837 2.84624e-05 264L0 40.6274Z' />
										</clipPath>
									</defs>
									<image
										clipPath={`url(#mobileRoundedPolygon${index})`}
										href={process.env.NEXT_PUBLIC_AWS_S3_URL + course.image}
										width={360}
										height={400}
									/>
								</svg>

								<div className='absolute z-10 bottom-[16px] left-[16px] text-sm font-medium py-[6px] px-[16px] inline-block text-system-white rounded-3xl bg-gradient-to-r from-[#FE696C] to-[#FD8E4B]'>
									{course.name}
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
