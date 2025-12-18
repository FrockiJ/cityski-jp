'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { CoursePlanResponseDTO, CourseType, Department, GetCourseDetailResponseDTO } from '@repo/shared';
import { CircleCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { OrderFormData } from '@/components/Project/Courses/CourseDetail/CourseBookingForm';
import Button from '@/components/Project/Shared/Common/Button';
import { selectToken } from '@/state/slices/authSlice';


const courseTypeMap = {
	[CourseType.GROUP]: '團體班教學',
	[CourseType.PRIVATE]: '私人班教學',
	[CourseType.INDIVIDUAL]: '個人練習',
};

const CourseDetailPage = () => {
	const router = useRouter();
	const accessToken = useSelector(selectToken);

	const [courseDetail, setCourseDetail] = useState<GetCourseDetailResponseDTO>();
	const [department, setDepartment] = useState<Department | null>(null);
	const [formData, setFormData] = useState<OrderFormData>();
	const [plan, setPlan] = useState<CoursePlanResponseDTO>();
	const [images, setImages] = useState<string[]>();
	const [orderId, setOrderId] = useState<string | null>(null);
	const [orderNo, setOrderNo] = useState<string | null>(null);
	const [transactionStatus, setTransactionStatus] = useState<number | null>(null);
	const [balanceAmount, setBalanceAmount] = useState<number>(0);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit' | 'atm' | null>(null);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	// 獲取訂單詳情（包括交易狀態和尾款金額）
	const fetchOrderDetails = async (orderNumber: string) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderNumber}`);
			if (!response.ok) {
				console.error('Failed to fetch order details');
				return;
			}
			const data = await response.json();
			if (data.result?.transaction) {
				setTransactionStatus(data.result.transaction.status);
				setBalanceAmount(data.result.transaction.balanceAmt || 0);
			}
		} catch (error) {
			console.error('Error fetching order details:', error);
		}
	};

	// 根據交易狀態返回狀態標籤
	const getStatusLabel = () => {
		if (transactionStatus === 0) return '待訂金';
		if (transactionStatus === 2) return '待結清';
		if (transactionStatus === 3) return '已結清';
		return '';
	};

	// 點擊「線上支付尾款」按鈕
	const handlePayBalanceClick = () => {
		setShowPaymentDialog(true);
		setSelectedPaymentMethod(null);
	};

	// 確認支付方式並前往付款
	const handleConfirmPayment = async () => {
		if (!selectedPaymentMethod || !orderNo) return;

		setIsProcessingPayment(true);

		try {
			if (selectedPaymentMethod === 'credit') {
				// 信用卡支付
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/payments/credit-card/initialize`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							orderId: orderNo,
							amount: balanceAmount,
						}),
					}
				);

				if (!response.ok) {
					throw new Error('Failed to initialize payment');
				}

				const data = await response.json();

				if (data.success && data.formHtml) {
					// 在新視窗中打開支付表單
					const newWindow = window.open('', '_blank');
					if (newWindow) {
						newWindow.document.write(data.formHtml);
						newWindow.document.close();
					}
				} else {
					throw new Error(data.error || 'Payment initialization failed');
				}
			} else if (selectedPaymentMethod === 'atm') {
				// ATM 轉帳：調用後端 API 記錄選擇 ATM 支付
				if (!accessToken || !orderId) {
					alert('無法取得授權資訊，請重新登入');
					return;
				}

				// 1. 調用後端 API 記錄選擇 ATM 支付
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/select-balance-payment-method`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`,
						},
						body: JSON.stringify({
							orderId: orderId,
							paymentMethod: 'ATM',
						}),
					}
				);

				if (!response.ok) {
					throw new Error('Failed to record payment method');
				}

				// 2. 儲存 ATM 支付資料到 localStorage
				const dataToStore = {
					orderId: orderId,
					orderNo: orderNo,
					balanceAmt: balanceAmount,
					totalAmt: balanceAmount,
				};
				localStorage.setItem('atmPaymentData', JSON.stringify(dataToStore));

				// 3. 跳轉到 ATM 支付頁面
				router.push('/courses/atm-payment');
			}

			setShowPaymentDialog(false);
		} catch (error) {
			console.error('Payment error:', error);
			alert('支付初始化失敗，請稍後再試');
		} finally {
			setIsProcessingPayment(false);
		}
	};

	useEffect(() => {
		const createOrderSuccess = localStorage.getItem('createOrderSuccess');
		if (createOrderSuccess) {
			const { courseDetail, order, department, plan, formData } = JSON.parse(createOrderSuccess);
			setCourseDetail(courseDetail);
			setDepartment(department);
			setPlan(plan);
			setFormData(formData);
			setImages(courseDetail?.attachments.map((image) => process.env.NEXT_PUBLIC_AWS_S3_URL + image.key));
			setOrderId(order?.id || null);
			setOrderNo(order?.no || null);

			// 獲取訂單詳情以取得交易狀態
			if (order?.no) {
				fetchOrderDetails(order.no);
			}
		} else {
			router.push('/courses');
		}
	}, [router]);

	return (
		<>
			<div className='max-w-[380px] mx-auto pt-[48px] max-xs:pt-0'>
				<div className='max-xs:px-5 w-full flex-col items-center justify-center'>
					<div className='flex items-center justify-center text-[#1AC460] mb-4'>
						<CircleCheck size={64} />
					</div>
					<h1 className='text-3xl mb-10 text-center'>謝謝您，訂單成功送出</h1>

					{/* 付款狀態標籤 */}
					{transactionStatus !== null && (
						<div className='flex items-center justify-center gap-2 mb-6'>
							<span className='text-zinc-600 font-medium'>付款資料</span>
							<span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700'>
								{getStatusLabel()}
							</span>
						</div>
					)}

					<section className='flex items-center justify-center mb-10 w-full'>
						<div className='w-full flex flex-wrap gap-5 p-3 whitespace-nowrap rounded-xl border border-solid min-h-[124px] text-zinc-800 max-xs:max-w-full max-xs:flex-row-reverse max-xs:justify-between'>
							<div className='self-stretch my-auto w-[185px] max-xs:w-auto'>
								<h2 className='text-xl font-medium leading-snug mb-4'>{courseDetail?.type ? courseTypeMap[courseDetail?.type] : ''}</h2>
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
									<span>{(() => {
										// Convert ski type to Chinese
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
									})()}</span>
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
										{`${formData?.participants?.adult}成人 + ${formData?.participants?.minor}青少年/兒童`}
									</span>
								</div>
							</div>
							{images?.length ?
								<img
									src={images?.[0]}
									alt='Course thumbnail'
									className='object-contain shrink-0 self-stretch my-auto rounded-md aspect-square w-[100px]'
								/> :
								<></>
							}
						</div>
					</section>
					<div className="flex flex-col gap-3">
						{/* 線上支付尾款按鈕 - 僅在交易狀態為「待結清」時顯示 */}
						{transactionStatus === 2 && (
							<button
								className='overflow-hidden gap-2.5 self-stretch px-6 py-5 max-w-full text-base font-bold text-white whitespace-nowrap rounded-lg bg-zinc-900 w-full max-xs:px-5 transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg'
								onClick={handlePayBalanceClick}
								aria-label='線上支付尾款'
							>
								線上支付尾款
							</button>
						)}

						<div className="flex gap-2">
							<Button variant='secondary' onClick={() => router.push('/')} className='w-full' aria-label='回到首頁'>
								回到首頁
							</Button>
							<button
								className='overflow-hidden gap-2.5 self-stretch px-6 py-5 max-w-full text-base font-bold text-white whitespace-nowrap rounded-lg bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] w-full max-xs:px-5 transition-all duration-300 hover:opacity-90 hover:shadow-lg'
								onClick={() => orderId && router.push(`/order/${orderId}`)}
								aria-label='檢視我的訂單'
							>
								檢視我的訂單
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* 支付方式選擇對話框 */}
			{showPaymentDialog && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg max-w-md w-full p-6'>
						<h2 className='text-2xl font-bold mb-6 text-center'>線上支付尾款</h2>

						<div className='space-y-3 mb-6'>
							{/* 信用卡選項 */}
							<div
								className={`border rounded-lg p-4 cursor-pointer transition-all ${
									selectedPaymentMethod === 'credit'
										? 'border-blue-500 bg-blue-50'
										: 'border-zinc-300 hover:border-zinc-400'
								}`}
								onClick={() => setSelectedPaymentMethod('credit')}
							>
								<div className='flex items-center gap-3'>
									<input
										type='radio'
										checked={selectedPaymentMethod === 'credit'}
										onChange={() => setSelectedPaymentMethod('credit')}
										className='w-5 h-5'
									/>
									<div>
										<div className='font-medium text-lg'>信用卡</div>
										<div className='text-sm text-zinc-600'>使用信用卡線上支付</div>
									</div>
								</div>
							</div>

							{/* ATM 轉帳選項 */}
							<div
								className={`border rounded-lg p-4 cursor-pointer transition-all ${
									selectedPaymentMethod === 'atm'
										? 'border-blue-500 bg-blue-50'
										: 'border-zinc-300 hover:border-zinc-400'
								}`}
								onClick={() => setSelectedPaymentMethod('atm')}
							>
								<div className='flex items-center gap-3'>
									<input
										type='radio'
										checked={selectedPaymentMethod === 'atm'}
										onChange={() => setSelectedPaymentMethod('atm')}
										className='w-5 h-5'
									/>
									<div>
										<div className='font-medium text-lg'>ATM 轉帳</div>
										<div className='text-sm text-zinc-600'>透過 ATM 轉帳付款</div>
									</div>
								</div>
							</div>
						</div>

						<div className='flex gap-3'>
							<Button
								variant='secondary'
								onClick={() => {
									setShowPaymentDialog(false);
									setSelectedPaymentMethod(null);
								}}
								className='w-full'
								aria-label='取消'
							>
								取消
							</Button>
							<button
								className={`overflow-hidden gap-2.5 self-stretch px-6 py-5 max-w-full text-base font-bold text-white whitespace-nowrap rounded-lg w-full transition-all duration-300 ${
									selectedPaymentMethod && !isProcessingPayment
										? 'bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] hover:opacity-90 hover:shadow-lg'
										: 'bg-zinc-300 cursor-not-allowed'
								}`}
								onClick={handleConfirmPayment}
								disabled={!selectedPaymentMethod || isProcessingPayment}
								aria-label='前往付款'
							>
								{isProcessingPayment ? '處理中...' : '前往付款'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CourseDetailPage;
