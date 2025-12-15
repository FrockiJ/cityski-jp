'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Box } from '@mui/material';
import { CoursePlanResponseDTO, CourseType, Department, GetCourseDetailResponseDTO } from '@repo/shared';
import { CircleX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { OrderFormData } from '@/components/Project/Courses/CourseDetail/CourseBookingForm';
import Button from '@/components/Project/Shared/Common/Button';

const courseTypeMap = {
	[CourseType.GROUP]: '團體班教學',
	[CourseType.PRIVATE]: '私人班教學',
	[CourseType.INDIVIDUAL]: '個人練習',
};

const errorMessages = {
	payment_failed: {
		title: '支付失敗',
		description: '您的支付未能成功完成，請聯繫客服或返回首頁重新下單。',
	},
	timeout: {
		title: '支付驗證超時',
		description: '支付驗證超時，請稍後查看訂單狀態或聯繫客服。',
	},
	cancelled: {
		title: '訂單已取消',
		description: '您的訂單已被取消。',
	},
	default: {
		title: '發生錯誤',
		description: '處理您的訂單時發生錯誤，請稍後再試。',
	},
};

function OrderErrorContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const reason = searchParams.get('reason') as keyof typeof errorMessages || 'default';

	const [courseDetail, setCourseDetail] = useState<GetCourseDetailResponseDTO>();
	const [department, setDepartment] = useState<Department | null>(null);
	const [formData, setFormData] = useState<OrderFormData>();
	const [plan, setPlan] = useState<CoursePlanResponseDTO>();
	const [images, setImages] = useState<string[]>();
	const [orderNo, setOrderNo] = useState<string | null>(null);
	const [orderId, setOrderId] = useState<string | null>(null);

	const errorInfo = errorMessages[reason] || errorMessages.default;

	useEffect(() => {
		const createOrderSuccess = localStorage.getItem('createOrderSuccess');
		if (createOrderSuccess) {
			const { courseDetail, order, department, plan, formData } = JSON.parse(createOrderSuccess);
			setCourseDetail(courseDetail);
			setDepartment(department);
			setPlan(plan);
			setFormData(formData);
			setImages(courseDetail?.attachments.map((image: any) => process.env.NEXT_PUBLIC_AWS_S3_URL + image.key));
			setOrderNo(order?.no || null);
			setOrderId(order?.id || null);
		}
	}, []);

	return (
		<div className='max-w-[380px] mx-auto pt-[48px] max-xs:pt-0'>
			<div className='max-xs:px-5 w-full flex-col items-center justify-center'>
				<div className='flex items-center justify-center text-[#EF4444] mb-4'>
					<CircleX size={64} />
				</div>
				<h1 className='text-3xl mb-4 text-center'>{errorInfo.title}</h1>
				<p className='text-center text-zinc-600 mb-10 px-4'>{errorInfo.description}</p>

				{orderNo && (
					<div className='mb-6 text-center'>
						<p className='text-sm text-zinc-500'>訂單編號</p>
						<p className='text-lg font-medium text-zinc-800'>{orderNo}</p>
					</div>
				)}

				{courseDetail && (
					<section className='flex items-center justify-center mb-10 w-full'>
						<div className='w-full flex flex-wrap gap-5 p-3 whitespace-nowrap rounded-xl border border-solid min-h-[124px] text-zinc-800 max-xs:max-w-full max-xs:flex-row-reverse max-xs:justify-between'>
							<div className='self-stretch my-auto w-[185px] max-xs:w-auto'>
								<h2 className='text-xl font-medium leading-snug mb-4'>
									{courseDetail?.type ? courseTypeMap[courseDetail?.type] : ''}
								</h2>
								<div className='flex gap-1 items-center pr-4'>
									<img
										src='https://cdn.builder.io/api/v1/image/assets/94845a89f25540f0bbe6b080603a926f/4fb78566afe4950a4b9782882a228543d4a78cbe?placeholderIfAbsent=true'
										alt='Location icon'
										className='object-contain w-4 aspect-square'
									/>
									<span>{department?.name || '-'}</span>
								</div>
								<div className='flex gap-1 items-center pr-4'>
									<Box component='img' src='/icons/ski-man.svg' />
									<span>
										{(() => {
											switch (Number(courseDetail?.skiType)) {
												case 0:
													return '單板和雙板';
												case 1:
													return '單板';
												case 2:
													return '雙板';
												default:
													return courseDetail?.skiType || '---';
											}
										})()}
									</span>
								</div>
								<div className='flex gap-1 items-center pr-4'>
									<img
										src='https://cdn.builder.io/api/v1/image/assets/94845a89f25540f0bbe6b080603a926f/99236f0f3883b7c9a8cc8de9bf70425e04fc1fb8?placeholderIfAbsent=true'
										alt='Plan icon'
										className='object-contain w-4 aspect-square'
									/>
									<span>{plan?.type === 1 ? '單堂體驗課' : `${plan?.number}堂 ${plan?.name}`}</span>
								</div>
								<div className='flex gap-1 items-center pr-4'>
									<Box component='img' src='/icons/people.svg' />
									<span>
										{`${formData?.participants?.adult || 0}成人 + ${formData?.participants?.minor || 0}青少年/兒童`}
									</span>
								</div>
							</div>
							{images?.length ? (
								<img
									src={images?.[0]}
									alt='Course thumbnail'
									className='object-contain shrink-0 self-stretch my-auto rounded-md aspect-square w-[100px]'
								/>
							) : (
								<></>
							)}
						</div>
					</section>
				)}

				<div className='flex gap-2'>
					<Button variant='secondary' onClick={() => router.push('/')} className='w-full' aria-label='回到首頁'>
						回到首頁
					</Button>
					<button
						className='overflow-hidden gap-2.5 self-stretch px-6 py-5 max-w-full text-base font-bold text-white whitespace-nowrap rounded-lg bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] w-full max-xs:px-5 transition-all duration-300 hover:opacity-90 hover:shadow-lg'
						onClick={() => orderId ? router.push(`/order/${orderId}`) : router.push('/member/orders')}
						aria-label='查看訂單'
					>
						查看訂單
					</button>
				</div>
			</div>
		</div>
	);
}

const OrderErrorPage = () => {
	return (
		<Suspense fallback={<div className='max-w-[380px] mx-auto pt-[48px] text-center'>載入中...</div>}>
			<OrderErrorContent />
		</Suspense>
	);
};

export default OrderErrorPage;
