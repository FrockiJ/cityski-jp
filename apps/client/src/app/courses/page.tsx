'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetClientCoursesResponseDTO, GetDepartmentsResponseDTO, ResponseWrapper } from '@repo/shared';
import { Check, ChevronDown, MapPin } from 'lucide-react';

import { BlurFade } from '@/components/Effects/BlurFade';
import CourseCategoryCard from '@/components/Project/Courses/CourseCategoryCard';
import useSize from '@/hooks/useSize';
import axios from '@/lib/api';
import { setDepartment } from '@/state/slices/infoSlice';
import { useAppDispatch } from '@/state/store';

interface CourseCategory extends GetClientCoursesResponseDTO {
	additionalInfo?: string;
}

const MobileCourseCategoryPage = ({ courses }: { courses: CourseCategory[] }) => {
	return (
		<div className='flex flex-col gap-5 items-center w-full max-xs:mt-5'>
			{courses?.map((category, index) => (
				<BlurFade key={index} delay={0.2 + index * 0.2} className='w-[90vw] aspect-square'>
					<CourseCategoryCard {...category} className='h-full' />
				</BlurFade>
			))}
		</div>
	);
};

const CourseCategoryPage = () => {
	const [departments, setDepartments] = useState<GetDepartmentsResponseDTO[]>();
	const [courses, setCourses] = useState<GetClientCoursesResponseDTO[]>();
	const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>();
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [width] = useSize();
	const isMobile = width <= 480;
	const dispatch = useAppDispatch();

	// const courseCategories: CourseCategory[] = [
	// 	{
	// 		name: '團體班體驗',
	// 		description: '揪團來滑雪，樂趣無限，挑戰自我！',
	// 		price: '1,600',
	// 		image:
	// 			'https://cdn.builder.io/api/v1/image/assets/TEMP/8596cdef77286640d2f699f134c17171a9553fedf139057c934a789e84649ce7?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
	// 	},
	// 	{
	// 		name: '私人班體驗',
	// 		description: '1人即可開班，體驗更精實的訓練',
	// 		price: '3,000',
	// 		image:
	// 			'https://cdn.builder.io/api/v1/image/assets/TEMP/14d343e7828becd7f3067b79dfcc3cc009123603a1df12c3eec2e339fbac0eff?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
	// 	},
	// 	{
	// 		name: '個人練習',
	// 		description: '10堂的個人練習，免費贈送一堂。',
	// 		price: '6,000',
	// 		additionalInfo: '(10+1次)',
	// 		image:
	// 			'https://cdn.builder.io/api/v1/image/assets/TEMP/85f16d37b4b315dc78824d4cba01cc984f4d968c89c8c5488e5ecf3c82b4de06?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
	// 	},
	// 	{
	// 		name: '兒童夏令營',
	// 		description: '來兒童滑雪夏令營，盡情放電玩一夏！',
	// 		price: '11,800',
	// 		image:
	// 			'https://cdn.builder.io/api/v1/image/assets/TEMP/c6f82c3e5313f8469982cc30d2e68e8947386f81265a49385a4c69e99ea4549b?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
	// 	},
	// 	{
	// 		name: '教練培訓班',
	// 		description: '專業指導，成就滑雪夢想！',
	// 		price: '37,500',
	// 		image:
	// 			'https://cdn.builder.io/api/v1/image/assets/TEMP/6bbbebd72d2d2f1e2d3ffbe52acce973d8b8913d9838ad27b320bd6232287751?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
	// 	},
	// 	{
	// 		name: '專案課程',
	// 		description: '揪團來滑雪，樂趣無限，挑戰自我！',
	// 		price: '11,800',
	// 		image:
	// 			'https://cdn.builder.io/api/v1/image/assets/TEMP/fe9f7957e4e89be63d405e009190bef2a2e3cd9e8e4ad5bd7923a59d549e027d?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
	// 	},
	// ];

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

				// Try to get saved department from localStorage
				const savedDepartment = localStorage.getItem('selectedDepartment');
				if (savedDepartment) {
					const parsedDepartment = JSON.parse(savedDepartment);
					// Verify the saved department still exists in the current list
					const departmentExists = response.data.result.some((dept) => dept.id === parsedDepartment.id);
					if (departmentExists) {
						setSelectedDepartmentId(parsedDepartment.id);
						dispatch(setDepartment(parsedDepartment));
						getCourses(parsedDepartment.id);
						return;
					}
				}

				// If no saved department or it doesn't exist anymore, use the first one
				const firstDept = response.data.result[0];
				setSelectedDepartmentId(firstDept.id);
				dispatch(setDepartment(firstDept));
				localStorage.setItem('selectedDepartment', JSON.stringify(firstDept));
				getCourses(firstDept.id);
			}
		};
		getDepartments();
	}, [dispatch]);

	console.log('courses', courses);
	console.log('departments', departments);
	return (
		<div className='flex overflow-hidden flex-col bg-white'>
			<main className='flex flex-col self-center mt-20 w-full max-w-[1200px] max-xs:mt-2 max-xs:max-w-full relative'>
				<section className='flex flex-wrap gap-10 justify-between items-end w-full font-medium whitespace-nowrap text-zinc-800 relative'>
					<div className='flex flex-1 items-center justify-between max-xs:flex-col max-xs:w-full max-xs:gap-4 max-xs:px-5 max-xs:pt-5'>
						<h1 className='text-3xl tracking-tighter leading-none max-xs:hidden'>課程方案</h1>
						<div className='relative max-xs:w-full z-[1]'>
							<MapPin className='absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-black' />
							<button
								ref={buttonRef}
								className='appearance-none pl-8 pr-8 py-2 text-base bg-white rounded-lg border border-solid border-[#d7d7d7] focus:outline-none focus:border-[#2b2b2b] text-left w-[120px] max-xs:w-full'
								onClick={() => setIsOpen(!isOpen)}
							>
								<span className='block'>{departments?.find((dept) => dept.id === selectedDepartmentId)?.name}</span>
							</button>
							<ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none' />

							{isOpen &&
								buttonRef.current &&
								createPortal(
									<div
										style={{
											zIndex: 1,
											position: 'absolute',
											top: buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 4,
											left: buttonRef.current.getBoundingClientRect().left + window.scrollX,
											width: buttonRef.current.offsetWidth,
										}}
										className='bg-white border border-solid border-[#d7d7d7] rounded-lg shadow-lg'
									>
										{departments
											?.filter((dept) => dept.status === 1)
											.sort((a, b) => a.sequence - b.sequence)
											.map((dept) => (
												<div
													key={dept.id}
													className='flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer'
													onClick={async () => {
														setSelectedDepartmentId(dept.id);
														setIsOpen(false);
														dispatch(setDepartment(dept));
														localStorage.setItem('selectedDepartment', JSON.stringify(dept));
														const response = await axios.get<ResponseWrapper<GetClientCoursesResponseDTO[]>>(
															`/api/courses/${dept.id}/client`,
														);
														if (response.status === 200 && response.data?.result) {
															setCourses(response.data.result);
														}
													}}
												>
													<span className='truncate pr-2'>{dept.name}</span>
													{dept.id === selectedDepartmentId && <Check className='w-4 h-4 text-black flex-shrink-0' />}
												</div>
											))}
									</div>,
									document.body,
								)}
						</div>
					</div>
				</section>
				{isMobile ? (
					<MobileCourseCategoryPage courses={courses} />
				) : (
					<div className='flex flex-col gap-4 mt-9 w-full whitespace-nowrap'>
						<div className='flex flex-wrap gap-4 max-xs:gap-5 items-start w-full max-xs:flex-col max-xs:items-center'>
							{courses?.slice(0, 2).map((category, index) => (
								<BlurFade key={index} delay={0.2 + index * 0.2} className='max-w-[50%] aspect-square max-xs:min-h-0'>
									<CourseCategoryCard {...category} />
								</BlurFade>
							))}
						</div>
						<div className='flex flex-wrap gap-4 max-xs:gap-5 items-start w-full max-xs:flex-col max-xs:items-center'>
							{/* Third item - wider */}

							<div className='flex-1 flex-grow w-[50%] h-[288px] '>
								{courses?.[2] && (
									<BlurFade delay={0.6}>
										<CourseCategoryCard {...courses[2]} />
									</BlurFade>
								)}
							</div>
							<div className='flex flex-1 flex-grow w-[50%] h-[288px] gap-4 max-xs:gap-5'>
								{/* Fourth and Fifth items - normal squares */}
								{courses?.slice(3, 5).map((category, index) => (
									<BlurFade key={index} delay={0.8 + index * 0.2}>
										<CourseCategoryCard {...category} />
									</BlurFade>
								))}
							</div>
						</div>

						<div className='flex gap-4 max-xs:gap-5 max-w-[25%] h-[288px]'>
							{/* Remaining items - normal squares */}
							{courses?.slice(5).map((category, index) => (
								<BlurFade key={index} delay={1.2 + index * 0.2}>
									<CourseCategoryCard {...category} />
								</BlurFade>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default CourseCategoryPage;
