'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CoursePlanResponseDTO, GetCourseDetailResponseDTO, ResponseWrapper } from '@repo/shared';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { OrderFormData } from '@/components/Project/Courses/CourseDetail/CourseBookingForm';
import CheckoutSummary from '@/components/Project/OrderConfirm/CheckoutSummary';
import CourseInfoSection from '@/components/Project/OrderConfirm/CourseInfoSection';
import DiscountSection from '@/components/Project/OrderConfirm/DiscountSection';
import PaymentSection from '@/components/Project/OrderConfirm/PaymentSection';
import axios from '@/lib/api';
import { Department, selectDepartment, setDiscount } from '@/state/slices/infoSlice';

function OrderConfirmationPage() {
	const router = useRouter();
	const departmentFromRedux = useSelector(selectDepartment);
	const [department, setDepartment] = useState<Department | null>(null);
	const dispatch = useDispatch();

	const [courseDetail, setCourseDetail] = useState<GetCourseDetailResponseDTO>();
	const [formData, setFormData] = useState<OrderFormData>();
	const [plan, setPlan] = useState<CoursePlanResponseDTO>();
	const [timestamp, setTimestamp] = useState<number>();

	useEffect(() => {
		// Get department from either Redux or localStorage
		if (departmentFromRedux) {
			setDepartment(departmentFromRedux);
		} else {
			const savedDepartment = localStorage.getItem('selectedDepartment');
			if (savedDepartment) {
				setDepartment(JSON.parse(savedDepartment));
			} else {
				// If no department is found, redirect to courses page
				router.push('/courses');
			}
		}

		const courseOrderData = localStorage.getItem('courseOrderData');
		if (courseOrderData) {
			const { courseId, formData, timestamp } = JSON.parse(courseOrderData);
			setFormData(formData);
			setTimestamp(timestamp);
			console.log(courseId, formData, timestamp);
			const getCourseDetail = async (id: string) => {
				const response = await axios.get<ResponseWrapper<GetCourseDetailResponseDTO>>(
					`/api/courses/client/${id}/detail`,
				);
				// console.log('response courses', response);
				if (response.status === 200 && response.data?.result) {
					setCourseDetail(response.data.result);
					if (formData?.plan) {
						setPlan(response.data.result.coursePlans.find((plan) => plan.id === formData.plan));
					}
				}
			};
			getCourseDetail(courseId);
		} else {
			router.push('/courses');
		}
	}, [router, departmentFromRedux]);

	useEffect(() => {
		if (courseDetail) {
			console.log('courseDetail updated:', courseDetail);
		}
	}, [courseDetail]);

	console.log('department', department);

	useEffect(() => {
		// Cleanup function to clear discount when leaving the page
		return () => {
			dispatch(setDiscount(null));
		};
	}, [dispatch]);

	return (
		<div className='max-w-[1200px] mx-auto pt-[48px] max-xs:pt-0'>
			<div className='relative mt-10 flex flex-col md:flex-row gap-[60px]'>
				<div className='flex-1 max-xs:px-5 w-full'>
					<div className='w-full max-xs:max-w-full'>
						<div className='flex relative gap-2 items-start w-full text-3xl font-medium tracking-tighter leading-none text-justify whitespace-nowrap text-zinc-800 max-md:max-w-full'>
							<ChevronLeft
								className='absolute bottom-[-5px] z-0 shrink-0 w-10 h-10 left-[-46px] text-zinc-800 cursor-pointer'
								strokeWidth={1}
								onClick={() => router.back()}
							/>
							<h1 className='z-0 max-xs:hidden'>訂購明細</h1>
						</div>
						<div className='mt-12 w-full max-xs:max-w-full max-xs:mt-0'>
							<CourseInfoSection
								courseType={courseDetail?.type}
								skiType={formData?.boardType}
								participants={formData?.participants}
								plan={plan}
								department={department}
								timestamp={timestamp}
							/>
							<div className='xs:hidden mt-8'>
								<CheckoutSummary isMobile={true} participants={formData?.participants} plan={plan} />
							</div>
							<PaymentSection />
							<DiscountSection department={department} />
						</div>
						<div className='mt-12 w-full text-justify max-xs:mt-10 max-xs:max-w-full'>
							<p className='text-sm leading-6 text-zinc-500 max-xs:max-w-full'>
								點擊下方「送出訂單」，即表示您已確認訂單無誤且同意本訂單金額，以及同意
								<span className='text-[#0F72ED]'>課程約定事項</span>
								，包含課程改期與課程取消政策。
							</p>
							<button
								className='overflow-hidden gap-2.5 self-stretch px-6 py-5 mt-7 max-w-full text-base font-bold text-white whitespace-nowrap rounded-lg bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] w-[335px] max-xs:w-full max-xs:px-5 transition-all duration-300 hover:opacity-90 hover:shadow-lg'
								aria-label='送出訂單'
							>
								送出訂單
							</button>
						</div>
					</div>
				</div>
				<div className='hidden xs:block sticky top-[150px] w-[400px] h-[440px] mt-20'>
					<CheckoutSummary participants={formData?.participants} plan={plan} />
				</div>
			</div>
		</div>
	);
}

export default OrderConfirmationPage;
