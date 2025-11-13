'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	CourseType,
	GetCourseDetailResponseDTO,
	GetOrderDetailResponseDTO,
	OrderStatus,
	ResponseWrapper,
} from '@repo/shared';
import { useParams } from 'next/navigation';

import ProfileIcon from '@/components/Icon/ProfileIcon';
import SnowBoardIcon from '@/components/Icon/SnowBoardIcon';
import { orderStatusMapper } from '@/components/Project/Member/CurrentOrders';
import { showToast } from '@/components/Project/Utils/Toast';
import api from '@/lib/api';
import { selectToken } from '@/state/slices/authSlice';

const courseTypeMap = {
	[CourseType.GROUP]: '團體班教學',
	[CourseType.PRIVATE]: '私人班教學',
	[CourseType.INDIVIDUAL]: '個人練習',
};

export default function OrderDetail() {
	const { orderId } = useParams<{ orderId: string }>();
	const [orderDetail, setOrderDetail] = useState<GetOrderDetailResponseDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const accessToken = useSelector(selectToken);

	const [courseDetail, setCourseDetail] = useState<GetCourseDetailResponseDTO>();
	const [orderMembers, setOrderMembers] = useState(orderDetail?.orderMembers || []);

	useEffect(() => {
		if (!accessToken) return;

		const getOrderDetail = async (orderId: string) => {
			try {
				setLoading(true);
				const response = await api.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setOrderDetail(response.data.result);
			} catch (error) {
				console.error('Failed to fetch order detail:', error);
			} finally {
				setLoading(false);
			}
		};

		if (orderId) getOrderDetail(orderId);
	}, [accessToken, orderId]);

	useEffect(() => {
		if (!orderDetail) return;

		const getCourseDetail = async (id: string) => {
			const response = await api.get<ResponseWrapper<GetCourseDetailResponseDTO>>(`/api/courses/client/${id}/detail`);
			setCourseDetail(response.data.result);
		};

		if (orderDetail.courseId) getCourseDetail(orderDetail.courseId);
	}, [orderDetail]);

	if (!orderDetail || !courseDetail) return null;

	const coursePlan = courseDetail?.coursePlans.find((plan) => plan.name === orderDetail.coursePlanName);
	const price = coursePlan?.price || 0;
	const deposit = Math.floor(price * 0.5);

	return (
		<div className='flex overflow-hidden flex-col bg-white pt-1'>
			<div className='flex flex-col self-center mt-20 w-full max-w-[1200px] max-xs:mt-0 max-xs:max-w-full'>
				<div className='h-full w-full bg-white flex flex-col items-center justify-center'>
					<div className='inline-flex justify-start items-start gap-6'>
						<div className='w-full inline-flex flex-col justify-start items-start gap-6'>
							<div
								data-property-1='Unpaid'
								className='w-full px-8 pt-6 pb-8 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-6'
							>
								<div className='self-stretch flex flex-col justify-start items-start gap-1'>
									<div
										className={
											orderStatusMapper[orderDetail.status].headerStyle +
											" justify-start text-2xl font-medium font-['Noto_Sans_TC'] leading-10 border-none"
										}
									>
										{orderStatusMapper[orderDetail.status].headerLabel}
									</div>
									{orderDetail.status === OrderStatus.PENDING_DEPOSIT && (
										<div className='inline-flex justify-start items-center gap-1'>
											<div className="justify-start text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
												訂單保留期限
											</div>
											<div className="justify-start text-zinc-500 text-sm font-normal font-['Poppins'] leading-6">
												{new Date(orderDetail.expDate).toLocaleDateString('sv-SE')}{' '}
												{new Date(orderDetail.expDate).toLocaleTimeString('sv-SE', {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</div>
										</div>
									)}
								</div>
								{orderDetail.status === OrderStatus.PENDING_DEPOSIT && (
									<div className='self-stretch rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-800 inline-flex justify-start items-start overflow-hidden'>
										<div className='flex-1 m-0.5 self-stretch relative border-r border-zinc-300 overflow-hidden'>
											<div className='left-[24px] top-[24px] absolute inline-flex flex-col justify-center items-start gap-0.5'>
												<div className='inline-flex justify-start items-center gap-1'>
													<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
														應繳訂金
													</div>
													<div data-svg-wrapper className='relative'>
														<svg
															width='16'
															height='16'
															viewBox='0 0 16 16'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M8.00038 11.3333C8.36857 11.3333 8.66704 11.0348 8.66704 10.6666V7.33325C8.66704 6.96506 8.36857 6.66659 8.00038 6.66659C7.63219 6.66659 7.33371 6.96506 7.33371 7.33325V10.6666C7.33371 11.0348 7.63219 11.3333 8.00038 11.3333Z'
																fill='#0F72ED'
															/>
															<path
																d='M8.00038 5.99992C7.63219 5.99992 7.33371 5.70144 7.33371 5.33325C7.33371 4.96506 7.63219 4.66659 8.00038 4.66659C8.36857 4.66659 8.66704 4.96506 8.66704 5.33325C8.66704 5.70144 8.36857 5.99992 8.00038 5.99992Z'
																fill='#0F72ED'
															/>
															<path
																fill-rule='evenodd'
																clip-rule='evenodd'
																d='M8.00038 1.33325C4.31848 1.33325 1.33371 4.31802 1.33371 7.99992C1.33371 11.6818 4.31848 14.6666 8.00038 14.6666C11.6823 14.6666 14.667 11.6818 14.667 7.99992C14.667 6.23181 13.9647 4.53612 12.7144 3.28587C11.4642 2.03563 9.76849 1.33325 8.00038 1.33325ZM2.53371 7.99992C2.53371 4.98076 4.98122 2.53325 8.00038 2.53325C9.45022 2.53325 10.8407 3.1092 11.8659 4.1344C12.8911 5.1596 13.467 6.55007 13.467 7.99992C13.467 11.0191 11.0195 13.4666 8.00038 13.4666C4.98122 13.4666 2.53371 11.0191 2.53371 7.99992Z'
																fill='#0F72ED'
															/>
														</svg>
													</div>
												</div>
												<div className='inline-flex justify-start items-center gap-0.5'>
													<div className="justify-start text-zinc-800 text-3xl font-semibold font-['Poppins'] leading-8">
														{deposit}
													</div>
													<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
														元
													</div>
												</div>
											</div>
											<div className='left-[24px] top-[134px] absolute inline-flex justify-start items-center gap-1'>
												<div className="justify-start text-zinc-500 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
													總金額
												</div>
												<div className='flex justify-start items-center'>
													<div className="justify-start text-zinc-500 text-sm font-normal font-['Poppins'] leading-5">
														{price}
													</div>
													<div className="w-3.5 h-3.5 justify-center text-zinc-500 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
														元
													</div>
												</div>
											</div>
										</div>
										<div className='flex-1 p-6 inline-flex flex-col justify-start items-start gap-6'>
											<div className='self-stretch flex flex-col justify-start items-start gap-1'>
												<div className='self-stretch h-6 inline-flex justify-start items-center gap-2'>
													<div className='flex-1 justify-end'>
														<span className="text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															台中銀行{' '}
														</span>
														<span className="text-zinc-800 text-base font-medium font-['Poppins'] leading-6">
															(053)
														</span>
													</div>
												</div>
												<div className='self-stretch inline-flex justify-between items-center'>
													<div className="justify-start text-zinc-800 text-xl font-semibold font-['Poppins'] leading-7">
														77777-25115541-7
													</div>
													<button
														className='rounded-lg flex justify-center items-center gap-1 overflow-hidden cursor-pointer px-2 py-1 transition-colors'
														onClick={() => {
															navigator.clipboard
																.writeText('77777-25115541-7')
																.then(() => showToast('已複製帳號號碼', 'success'))
																.catch((err) => {
																	console.error('複製失敗:', err);
																	showToast('複製失敗，請重試', 'error');
																});
														}}
													>
														<div className="text-center justify-start text-blue-600 text-sm font-medium font-['Noto_Sans_TC'] leading-6">
															複製
														</div>
														<div data-svg-wrapper className='relative'>
															<svg
																width='16'
																height='16'
																viewBox='0 0 16 16'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M13.2 1.33325H6.13333C5.69333 1.33325 5.33333 1.69325 5.33333 2.13325V3.99992H2.8C2.36 3.99992 2 4.35992 2 4.79992V13.8666C2 14.3066 2.36 14.6666 2.8 14.6666H9.86667C10.3067 14.6666 10.6667 14.3066 10.6667 13.8666V11.9999H13.2C13.64 11.9999 14 11.6399 14 11.1999V2.13325C14 1.69325 13.64 1.33325 13.2 1.33325ZM9.6 13.5999H3.06667V5.06659H9.6V13.5999ZM12.9333 10.9333H10.6667V4.79992C10.6667 4.35992 10.3067 3.99992 9.86667 3.99992H6.4V2.39992H12.9333V10.9333Z'
																	fill='#0F72ED'
																/>
															</svg>
														</div>
													</button>
												</div>
											</div>
											<div className='self-stretch flex flex-col justify-start items-start gap-2'>
												<div className='inline-flex justify-start items-center gap-2'>
													<div className='px-1.5 py-0.5 bg-gray-200 rounded flex justify-start items-start'>
														<div className="text-center justify-start text-zinc-800 text-xs font-medium font-['Noto_Sans_TC'] leading-4">
															戶名
														</div>
													</div>
													<div className='justify-start'>
														<span className="text-zinc-500 text-sm font-normal font-['Poppins'] leading-6">
															CitySki
														</span>
														<span className="text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															城市滑雪學校-台中分校
														</span>
													</div>
												</div>
												<div className='inline-flex justify-start items-center gap-2'>
													<div className='px-1.5 py-0.5 bg-gray-200 rounded flex justify-start items-start'>
														<div className="text-center justify-start text-zinc-800 text-xs font-medium font-['Noto_Sans_TC'] leading-4">
															分行
														</div>
													</div>
													<div className='h-6 flex justify-start items-center gap-0.5'>
														<div className="justify-end text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															台中銀行西屯分行
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
								<div
									className='self-stretch inline-flex justify-start items-center gap-5 cursor-pointer'
									onClick={() => window.open(`/courses/course-detail?id=${orderDetail.courseId}`, '_blank')}
								>
									<div className='w-20 h-20 relative rounded-lg overflow-hidden'>
										<img src='/image/membership/order.png' alt='order' width='80' height='80' className='xs:hidden' />
										<img
											src='/image/membership/order.png'
											alt='order'
											width='130'
											height='130'
											className='hidden xs:block'
										/>
									</div>
									<div className='inline-flex flex-col justify-start items-start gap-2'>
										<div className="self-stretch justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
											{courseTypeMap[courseDetail.type]}
										</div>
										<div className='self-stretch inline-flex justify-start items-center gap-4'>
											<div className='flex justify-start items-center gap-1'>
												<div data-svg-wrapper className='relative'>
													<svg
														width='16'
														height='16'
														viewBox='0 0 16 16'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M13.585 4.42995C13.125 3.32995 12.355 2.37995 11.355 1.71995C10.365 1.05995 9.19501 0.699951 7.99501 0.699951C6.795 0.699951 5.62501 1.04995 4.63501 1.71995C3.64501 2.37995 2.87501 3.32995 2.41501 4.42995C1.95501 5.52995 1.83501 6.74995 2.07501 7.92995C2.30501 9.09995 2.88501 10.18 3.73501 11.03L8.01501 15.31L12.295 11.03C13.145 10.18 13.715 9.10995 13.955 7.92995C14.185 6.75995 14.065 5.53995 13.615 4.43995L13.585 4.42995ZM12.755 7.68995C12.565 8.62995 12.105 9.48995 11.425 10.17L7.99501 13.6L4.56501 10.17C3.88501 9.48995 3.42501 8.62995 3.23501 7.68995C3.04501 6.74995 3.14501 5.77995 3.51501 4.88995C3.88501 3.99995 4.50501 3.24995 5.30501 2.70995C6.10501 2.17995 7.03501 1.88995 7.99501 1.88995C8.95501 1.88995 9.885 2.16995 10.685 2.70995C11.485 3.23995 12.105 3.99995 12.475 4.88995C12.845 5.77995 12.935 6.74995 12.755 7.68995Z'
															fill='#2B2B2B'
														/>
														<path
															d='M8.00501 4.59995C7.43501 4.59995 6.88501 4.82995 6.48501 5.22995C6.08501 5.62995 5.85501 6.17995 5.85501 6.74995C5.85501 7.31995 6.08501 7.86995 6.48501 8.26995C6.88501 8.66995 7.43501 8.89995 8.00501 8.89995C8.57501 8.89995 9.12501 8.66995 9.52501 8.26995C9.92501 7.86995 10.155 7.31995 10.155 6.74995C10.155 6.17995 9.92501 5.62995 9.52501 5.22995C9.12501 4.82995 8.57501 4.59995 8.00501 4.59995ZM8.675 7.41995C8.49501 7.59995 8.25501 7.69995 8.00501 7.69995C7.75501 7.69995 7.51501 7.59995 7.33501 7.41995C7.15501 7.23995 7.05501 6.99995 7.05501 6.74995C7.05501 6.49995 7.15501 6.24995 7.33501 6.07995C7.51501 5.89995 7.75501 5.79995 8.00501 5.79995C8.25501 5.79995 8.49501 5.89995 8.675 6.07995C8.855 6.25995 8.95501 6.49995 8.95501 6.74995C8.95501 6.99995 8.855 7.23995 8.675 7.41995Z'
															fill='#2B2B2B'
														/>
													</svg>
												</div>
												<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
													台中店
												</div>
											</div>
											<div data-svg-wrapper>
												<svg width='1' height='14' viewBox='0 0 1 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<rect width='1' height='14' fill='#D7D7D7' />
												</svg>
											</div>
											<div className='flex justify-start items-center gap-1'>
												<div data-svg-wrapper className='relative'>
													<svg
														width='16'
														height='16'
														viewBox='0 0 16 16'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path d='M4.7667 7.90002V6.76668H5.90004V7.90002H4.7667Z' fill='#2B2B2B' />
														<path d='M4.7667 9.90002V8.76668H5.90004V9.90002H4.7667Z' fill='#2B2B2B' />
														<path d='M4.7667 11.9V10.7667H5.90004V11.9H4.7667Z' fill='#2B2B2B' />
														<path
															fill-rule='evenodd'
															clip-rule='evenodd'
															d='M4.7667 2.76668V2.43335C4.7667 1.88106 5.21442 1.43335 5.7667 1.43335H10.2334C10.7857 1.43335 11.2334 1.88107 11.2334 2.43335V2.76668H13.3378C13.6483 2.76668 13.9 3.01854 13.9 3.32895V14.0044C13.9 14.3149 13.6482 14.5667 13.3378 14.5667H2.6623C2.35178 14.5667 2.10004 14.3149 2.10004 14.0044V3.32895C2.10004 3.01843 2.35189 2.76668 2.6623 2.76668H4.7667ZM10.1 2.56668H5.90004V4.10002H10.1V2.56668ZM4.7667 3.90002H3.23337V13.4334H12.7667V3.90002H11.2334V5.23335H4.7667V3.90002Z'
															fill='#2B2B2B'
														/>
													</svg>
												</div>
												<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
													{coursePlan.number}堂{courseTypeMap[courseDetail.type]}
												</div>
											</div>
											<div data-svg-wrapper>
												<svg width='1' height='14' viewBox='0 0 1 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<rect width='1' height='14' fill='#D7D7D7' />
												</svg>
											</div>
											<div className='flex justify-start items-center gap-1'>
												<div data-svg-wrapper className='relative'>
													<SnowBoardIcon width={16} height={16} />
												</div>
												<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
													雙板
												</div>
											</div>
											<div data-svg-wrapper>
												<svg width='1' height='14' viewBox='0 0 1 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<rect width='1' height='14' fill='#D7D7D7' />
												</svg>
											</div>
											<div className='flex justify-start items-center gap-1'>
												<div data-svg-wrapper className='relative'>
													<ProfileIcon width={16} height={16} />
												</div>
												<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
													{orderDetail.adultCount}成人 + {orderDetail.childCount}青少年/兒童
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								data-property-1='Initial'
								data-reservation-info='false'
								className='self-stretch px-8 pt-6 pb-8 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-6'
							>
								<div className='self-stretch inline-flex justify-between items-center'>
									<div className="justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
										課程預約
									</div>
									<div
										data-state='Disable'
										data-type='Stroke_Blue+Icon'
										className='pl-1 pr-3 py-px rounded-[20px] outline outline-1 outline-offset-[-1px] outline-neutral-400 flex justify-center items-center overflow-hidden'
									>
										<div data-svg-wrapper>
											<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
												<path d='M7 12H17M12 7L12 17' stroke='#ACACAC' stroke-width='1.4' stroke-linecap='round' />
											</svg>
										</div>
										<div className="text-center justify-start text-neutral-400 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
											預約課程
										</div>
									</div>
								</div>
								<div className='self-stretch h-20 px-72 py-8 inline-flex justify-center items-center gap-2.5'>
									<div className="text-center justify-start text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
										目前沒有預約課程
									</div>
								</div>
							</div>
							<div
								data-property-1='Empty'
								data-show-banner='true'
								data-show-manage-btn='true'
								className='self-stretch px-8 pt-6 pb-8 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-6 overflow-hidden'
							>
								<div className='self-stretch inline-flex justify-between items-center'>
									<div className="justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
										參加人員名單
									</div>
									{orderMembers.length <= 5 && (
										<div
											data-state='Default'
											data-type='Stroke_Blue+Icon'
											className='pl-1 pr-3 py-px rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-end items-center overflow-hidden'
										>
											<div data-svg-wrapper>
												<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path d='M7 12H17M12 7L12 17' stroke='#0F72ED' stroke-width='1.4' stroke-linecap='round' />
												</svg>
											</div>
											<div className="text-center justify-start text-blue-600 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
												新增參加人員
											</div>
										</div>
									)}
								</div>
								<div className='self-stretch flex flex-col justify-start items-start gap-4'>
									<div
										data-property-1='Info'
										className='self-stretch pr-1 py-[3px] bg-sky-100 rounded-lg inline-flex justify-start items-center'
									>
										<div className='self-stretch pl-3 pr-2 py-1.5 flex justify-start items-start'>
											<div data-svg-wrapper className='relative'>
												<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path
														d='M11 8C11 8.55229 11.4477 9 12 9C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8Z'
														fill='#0F72ED'
													/>
													<path
														d='M11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16Z'
														fill='#0F72ED'
													/>
													<path
														fill-rule='evenodd'
														clip-rule='evenodd'
														d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5Z'
														fill='#0F72ED'
													/>
												</svg>
											</div>
										</div>
										<div className='flex-1 pr-2 py-1.5 inline-flex flex-col justify-center items-start gap-1'>
											<div className="self-stretch justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
												點擊「加入」按鈕，將親友加入參加人員名單 ;
												若親友還未註冊成為CitySki會員，可點擊「邀請加入會員」按鈕，邀請親友加入
											</div>
										</div>
									</div>
								</div>
								<div className='self-stretch flex flex-col justify-start items-start gap-3'>
									<div className='self-stretch flex flex-col justify-start items-start gap-2'>
										<div
											data-owner-icon='false'
											data-property-1='Adult Slot'
											data-remove-button='false'
											data-reservation='true'
											className='self-stretch h-20 pl-3 pr-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center gap-3'
										>
											<div className='w-14 h-14 relative'>
												<div data-svg-wrapper data-property-1='Adult' className='left-[3px] top-[3px] absolute'>
													<svg
														width='54'
														height='54'
														viewBox='0 0 54 54'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<g clip-path='url(#clip0_10617_4184)'>
															<path
																d='M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27Z'
																fill='#E4F1FC'
															/>
															<g opacity='0.3'>
																<path
																	d='M25.7973 16.0525C21.9559 16.2489 19.2559 17.2061 19.1454 17.7707H19.1577V21.3911C19.3418 21.8207 22.1891 23.453 23.8459 23.453C24.0054 23.367 24.1404 23.232 24.2754 23.0725C24.9136 22.2257 25.245 21.8207 25.5886 21.5507C26.0673 21.1948 26.5827 21.0107 27.0614 21.0107C28.1733 21.0107 28.8291 21.8543 29.3806 22.5637C29.4013 22.5903 29.4218 22.6168 29.4423 22.643C29.4635 22.6705 29.4849 22.6983 29.5064 22.7263C29.8204 23.135 30.1591 23.5757 30.4118 23.5757C30.5959 23.5143 32.265 22.9252 32.7191 22.7411C34.9773 21.7593 34.9773 21.6734 34.8914 19.7711C34.8914 19.5871 34.8866 19.3924 34.8815 19.1853C34.8703 18.7295 34.8576 18.2142 34.8914 17.6234L34.8668 17.5743C34.5968 17.0957 31.455 16.0525 26.4723 16.0525H25.7973Z'
																	fill='#2E7BBE'
																/>
																<path
																	fill-rule='evenodd'
																	clip-rule='evenodd'
																	d='M26.6745 6.90558C26.5201 6.90662 26.3667 6.91192 26.2145 6.9216C22.14 7.24069 18.4459 10.6525 17.8814 14.6902C17.8604 14.7231 17.7638 14.7334 17.626 14.7481C17.198 14.7938 16.3734 14.8817 16.1877 15.8193C16.1386 16.1384 16.1386 22.2748 16.1877 22.6061C16.3488 23.5141 16.9555 23.6532 17.4605 23.6515C17.5958 23.652 17.7241 23.6419 17.835 23.6332C17.9141 23.6271 17.9844 23.6216 18.0418 23.6211C18.1044 23.6216 18.1509 23.629 18.1759 23.6493C19.567 28.9981 22.3085 32.1269 25.2646 33.0222C29.3793 34.2795 33.9128 31.2066 35.7995 23.7598C35.8612 23.6796 35.9779 23.6583 36.1263 23.6578C36.1989 23.658 36.2788 23.6629 36.3633 23.6681C36.4632 23.6742 36.5695 23.6806 36.6779 23.6804C37.0408 23.6812 37.4289 23.6092 37.6773 23.1952C37.8859 22.8516 37.9964 16.3839 37.8614 15.7457V15.7702C37.6938 14.9993 37.1199 14.9207 36.6946 14.8624C36.497 14.8354 36.3315 14.8127 36.2536 14.7271C36.2097 14.68 36.1602 14.4992 36.0849 14.2239C35.8652 13.4217 35.4259 11.8171 34.2654 10.3825C32.5653 8.23983 29.4618 6.88166 26.6745 6.90558ZM24.6682 24.582C24.4718 24.717 24.1773 24.7661 23.8336 24.7661C21.8823 24.7661 18.0777 22.8884 17.8323 21.5261C17.8077 21.3175 17.8077 17.7216 17.8323 17.5375C18.2618 15.1566 24.9627 14.7761 25.7359 14.7516H26.46C26.8404 14.7516 35.6891 14.7884 36.1923 17.4639C36.1754 18.0888 36.1817 18.6265 36.1873 19.1011C36.1899 19.3162 36.1923 19.5184 36.1923 19.7098C36.2782 21.8207 36.3027 22.6061 33.2223 23.9684L33.2468 23.9439C32.9032 24.1034 30.78 24.8889 30.4609 24.9134H30.4118C29.4791 24.9134 28.89 24.1402 28.3745 23.4407C28.3513 23.4101 28.3281 23.3796 28.3051 23.3492C27.9034 22.8192 27.5373 22.3361 27.0614 22.3361C26.8404 22.3361 26.6318 22.422 26.3864 22.6061C26.1777 22.7657 25.7973 23.2443 25.4782 23.6739C25.1468 24.1034 24.8523 24.4716 24.6682 24.582Z'
																	fill='#2E7BBE'
																/>
																<path d='M48.06 46.3416L48.0576 46.3322L48.06 46.3293V46.3416Z' fill='#2E7BBE' />
																<path
																	d='M48.0576 46.3322C46.6701 40.7913 43.9564 38.0684 36.0327 35.5661C35.8241 34.5966 34.9282 30.9516 33.6764 30.9516L33.6518 30.9271C33.2345 30.9271 32.9956 31.3417 32.767 31.7385C32.646 31.9484 32.5279 32.1534 32.3877 32.2893C29.7614 35.0016 25.7114 35.5293 22.6309 33.173C21.9216 32.6055 21.3712 31.8282 21.0491 31.3733C20.8974 31.1591 20.7964 31.0164 20.7532 31.0007C19.2812 30.4838 18.4368 33.8555 18.0975 35.2104C18.0663 35.335 18.0391 35.4435 18.0164 35.5293C9.84272 38.1311 7.33908 40.7207 5.97681 46.3784C10.7509 52.3061 17.9795 56.1598 26.1164 56.4175L26.1654 39.4443L27.7241 39.3093L27.8959 56.4175C36.0437 56.1475 43.2835 52.2829 48.0576 46.3322Z'
																	fill='#2E7BBE'
																/>
															</g>
														</g>
														<defs>
															<clipPath id='clip0_10617_4184'>
																<path
																	d='M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27Z'
																	fill='white'
																/>
															</clipPath>
														</defs>
													</svg>
												</div>
											</div>
											<div className='flex-1 inline-flex flex-col justify-center items-start'>
												<div className='self-stretch inline-flex justify-start items-center gap-2'>
													<div className='justify-start'>
														<span className="text-zinc-500 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															參加人員
														</span>
														<span className="text-zinc-500 text-base font-medium font-['Poppins'] leading-6">1</span>
													</div>
												</div>
												<div className="self-stretch h-6 justify-center text-neutral-400 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
													成人
												</div>
											</div>
											<div className='flex justify-start items-center gap-2'>
												<div
													data-state='Default'
													data-type='Primary_Rounded'
													className='px-3 py-2 bg-blue-600 rounded-[20px] flex justify-center items-center gap-2.5 overflow-hidden'
												>
													<div className="text-center justify-start text-white text-xs font-medium font-['Noto_Sans_TC'] leading-5">
														加入
													</div>
												</div>
												<div
													data-state='Default'
													data-type='Stroke_Blue'
													className='px-3 py-2 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 flex justify-center items-center gap-0.5 overflow-hidden'
												>
													<div className="text-center justify-start text-blue-600 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
														邀請加入會員
													</div>
												</div>
											</div>
										</div>
										<div
											data-owner-icon='false'
											data-property-1='Adult Slot'
											data-remove-button='false'
											data-reservation='true'
											className='self-stretch h-20 pl-3 pr-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center gap-3'
										>
											<div className='w-14 h-14 relative'>
												<div data-svg-wrapper data-property-1='Adult' className='left-[3px] top-[3px] absolute'>
													<svg
														width='54'
														height='54'
														viewBox='0 0 54 54'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<g clip-path='url(#clip0_10617_4199)'>
															<path
																d='M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27Z'
																fill='#E4F1FC'
															/>
															<g opacity='0.3'>
																<path
																	d='M25.7973 16.0525C21.9559 16.2489 19.2559 17.2061 19.1454 17.7707H19.1577V21.3911C19.3418 21.8207 22.1891 23.453 23.8459 23.453C24.0054 23.367 24.1404 23.232 24.2754 23.0725C24.9136 22.2257 25.245 21.8207 25.5886 21.5507C26.0673 21.1948 26.5827 21.0107 27.0614 21.0107C28.1733 21.0107 28.8291 21.8543 29.3806 22.5637C29.4013 22.5903 29.4218 22.6168 29.4423 22.643C29.4635 22.6705 29.4849 22.6983 29.5064 22.7263C29.8204 23.135 30.1591 23.5757 30.4118 23.5757C30.5959 23.5143 32.265 22.9252 32.7191 22.7411C34.9773 21.7593 34.9773 21.6734 34.8914 19.7711C34.8914 19.5871 34.8866 19.3924 34.8815 19.1853C34.8703 18.7295 34.8576 18.2142 34.8914 17.6234L34.8668 17.5743C34.5968 17.0957 31.455 16.0525 26.4723 16.0525H25.7973Z'
																	fill='#2E7BBE'
																/>
																<path
																	fill-rule='evenodd'
																	clip-rule='evenodd'
																	d='M26.6745 6.90558C26.5201 6.90662 26.3667 6.91192 26.2145 6.9216C22.14 7.24069 18.4459 10.6525 17.8814 14.6902C17.8604 14.7231 17.7638 14.7334 17.626 14.7481C17.198 14.7938 16.3734 14.8817 16.1877 15.8193C16.1386 16.1384 16.1386 22.2748 16.1877 22.6061C16.3488 23.5141 16.9555 23.6532 17.4605 23.6515C17.5958 23.652 17.7241 23.6419 17.835 23.6332C17.9141 23.6271 17.9844 23.6216 18.0418 23.6211C18.1044 23.6216 18.1509 23.629 18.1759 23.6493C19.567 28.9981 22.3085 32.1269 25.2646 33.0222C29.3793 34.2795 33.9128 31.2066 35.7995 23.7598C35.8612 23.6796 35.9779 23.6583 36.1263 23.6578C36.1989 23.658 36.2788 23.6629 36.3633 23.6681C36.4632 23.6742 36.5695 23.6806 36.6779 23.6804C37.0408 23.6812 37.4289 23.6092 37.6773 23.1952C37.8859 22.8516 37.9964 16.3839 37.8614 15.7457V15.7702C37.6938 14.9993 37.1199 14.9207 36.6946 14.8624C36.497 14.8354 36.3315 14.8127 36.2536 14.7271C36.2097 14.68 36.1602 14.4992 36.0849 14.2239C35.8652 13.4217 35.4259 11.8171 34.2654 10.3825C32.5653 8.23983 29.4618 6.88166 26.6745 6.90558ZM24.6682 24.582C24.4718 24.717 24.1773 24.7661 23.8336 24.7661C21.8823 24.7661 18.0777 22.8884 17.8323 21.5261C17.8077 21.3175 17.8077 17.7216 17.8323 17.5375C18.2618 15.1566 24.9627 14.7761 25.7359 14.7516H26.46C26.8404 14.7516 35.6891 14.7884 36.1923 17.4639C36.1754 18.0888 36.1817 18.6265 36.1873 19.1011C36.1899 19.3162 36.1923 19.5184 36.1923 19.7098C36.2782 21.8207 36.3027 22.6061 33.2223 23.9684L33.2468 23.9439C32.9032 24.1034 30.78 24.8889 30.4609 24.9134H30.4118C29.4791 24.9134 28.89 24.1402 28.3745 23.4407C28.3513 23.4101 28.3281 23.3796 28.3051 23.3492C27.9034 22.8192 27.5373 22.3361 27.0614 22.3361C26.8404 22.3361 26.6318 22.422 26.3864 22.6061C26.1777 22.7657 25.7973 23.2443 25.4782 23.6739C25.1468 24.1034 24.8523 24.4716 24.6682 24.582Z'
																	fill='#2E7BBE'
																/>
																<path d='M48.06 46.3416L48.0576 46.3322L48.06 46.3293V46.3416Z' fill='#2E7BBE' />
																<path
																	d='M48.0576 46.3322C46.6701 40.7913 43.9564 38.0684 36.0327 35.5661C35.8241 34.5966 34.9282 30.9516 33.6764 30.9516L33.6518 30.9271C33.2345 30.9271 32.9956 31.3417 32.767 31.7385C32.646 31.9484 32.5279 32.1534 32.3877 32.2893C29.7614 35.0016 25.7114 35.5293 22.6309 33.173C21.9216 32.6055 21.3712 31.8282 21.0491 31.3733C20.8974 31.1591 20.7964 31.0164 20.7532 31.0007C19.2812 30.4838 18.4368 33.8555 18.0975 35.2104C18.0663 35.335 18.0391 35.4435 18.0164 35.5293C9.84272 38.1311 7.33908 40.7207 5.97681 46.3784C10.7509 52.3061 17.9795 56.1598 26.1164 56.4175L26.1654 39.4443L27.7241 39.3093L27.8959 56.4175C36.0437 56.1475 43.2835 52.2829 48.0576 46.3322Z'
																	fill='#2E7BBE'
																/>
															</g>
														</g>
														<defs>
															<clipPath id='clip0_10617_4199'>
																<path
																	d='M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27Z'
																	fill='white'
																/>
															</clipPath>
														</defs>
													</svg>
												</div>
											</div>
											<div className='flex-1 inline-flex flex-col justify-center items-start'>
												<div className='self-stretch inline-flex justify-start items-center gap-2'>
													<div className='justify-start'>
														<span className="text-zinc-500 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															參加人員
														</span>
														<span className="text-zinc-500 text-base font-medium font-['Poppins'] leading-6">2</span>
													</div>
												</div>
												<div className="self-stretch h-6 justify-center text-neutral-400 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
													成人
												</div>
											</div>
											<div className='flex justify-start items-center gap-2'>
												<div
													data-state='Default'
													data-type='Primary_Rounded'
													className='px-3 py-2 bg-blue-600 rounded-[20px] flex justify-center items-center gap-2.5 overflow-hidden'
												>
													<div className="text-center justify-start text-white text-xs font-medium font-['Noto_Sans_TC'] leading-5">
														加入
													</div>
												</div>
												<div
													data-state='Default'
													data-type='Stroke_Blue'
													className='px-3 py-2 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 flex justify-center items-center gap-0.5 overflow-hidden'
												>
													<div className="text-center justify-start text-blue-600 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
														邀請加入會員
													</div>
												</div>
											</div>
										</div>
										<div
											data-owner-icon='false'
											data-property-1='Children Slot'
											data-remove-button='false'
											data-reservation='true'
											className='self-stretch h-20 pl-3 pr-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center gap-3'
										>
											<div className='w-14 h-14 relative'>
												<div data-svg-wrapper data-property-1='Children' className='left-[3px] top-[3px] absolute'>
													<svg
														width='54'
														height='54'
														viewBox='0 0 54 54'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<g clip-path='url(#clip0_10617_4214)'>
															<path
																d='M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27Z'
																fill='#E4F1FC'
															/>
															<g opacity='0.3'>
																<path
																	d='M35.4436 40.5615L35.4191 40.6228L35.3823 40.6351C40.2668 41.8378 43.2982 50.036 44.3904 54.491C44.4232 54.5892 44.445 54.6765 44.4668 54.7637C44.4777 54.8074 44.4886 54.851 44.5009 54.896C40.0459 58.7128 34.3268 61.106 28.0554 61.3515L28.0063 44.8201C27.2823 44.9551 26.73 44.9306 26.1163 44.7587C26.1409 48.7719 26.1777 56.7492 26.19 61.3515C19.8082 61.1797 13.9909 58.7865 9.46225 54.9206C9.47889 54.854 9.49303 54.7874 9.50692 54.722C9.52376 54.6427 9.54026 54.565 9.56043 54.491C10.1373 52.0978 10.7877 49.6678 11.9904 47.5201C12.2727 47.0169 14.5554 43.556 14.8377 43.2247C16.1976 41.6109 17.6914 41.0687 18.4139 40.8065C18.6694 40.7137 18.8284 40.656 18.8509 40.5983C17.9672 39.8742 18.63 38.0333 19.2191 37.3337C19.2221 37.3304 19.2251 37.3271 19.2281 37.3239C20.5283 38.5455 23.2843 40.5098 25.7201 40.9063C28.2623 41.3202 32.1772 39.9873 35.0044 37.294C35.6382 38.1937 36.3 39.81 35.4436 40.5615Z'
																	fill='#2E7BBE'
																/>
																<path
																	d='M35.0632 29.1356C35.0632 28.3929 34.8774 27.944 34.6264 27.6478C34.4492 27.4269 34.2363 27.2888 34.0323 27.1842L34.0936 27.2456C33.0627 26.7178 30.105 26.3251 27.0982 26.3251C23.6863 26.3251 20.7041 26.8037 19.845 27.4665C19.3541 27.8592 19.3173 28.1169 19.2927 29.1724C19.2927 29.516 19.2927 29.8228 19.3541 30.1542C19.44 30.6083 19.5504 30.9151 19.7713 31.1606C19.7887 31.1809 19.8079 31.2014 19.8289 31.2221C20.4004 31.8028 22.3894 32.5106 23.8213 32.5106C24.2386 32.5106 24.4104 32.4492 24.435 32.4247C24.435 32.4247 24.57 32.2283 24.6559 32.0565C25.1591 31.3324 25.8832 30.326 27.135 30.326C27.6627 30.326 28.1904 30.5224 28.6936 30.9151C28.7754 30.979 28.8497 31.0455 28.9177 31.1131C29.1244 31.3211 29.2718 31.5377 29.3921 31.7145C29.4181 31.7528 29.4429 31.7892 29.4668 31.8233C29.5871 32.0206 29.6772 32.1669 29.7844 32.2719C29.9529 32.4439 30.1601 32.5106 30.5959 32.5106C31.1236 32.5106 31.8477 32.3756 32.7436 32.0933C33.3818 31.8969 34.2163 31.4551 34.4741 31.1728C34.695 30.9274 34.8423 30.5837 34.9527 30.0806C35.0141 29.7983 35.0632 29.3319 35.0632 29.1356Z'
																	fill='#2E7BBE'
																/>
																<path
																	fill-rule='evenodd'
																	clip-rule='evenodd'
																	d='M33.8167 36.7182C34.5794 35.6945 35.198 34.5255 35.4682 33.4801C37.0513 33.3942 37.7263 30.4978 37.7018 29.1356C37.7018 29.0497 37.7018 28.9147 37.6404 28.8042C38.6468 28.2151 39.15 27.2456 38.9536 26.0674C38.8923 25.7851 38.8186 25.5642 38.7082 25.3433L38.7161 25.2403C38.7393 24.9448 38.7631 24.6412 38.7082 24.0915C38.34 20.7778 35.64 13.6351 27.0245 13.6351C19.0227 13.5737 15.7582 20.0169 15.6232 23.981V24.7665L15.626 24.7636C15.4951 24.9396 15.4145 25.1125 15.3654 25.2697C15.12 26.5828 15.5372 28.1169 16.5927 28.841V29.1478C16.5682 30.6206 17.1204 33.3328 18.7404 33.4924C19.0616 34.7296 19.7057 35.8169 20.4826 36.799C21.763 37.8898 23.9988 39.3827 25.9173 39.695C27.9896 40.0324 31.3045 38.9346 33.8167 36.7182ZM30.645 34.0201V34.0447H30.6573C31.3568 34.0447 32.2159 33.8728 33.2468 33.566C33.8604 33.3697 35.0632 32.8419 35.6154 32.2283C36.0327 31.7742 36.315 31.1974 36.45 30.4119L36.4562 30.3698C36.506 30.0344 36.585 29.5024 36.585 29.1847C36.6218 27.6628 36.0082 26.5706 34.8054 25.9569C33.5168 25.2819 30.51 24.8647 27.1104 24.8647C25.6377 24.8647 20.7041 24.9506 18.9491 26.3128C17.8322 27.1719 17.8322 28.1537 17.8322 29.1847C17.8322 29.6019 17.8568 29.9947 17.9182 30.4119C18.0286 31.136 18.2495 31.6637 18.6668 32.1424C19.5872 33.1978 22.1768 33.9833 23.8459 33.9833C24.435 33.9833 24.8768 33.9097 25.1836 33.7378C25.4536 33.5783 25.6868 33.2715 25.9323 32.9033C26.2636 32.4001 26.6809 31.8478 27.1595 31.8478C27.3559 31.8478 27.5891 31.9337 27.8345 32.1301C27.9941 32.2406 28.1413 32.4615 28.2763 32.6824L28.3008 32.7191C28.6888 33.3021 29.1666 34.0201 30.645 34.0201Z'
																	fill='#2E7BBE'
																/>
															</g>
														</g>
														<defs>
															<clipPath id='clip0_10617_4214'>
																<path
																	d='M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27Z'
																	fill='white'
																/>
															</clipPath>
														</defs>
													</svg>
												</div>
											</div>
											<div className='flex-1 inline-flex flex-col justify-center items-start'>
												<div className='self-stretch inline-flex justify-start items-center gap-2'>
													<div className='justify-start'>
														<span className="text-zinc-500 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															參加人員
														</span>
														<span className="text-zinc-500 text-base font-medium font-['Poppins'] leading-6">3</span>
													</div>
												</div>
												<div className="self-stretch h-6 justify-center text-neutral-400 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
													青少年/兒童
												</div>
											</div>
											<div className='flex justify-start items-center gap-2'>
												<div
													data-state='Default'
													data-type='Primary_Rounded'
													className='px-3 py-2 bg-blue-600 rounded-[20px] flex justify-center items-center gap-2.5 overflow-hidden'
												>
													<div className="text-center justify-start text-white text-xs font-medium font-['Noto_Sans_TC'] leading-5">
														加入
													</div>
												</div>
												<div
													data-state='Default'
													data-type='Stroke_Blue'
													className='px-3 py-2 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 flex justify-center items-center gap-0.5 overflow-hidden'
												>
													<div className="text-center justify-start text-blue-600 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
														代辦註冊會員
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='self-stretch px-8 pt-6 pb-8 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-6'>
								<div className='self-stretch flex flex-col justify-start items-start gap-9'>
									<div className='self-stretch flex flex-col justify-start items-end gap-6'>
										<div className="self-stretch justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
											注意事項
										</div>
										<div className='self-stretch flex flex-col justify-start items-start gap-3'>
											<div className='self-stretch h-44 inline-flex justify-start items-start gap-3'>
												<div className='flex-1 self-stretch px-6 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start gap-3'>
													<div data-svg-wrapper className='relative'>
														<svg
															width='24'
															height='24'
															viewBox='0 0 24 24'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M13.2215 21.4558C12.8135 21.5038 12.3935 21.5278 11.9975 21.5278C6.74153 21.5278 2.45753 17.2438 2.45753 11.9878C2.45753 6.73179 6.74153 2.45979 11.9975 2.45979C17.2535 2.45979 21.5375 6.74379 21.5375 11.9998C21.5375 12.3598 21.5135 12.7198 21.4775 13.0798C21.4295 13.5358 21.7535 13.9558 22.2215 14.0038C22.6895 14.0518 23.0975 13.7278 23.1455 13.2598C23.1935 12.8398 23.2175 12.4198 23.2175 11.9878C23.2175 5.80779 18.1775 0.779785 11.9975 0.779785C5.81753 0.779785 0.777527 5.80779 0.777527 11.9998C0.777527 18.1918 5.80553 23.2198 11.9975 23.2198C12.4775 23.2198 12.9575 23.1838 13.4375 23.1238C13.8935 23.0638 14.2295 22.6438 14.1695 22.1878C14.1095 21.7318 13.7015 21.4078 13.2335 21.4558H13.2215Z'
																fill='#2B2B2B'
															/>
															<path
																d='M11.1575 6.33579V11.6518L8.36153 14.4478C8.03753 14.7718 8.03753 15.3118 8.36153 15.6358C8.52953 15.8038 8.74553 15.8878 8.96153 15.8878C9.17753 15.8878 9.39353 15.8038 9.56153 15.6358L12.6095 12.5878C12.7655 12.4318 12.8615 12.2158 12.8615 11.9878V6.32379C12.8615 5.85579 12.4895 5.48379 12.0215 5.48379C11.5535 5.48379 11.1815 5.85579 11.1815 6.32379L11.1575 6.33579Z'
																fill='#2B2B2B'
															/>
															<path
																d='M21.7295 15.4678L17.4575 20.6278L15.0575 18.3478C14.7215 18.0358 14.1935 18.0358 13.8695 18.3718C13.5455 18.7078 13.5575 19.2358 13.8935 19.5598L16.9535 22.4638C17.1095 22.6078 17.3135 22.6918 17.5295 22.6918C17.5415 22.6918 17.5655 22.6918 17.5775 22.6918C17.8055 22.6798 18.0215 22.5718 18.1775 22.3918L23.0255 16.5478C23.3255 16.1878 23.2775 15.6598 22.9175 15.3598C22.5695 15.0598 22.0295 15.1078 21.7295 15.4678Z'
																fill='#2B2B2B'
															/>
														</svg>
													</div>
													<div className='self-stretch flex flex-col justify-start items-start gap-1.5'>
														<div className='self-stretch justify-start'>
															<span className="text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
																請提早
															</span>
															<span className="text-zinc-800 text-base font-medium font-['Poppins'] leading-6">5</span>
															<span className="text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
																分鐘報到
															</span>
														</div>
														<div className='self-stretch justify-start'>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																課程於整點開始上課，請提早
															</span>
															<span className="text-zinc-500 text-base font-normal font-['Poppins'] leading-6">5</span>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																分鐘報到並穿著裝備及暖身完畢。如因個人因素遲到而無法跟上課程進度，恕不負責請見諒。
															</span>
														</div>
													</div>
												</div>
												<div className='flex-1 self-stretch px-6 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start gap-3'>
													<div data-svg-wrapper className='relative'>
														<svg
															width='24'
															height='24'
															viewBox='0 0 24 24'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M22.956 18.7382C22.344 16.5542 20.172 14.2262 17.484 13.6862C19.02 13.1942 20.136 11.7662 20.136 10.0742C20.136 7.9742 18.432 6.2702 16.332 6.2702C14.232 6.2702 12.528 7.9742 12.528 10.0742C12.528 11.7662 13.656 13.1942 15.192 13.6862C14.832 13.7582 14.484 13.8662 14.148 13.9982C13.392 11.9462 11.352 9.87019 8.83202 9.36619C10.368 8.87419 11.484 7.4462 11.484 5.7542C11.484 3.6542 9.78002 1.9502 7.68002 1.9502C5.58002 1.9502 3.87602 3.6542 3.87602 5.7542C3.87602 7.4462 5.00402 8.87419 6.54002 9.36619C3.85202 9.90619 1.68002 12.2342 1.06802 14.4182C0.804019 15.3302 0.744019 16.5182 0.744019 16.8662C0.744019 17.0942 0.828019 17.3102 0.984019 17.4782C1.14002 17.6462 1.35602 17.7302 1.58402 17.7302H10.104C9.93602 18.0662 9.80402 18.4022 9.70802 18.7382C9.45602 19.6622 9.40802 20.8502 9.39602 21.1862C9.39602 21.4142 9.48002 21.6302 9.63602 21.7982C9.79202 21.9662 10.008 22.0502 10.236 22.0502H22.416C22.644 22.0502 22.86 21.9542 23.016 21.7982C23.172 21.6422 23.256 21.4142 23.256 21.1862C23.256 20.8502 23.196 19.6622 22.944 18.7382H22.956ZM14.196 10.0742C14.196 8.89819 15.156 7.95019 16.32 7.95019C17.484 7.95019 18.444 8.91019 18.444 10.0742C18.444 11.2382 17.484 12.1982 16.32 12.1982C15.156 12.1982 14.196 11.2382 14.196 10.0742ZM5.54402 5.7422C5.54402 4.5662 6.50402 3.6182 7.66802 3.6182C8.83202 3.6182 9.79202 4.5782 9.79202 5.7422C9.79202 6.9062 8.83202 7.86619 7.66802 7.86619C6.50402 7.86619 5.54402 6.9062 5.54402 5.7422ZM2.47202 16.0382C2.52002 15.5822 2.59202 15.1622 2.66402 14.8622C3.19202 12.9542 5.32802 10.9142 7.66802 10.9142C10.008 10.9142 12.084 12.9062 12.648 14.8022C12.12 15.1622 11.64 15.5822 11.232 16.0382H2.47202ZM11.136 20.3702C11.184 19.9142 11.256 19.4942 11.328 19.1942C11.856 17.2862 13.992 15.2462 16.332 15.2462C18.672 15.2462 20.808 17.2862 21.336 19.1942C21.42 19.4942 21.492 19.9142 21.54 20.3702H11.136Z'
																fill='#2B2B2B'
															/>
														</svg>
													</div>
													<div className='self-stretch flex flex-col justify-start items-start gap-1.5'>
														<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															依照學員程度教學
														</div>
														<div className="self-stretch justify-start text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
															建議同一梯次上課學員的上課程度要相同，如不相同，上課進度將會以最初學者的學員為優先教學。課程可以親子共學，但以小孩進度為主。
														</div>
													</div>
												</div>
											</div>
											<div className='self-stretch h-44 inline-flex justify-start items-start gap-3'>
												<div className='flex-1 self-stretch px-6 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start gap-3'>
													<div data-svg-wrapper className='relative'>
														<svg
															width='24'
															height='24'
															viewBox='0 0 24 24'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M20.31 10.6078C19.782 9.81579 19.506 8.89179 19.506 7.94379V4.00779C19.506 2.61579 18.378 1.48779 16.986 1.48779H7.01399C5.62199 1.48779 4.49399 2.61579 4.49399 4.00779V7.94379C4.49399 8.89179 4.21799 9.81579 3.68999 10.6078C2.98199 11.6758 2.59799 12.9238 2.59799 14.2078V20.1118C2.59799 21.4318 3.67799 22.5118 4.99799 22.5118H19.002C20.322 22.5118 21.402 21.4318 21.402 20.1118V14.2078C21.402 12.9238 21.03 11.6758 20.31 10.6078ZM11.994 6.93579L9.78599 3.16779H14.202L11.994 6.93579ZM4.27799 20.0998V16.4398H8.71799C9.18599 16.4398 9.55799 16.0678 9.55799 15.5998C9.55799 15.1318 9.18599 14.7598 8.71799 14.7598H4.27799V14.1958C4.27799 13.2478 4.55399 12.3238 5.08199 11.5318C5.78999 10.4638 6.17399 9.22779 6.17399 7.93179V3.99579C6.17399 3.52779 6.54599 3.15579 7.01399 3.15579H7.84199L11.154 8.81979V20.8078H4.99799C4.60199 20.8078 4.27799 20.4838 4.27799 20.0878V20.0998ZM19.002 20.8198H12.846V8.83179L16.158 3.16779H16.986C17.454 3.16779 17.826 3.53979 17.826 4.00779V7.94379C17.826 9.22779 18.198 10.4638 18.918 11.5438C19.446 12.3358 19.722 13.2598 19.722 14.2078V14.7718H15.282C14.814 14.7718 14.442 15.1438 14.442 15.6118C14.442 16.0798 14.814 16.4518 15.282 16.4518H19.722V20.1118C19.722 20.5078 19.398 20.8318 19.002 20.8318V20.8198Z'
																fill='#2B2B2B'
															/>
														</svg>
													</div>
													<div className='self-stretch flex flex-col justify-start items-start gap-1.5'>
														<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															穿著輕便運動服裝
														</div>
														<div className='self-stretch justify-start'>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																室內為一般冷氣房(約
															</span>
															<span className="text-zinc-500 text-base font-normal font-['Poppins'] leading-6">
																21-24℃
															</span>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																)，穿著輕便運動服裝即可，請勿穿著牛仔褲，會不好伸展噢！
															</span>
														</div>
													</div>
												</div>
												<div className='flex-1 self-stretch px-6 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start gap-3'>
													<div data-svg-wrapper className='relative'>
														<svg
															width='24'
															height='24'
															viewBox='0 0 24 24'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M19.917 1.16406H15.321C14.877 1.16406 14.457 1.30806 14.109 1.57206C13.773 1.32006 13.353 1.16406 12.897 1.16406H8.30099C7.17299 1.16406 6.26099 2.07606 6.26099 3.20406V11.5201L3.21299 14.5801C1.32899 16.4641 1.32899 19.5361 3.21299 21.4201C4.12499 22.3321 5.33699 22.8361 6.63299 22.8361C7.92899 22.8361 9.14099 22.3321 10.053 21.4201L10.137 21.3361C10.137 21.3361 10.185 21.3961 10.209 21.4201C11.121 22.3321 12.345 22.8361 13.629 22.8361C14.913 22.8361 16.137 22.3321 17.049 21.4201L19.929 18.5521C21.225 17.2561 21.933 15.5401 21.933 13.7161V3.20406C21.933 2.07606 21.021 1.16406 19.893 1.16406H19.917ZM15.069 2.95206C15.069 2.95206 15.189 2.84406 15.321 2.84406H19.917C20.121 2.84406 20.277 3.00006 20.277 3.20406V5.55606H14.973V3.20406C14.973 3.07206 15.033 2.98806 15.081 2.95206H15.069ZM8.31299 2.84406H12.909C13.113 2.84406 13.269 3.00006 13.269 3.20406V5.55606H7.96499V3.20406C7.96499 3.00006 8.12099 2.84406 8.32499 2.84406H8.31299ZM8.87699 20.2441C7.68899 21.4441 5.60099 21.4441 4.41299 20.2441C3.81299 19.6441 3.48899 18.8521 3.48899 18.0121C3.48899 17.1721 3.81299 16.3801 4.41299 15.7801L7.96499 12.2281V7.24806H13.269V11.5561L10.233 14.5921C8.79299 16.0321 8.45699 18.1561 9.21299 19.9201L8.87699 20.2561V20.2441ZM18.765 17.3641L15.885 20.2321C14.697 21.4321 12.609 21.4321 11.421 20.2321C10.821 19.6321 10.497 18.8401 10.497 18.0001C10.497 17.1601 10.821 16.3681 11.421 15.7681L14.973 12.2161V7.23606H20.277V13.7161C20.277 15.0961 19.737 16.3921 18.765 17.3641Z'
																fill='#2B2B2B'
															/>
														</svg>
													</div>
													<div className='self-stretch flex flex-col justify-start items-start gap-1.5'>
														<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															請自備長度至小腿的長襪
														</div>
														<div className='self-stretch justify-start'>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																因雪鞋(靴)為共用配備，衛生考量，請另自備長度至小腿的長襪到現場更換。如果未帶襪子，現場有代售一雙棉襪
															</span>
															<span className="text-zinc-500 text-base font-normal font-['Poppins'] leading-6">50</span>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																元、雪襪
															</span>
															<span className="text-zinc-500 text-base font-normal font-['Poppins'] leading-6">
																500
															</span>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																元。
															</span>
														</div>
													</div>
												</div>
											</div>
											<div className='self-stretch inline-flex justify-start items-start gap-3'>
												<div className='flex-1 h-44 px-6 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start gap-3'>
													<div data-svg-wrapper className='relative'>
														<svg
															width='24'
															height='24'
															viewBox='0 0 24 24'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M12 22.7372C6.98399 22.7372 3.73199 19.2452 3.73199 13.8572C3.73199 8.06118 11.136 1.72518 11.46 1.46118C11.772 1.19718 12.228 1.19718 12.54 1.46118C12.852 1.72518 20.268 8.07318 20.268 13.8572C20.268 19.2572 17.028 22.7372 12 22.7372ZM12 3.22518C10.332 4.76118 5.41199 9.66918 5.41199 13.8572C5.41199 18.3692 7.87199 21.0572 12 21.0572C16.128 21.0572 18.588 18.3692 18.588 13.8572C18.588 9.66918 13.668 4.77318 12 3.22518Z'
																fill='#2B2B2B'
															/>
														</svg>
													</div>
													<div className='self-stretch flex flex-col justify-start items-start gap-1.5'>
														<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															補充水分、自備毛巾
														</div>
														<div className="self-stretch justify-start text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
															課程中需隨時補充水分，請自備水壺及毛巾。
														</div>
													</div>
												</div>
												<div className='flex-1 h-44 px-6 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start gap-3'>
													<div data-svg-wrapper className='relative'>
														<svg
															width='24'
															height='24'
															viewBox='0 0 24 24'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M14.016 11.0278C14.556 10.4998 14.856 9.76781 14.856 9.01181C14.856 8.25581 14.556 7.53581 14.016 6.99581C13.488 6.46781 12.756 6.16781 12 6.16781C11.244 6.16781 10.524 6.46781 9.98402 6.99581C9.44402 7.52381 9.15602 8.25581 9.15602 9.01181C9.15602 9.76781 9.45602 10.4878 9.98402 11.0278C10.512 11.5678 11.244 11.8678 12 11.8678C12.756 11.8678 13.476 11.5678 14.016 11.0278ZM10.836 9.01181C10.836 8.69981 10.956 8.39981 11.172 8.18381C11.388 7.96781 11.688 7.84781 12 7.84781C12.312 7.84781 12.6 7.96781 12.828 8.19581C13.044 8.41181 13.164 8.71181 13.164 9.02381C13.164 9.33581 13.044 9.62381 12.816 9.85181C12.588 10.0798 12.3 10.1878 11.988 10.1878C11.676 10.1878 11.388 10.0678 11.16 9.83981C10.944 9.62381 10.824 9.32381 10.824 9.01181H10.836Z'
																fill='#2B2B2B'
															/>
															<path
																d='M14.532 17.8078L17.664 14.6758C18.78 13.5598 19.548 12.1318 19.86 10.5718C20.172 9.02381 20.016 7.40381 19.404 5.93981C18.792 4.47581 17.772 3.22781 16.452 2.35181C15.132 1.47581 13.584 1.00781 12 1.00781C10.416 1.00781 8.86802 1.47581 7.54802 2.35181C6.22802 3.22781 5.20802 4.48781 4.59602 5.93981C3.99602 7.41581 3.84002 9.02381 4.14002 10.5838C4.45202 12.1318 5.20802 13.5598 6.33602 14.6878L9.46802 17.8198C7.16402 18.0238 3.96002 18.6238 3.96002 20.3518C3.96002 22.8598 10.656 22.9918 12 22.9918C13.344 22.9918 20.04 22.8598 20.04 20.3518C20.04 18.6238 16.824 18.0238 14.532 17.8198V17.8078ZM5.79602 10.2478C5.55602 9.01181 5.67602 7.75181 6.15602 6.58781C6.63602 5.42381 7.44002 4.43981 8.48402 3.74381C9.52802 3.04781 10.74 2.67581 12 2.67581C13.26 2.67581 14.472 3.04781 15.516 3.74381C16.56 4.43981 17.364 5.42381 17.844 6.58781C18.324 7.75181 18.444 9.01181 18.204 10.2478C17.964 11.4838 17.364 12.5998 16.476 13.4878L12 17.9638L7.52402 13.4878C6.63602 12.5998 6.03602 11.4838 5.79602 10.2478ZM12 21.2998C8.65202 21.2998 6.51602 20.7358 5.82002 20.3398C6.44402 19.9918 8.22002 19.4998 11.064 19.4038L12 20.3398L12.972 19.3678C12.972 19.3678 13.068 19.4038 13.128 19.4038C15.984 19.5238 17.604 20.0158 18.18 20.3398C17.484 20.7358 15.348 21.2998 12 21.2998Z'
																fill='#2B2B2B'
															/>
														</svg>
													</div>
													<div className='self-stretch flex flex-col justify-start items-start gap-1.5'>
														<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
															學校位置、停車資訊
														</div>
														<div className="self-stretch justify-start text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
															停車場規劃複雜，地下室訊號不佳，如有停車需求請先看過停車資訊與影片。
														</div>
														<div className='inline-flex justify-start items-center gap-0.5'>
															<div className="justify-start text-blue-600 text-sm font-medium font-['Noto_Sans_TC'] leading-6">
																詳細資訊
															</div>
															<div data-svg-wrapper className='relative'>
																<svg
																	width='16'
																	height='16'
																	viewBox='0 0 16 16'
																	fill='none'
																	xmlns='http://www.w3.org/2000/svg'
																>
																	<path
																		d='M7 11.6665L10.3333 8.33317L7 4.99984'
																		stroke='#0F72ED'
																		stroke-width='1.5'
																		stroke-linecap='round'
																		stroke-linejoin='round'
																	/>
																</svg>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='self-stretch px-8 pt-6 pb-8 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-6'>
								<div className='w-full flex flex-col justify-start items-start gap-9'>
									<div className='self-stretch flex flex-col justify-start items-end gap-6'>
										<div className='self-stretch flex flex-col justify-start items-start gap-1'>
											<div className="self-stretch justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
												請假/改期辦法
											</div>
											<div className="justify-start text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
												經請假改期後的課程，恕不接受取消，未到將視同放棄。
											</div>
										</div>
										<div className='self-stretch flex flex-col justify-start items-start gap-1'>
											<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
												請假/改期截止時間
											</div>
											<div className='self-stretch flex flex-col justify-start items-start'>
												<div className='self-stretch py-3 border-b border-gray-200 inline-flex justify-start items-center gap-5'>
													<div className='w-32 flex justify-start items-center gap-1'>
														<div className="justify-start text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															課程前
														</div>
														<div className="justify-start text-neutral-700 text-xl font-medium font-['Poppins'] leading-7">
															7
														</div>
														<div className="justify-start text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															日以上
														</div>
													</div>
													<div className='w-60 self-stretch justify-center'>
														<span className="text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															可免費更改時段，以{' '}
														</span>
														<span className="text-neutral-700 text-sm font-normal font-['Poppins'] leading-6">1</span>
														<span className="text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															次為限。
														</span>
													</div>
												</div>
												<div className='self-stretch py-3 border-b border-gray-200 inline-flex justify-start items-center gap-5'>
													<div className='w-32 flex justify-start items-center gap-1'>
														<div className="justify-start text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															課程前
														</div>
														<div className="justify-start text-neutral-700 text-xl font-medium font-['Poppins'] leading-7">
															4-7
														</div>
														<div className="justify-start text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															日內
														</div>
													</div>
													<div className='justify-center'>
														<span className="text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															更改時段酌收時段費
														</span>
														<span className="text-neutral-700 text-sm font-normal font-['Poppins'] leading-6">300</span>
														<span className="text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															元/人，於上課當日繳交。
														</span>
													</div>
												</div>
												<div className='self-stretch py-3 border-b border-gray-200 inline-flex justify-start items-center gap-5'>
													<div className='w-32 flex justify-start items-center gap-1'>
														<div className="justify-start text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															課程前
														</div>
														<div className="justify-start text-neutral-700 text-xl font-medium font-['Poppins'] leading-7">
															3
														</div>
														<div className="justify-start text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															日內
														</div>
													</div>
													<div className='justify-center'>
														<span className="text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															更改時段酌收時段場地費
														</span>
														<span className="text-neutral-700 text-sm font-normal font-['Poppins'] leading-6">
															1,200
														</span>
														<span className="text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															元/人，於上課當日繳交。
														</span>
													</div>
												</div>
												<div className='self-stretch h-12 py-3 inline-flex justify-start items-center gap-5'>
													<div className='w-32 flex justify-start items-center gap-1'>
														<div className="justify-start text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															課程當日
														</div>
													</div>
													<div className="justify-center text-neutral-700 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
														臨時請假需出示醫師證明或報案三聯單。
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='self-stretch px-8 pt-6 pb-8 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-6'>
								<div className='self-stretch flex flex-col justify-start items-end gap-6'>
									<div className='self-stretch flex flex-col justify-start items-start gap-1'>
										<div className="self-stretch justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
											訂單取消辦法
										</div>
										<div className='justify-start'>
											<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												請參考
											</span>
											<span className="text-blue-600 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												課程約定事項
											</span>
											<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">。</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div
							data-property-1='Default'
							data-show-more='false'
							className='w-80 inline-flex flex-col justify-start items-start gap-6'
						>
							<div className='self-stretch p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-4 overflow-hidden'>
								<div className='self-stretch inline-flex justify-between items-center'>
									<div className="justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
										付款資料
									</div>
									<div
										data-property-1='Orange'
										className='px-2.5 py-1.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-red-400 flex justify-start items-center gap-1'
									>
										<div className="text-center justify-center text-red-400 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
											待付訂金
										</div>
									</div>
								</div>
								<div className='self-stretch flex flex-col justify-start items-start gap-5'>
									<div className='self-stretch flex flex-col justify-start items-start gap-2'>
										<div className='self-stretch flex flex-col justify-start items-start gap-2'>
											<div className='self-stretch inline-flex justify-between items-end'>
												<div className='inline-flex flex-col justify-center items-start gap-0.5'>
													<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
														訂單金額
													</div>
												</div>
												<div className='flex justify-start items-center gap-0.5'>
													<div className="justify-start text-zinc-800 text-base font-medium font-['Poppins'] leading-6">
														20,400
													</div>
													<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
														元
													</div>
												</div>
											</div>
										</div>
										<div className='self-stretch flex flex-col justify-start items-start gap-2'>
											<div className='self-stretch inline-flex justify-between items-end'>
												<div className='inline-flex flex-col justify-center items-start gap-0.5'>
													<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
														優惠折扣
													</div>
												</div>
												<div className='flex justify-start items-center gap-0.5'>
													<div className="justify-start text-emerald-600 text-base font-medium font-['Poppins'] leading-6">
														-100
													</div>
													<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
														元
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='self-stretch flex flex-col justify-start items-start gap-5'>
										<div className='self-stretch pt-4 border-t border-gray-200 inline-flex justify-end items-center gap-2'>
											<div className='flex justify-start items-center gap-2'>
												<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
													總計
												</div>
												<div className='flex justify-start items-center gap-0.5'>
													<div className="justify-start text-zinc-800 text-2xl font-semibold font-['Poppins'] leading-7">
														20,300
													</div>
													<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
														元
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='self-stretch flex flex-col justify-start items-end gap-3'>
								<div className='self-stretch p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-4 overflow-hidden'>
									<div className="self-stretch justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
										訂單基本資料
									</div>
									<div className='self-stretch flex flex-col justify-start items-start gap-2'>
										<div className='self-stretch inline-flex justify-between items-end'>
											<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												訂購人
											</div>
											<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
												李大名
											</div>
										</div>
										<div className='self-stretch inline-flex justify-between items-end'>
											<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												訂單編號
											</div>
											<div className="justify-start text-zinc-800 text-base font-medium font-['Poppins'] leading-6">
												G2837739BN
											</div>
										</div>
										<div className='self-stretch inline-flex justify-between items-end'>
											<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												訂購日期
											</div>
											<div className="justify-start text-zinc-800 text-base font-medium font-['Poppins'] leading-6">
												2024/9/28
											</div>
										</div>
									</div>
								</div>
								<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] underline leading-6">
									申請取消訂單
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
