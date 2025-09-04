import { useEffect, useRef, useState } from 'react';
import { GetClientCoursesResponseDTO, ResponseWrapper } from '@repo/shared';

import axios from '@/lib/api';

import CourseList from './CourseList';
const coursesData = [
	{
		imageUrl:
			'https://cdn.builder.io/api/v1/image/assets/TEMP/a6ca5b4daa7cb38fd5b88ae59bf95ccc6d155127ac136d5c0de1cf988b896f8d?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '滑雪教練培訓班1',
		price: 37500,
		showPriceLabel: true,
	},
	{
		imageUrl:
			'https://cdn.builder.io/api/v1/image/assets/TEMP/a6ca5b4daa7cb38fd5b88ae59bf95ccc6d155127ac136d5c0de1cf988b896f8d?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '滑雪教練培訓班2',
		price: 1600,
		showPriceLabel: true,
	},
	{
		imageUrl:
			'https://cdn.builder.io/api/v1/image/assets/TEMP/ccd4f679fc81799ad5f971c9f773cb93690ed50ee4f6c94555b73f96e837a26d?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '滑雪教練培訓班3',
		price: 3000,
		showPriceLabel: true,
	},
	{
		imageUrl:
			'https://cdn.builder.io/api/v1/image/assets/TEMP/ccd4f679fc81799ad5f971c9f773cb93690ed50ee4f6c94555b73f96e837a26d?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '滑雪教練培訓班4',
		price: 60000,
		showPriceLabel: false,
	},
	{
		imageUrl:
			'https://cdn.builder.io/api/v1/image/assets/TEMP/ccd4f679fc81799ad5f971c9f773cb93690ed50ee4f6c94555b73f96e837a26d?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '滑雪教練培訓班5',
		price: 70000,
		showPriceLabel: false,
	},
	{
		imageUrl:
			'https://cdn.builder.io/api/v1/image/assets/TEMP/ccd4f679fc81799ad5f971c9f773cb93690ed50ee4f6c94555b73f96e837a26d?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '滑雪教練培訓班6',
		price: 80000,
		showPriceLabel: false,
	},
];
type Props = {
	courseId: string;
	departmentId: string;
};

function RecommendedCourses({ courseId, departmentId }: Props) {
	const [courses, setCourses] = useState<
		{
			id: string;
			imageUrl: string;
			title: string;
			price: number;
			showPriceLabel?: boolean;
		}[]
	>();

	useEffect(() => {
		if (!departmentId || !courseId) return;
		const getCourses = async (departmentId: string) => {
			const response = await axios.get<ResponseWrapper<GetClientCoursesResponseDTO[]>>(
				`/api/courses/${departmentId}/client`,
			);
			if (response.status === 200 && response.data?.result) {
				const formatData = response.data.result
					.map((item) => ({
						id: item.id,
						imageUrl: process.env.NEXT_PUBLIC_AWS_S3_URL + item.image,
						title: item.name,
						price: item.lowestPrice,
						showPriceLabel: true,
					}))
					.filter((item) => item.id !== courseId);

				setCourses(formatData);
			}
		};
		getCourses(departmentId);
	}, [departmentId, courseId]);

	const sectionRef = useRef<HTMLDivElement>(null);

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

	return (
		<section ref={sectionRef} className='flex flex-col pt-20 w-full' aria-labelledby='recommended-courses-title'>
			<h2
				id='recommended-courses-title'
				className='text-2xl font-medium tracking-tight leading-loose text-zinc-800 max-xs:max-w-full'
			>
				推薦課程
			</h2>
			{courses?.length > 0 && <CourseList courses={courses} />}
		</section>
	);
}

export default RecommendedCourses;
