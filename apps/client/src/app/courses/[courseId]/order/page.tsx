'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CoursePlanResponseDTO, GetCourseDetailResponseDTO, OrderChannel, OrderStatus, ResponseWrapper } from '@repo/shared';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { OrderFormData } from '@/components/Project/Courses/CourseDetail/CourseBookingForm';
import CheckoutSummary from '@/components/Project/OrderConfirm/CheckoutSummary';
import CourseInfoSection from '@/components/Project/OrderConfirm/CourseInfoSection';
import DiscountSection from '@/components/Project/OrderConfirm/DiscountSection';
import PaymentSection from '@/components/Project/OrderConfirm/PaymentSection';
import axios from '@/lib/api';
import { selectToken } from '@/state/slices/authSlice';
import { Department, selectDepartment, selectDiscount, setDiscount } from '@/state/slices/infoSlice';

function OrderConfirmationPage() {
	const router = useRouter();
	const departmentFromRedux = useSelector(selectDepartment);
	const [department, setDepartment] = useState<Department | null>(null);
	const dispatch = useDispatch();

	const [courseDetail, setCourseDetail] = useState<GetCourseDetailResponseDTO>();
	const [formData, setFormData] = useState<OrderFormData>();
	const [plan, setPlan] = useState<CoursePlanResponseDTO>();
	const [timestamp, setTimestamp] = useState<number>();
	const [paymentMethod, setPaymentMethod] = useState<'credit' | 'atm'>('credit');

	// 支付輪詢相關狀態
	const [isPolling, setIsPolling] = useState(false);
	const [pollCount, setPollCount] = useState(0);
	const [orderNo, setOrderNo] = useState<string | null>(null);
	const MAX_POLL_COUNT = 30 * 15; // 15 分鐘
	const POLL_INTERVAL = 2000; // 2 秒

	const authToken = useSelector(selectToken);
	const discount = useSelector(selectDiscount);

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
			const getCourseDetail = async (id: string) => {
				const response = await axios.get<ResponseWrapper<GetCourseDetailResponseDTO>>(
					`/api/courses/client/${id}/detail`,
				);
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
		// Cleanup function to clear discount when leaving the page
		return () => {
			dispatch(setDiscount(null));
		};
	}, [dispatch]);

	// 輪詢支付狀態
	useEffect(() => {
		if (!orderNo || !isPolling) {
			return;
		}

		let timeoutId: NodeJS.Timeout;
		let isMounted = true;
		let currentPollCount = 0;

		const checkPaymentStatus = async () => {
			if (!isMounted) {
				return;
			}

			currentPollCount++;

			try {
				const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4040'}/api/orders/${orderNo}/payment-status`;
				const response = await fetch(apiUrl);
				const result = await response.json();

				// Handle NestJS global interceptor wrapper
				const paymentData = result.result || result;

				if (paymentData.success && paymentData.data) {
					const { depositPaid, orderStatus } = paymentData.data;

					// 支付成功
					if (depositPaid) {
						setIsPolling(false);
						router.push('/courses/order-success');
						return;
					}

					// 訂單被取消
					if (orderStatus === OrderStatus.ORDER_CANCELED) {
						setIsPolling(false);
						alert('訂單已取消');
						return;
					}
				}
			} catch (error) {
				console.error('Payment polling error:', error);
			}

			// 檢查是否達到最大輪詢次數
			if (currentPollCount >= MAX_POLL_COUNT) {
				setIsPolling(false);
				setPollCount(currentPollCount);
				alert('支付驗證超時，請稍後查看訂單狀態');
				return;
			}

			// 繼續輪詢
			setPollCount(currentPollCount);
			timeoutId = setTimeout(() => {
				if (isMounted) {
					checkPaymentStatus();
				}
			}, POLL_INTERVAL);
		};

		checkPaymentStatus();

		return () => {
			isMounted = false;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [orderNo, isPolling, router]);

	const handleSubmit = async () => {
		const body = {
			type: courseDetail.type,
			departmentId: courseDetail.departmentId,
			coursePlanId: plan.id,
			skiType: formData.boardType,
			bkgType: courseDetail.bkgType,
			planNumber: plan.number,
			planType: plan.type,
			adultCount: formData.participants.adult,
			childCount: formData.participants.minor,
			discountCode: discount ?? '',
			channel: OrderChannel.WEB,
			status: OrderStatus.PENDING_DEPOSIT
		};

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
				body: JSON.stringify(body),
			});

			if (response.status === 201) {
				const orderData = await response.json();
				const orderId = orderData?.result?.no;

				// Save form data to localStorage before navigating
				localStorage.removeItem('courseOrderData');
				localStorage.setItem(
					'createOrderSuccess',
					JSON.stringify({
						courseDetail: courseDetail,
						order: orderData?.result,
						department: department,
						plan: plan,
						formData,
						timestamp: formData.date ? new Date(formData.date).getTime() : undefined,
					}),
				);

				// 計算總金額（包含所有參與者和堂數）
				const totalAmount = plan.price * (plan.number || 1) * formData.participants.adult +
				                   plan.price * (plan.number || 1) * formData.participants.minor;

				// 根據付款方式判斷流程
				if (paymentMethod === 'credit') {
					// 設定訂單號並開始輪詢
					setOrderNo(orderId);
					setIsPolling(true);

					// 跳轉到 ECPay 支付頁面
					await initiateCreditCardPayment(orderId, totalAmount);
				} else if (paymentMethod === 'atm') {
					// ATM 轉帳直接跳轉到成功頁面
					router.push(`/courses/order-success`);
				}
			} else {
				console.error('Order failed with status:', response.status);
				const errorData = await response.json();
				console.error('Error details:', errorData);
				alert(`訂單建立失敗 (${response.status}): ${errorData?.message || '請重試'}`);
			}
		} catch (error) {
			console.error('Order submission error:', error);
			alert('訂單提交失敗：' + (error as Error).message);
		}
	};

	/**
	 * 初始化信用卡支付
	 * 調用後端 ECPay 初始化 API，獲取支付表單並跳轉
	 */
	const initiateCreditCardPayment = async (orderId: string, amount: number) => {
		//orderId = 'ABC00000012'; // TODO: 移除測試用 orderId
		try {
			// 調用後端初始化 ECPay 支付
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/credit-card/initialize`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
				body: JSON.stringify({
					orderId: orderId,
					amount: amount,
					callbackUrl: `${window.location.origin}/api/orders/credit-card/callback`,
				}),
			});

			if (response.ok) {
				const result = await response.json();

				// 根據 NestJS 全局攔截器的響應格式提取 formHtml
				// 支持多層結構：result.result.formHtml 或 result.data.formHtml 或 result.formHtml
				let formHtml = null;

				if (result?.result?.formHtml) {
					// 格式：{ result: { success: true, formHtml: "...", ... } }
					formHtml = result.result.formHtml;
				} else if (result?.data?.formHtml) {
					// 格式：{ data: { formHtml: "...", ... } }
					formHtml = result.data.formHtml;
				} else if (result?.formHtml) {
					// 格式：{ formHtml: "...", ... }
					formHtml = result.formHtml;
				}

				if (formHtml) {
					// 在新視窗中打開支付表單
					submitFormToECPayWindow(formHtml);
				} else {
					console.error('No form HTML returned from ECPay initialization', result);
					alert('支付初始化失敗，請重試');
				}
			} else {
				console.error('ECPay initialization failed:', response.status);
				const errorData = await response.json().catch(() => ({}));
				console.error('Error details:', errorData);
				alert('無法初始化支付，請重試');
			}
		} catch (error) {
			console.error('ECPay payment initiation error:', error);
			alert('支付初始化出錯：' + (error as Error).message);
		}
	};

	/**
	 * 在新視窗中提交支付表單到 ECPay
	 */
	const submitFormToECPayWindow = (formHtml: string) => {
		try {
			const newWindow = window.open('', '_blank');
			if (!newWindow) {
				alert('請允許彈出視窗以進行支付');
				return;
			}

			// 將 HTML 寫入新視窗
			// 注意：HTML 中已經包含 onload="document.paymentForm.submit();" 會自動提交表單
			newWindow.document.open();
			newWindow.document.write(formHtml);
			newWindow.document.close();

			// 不需要手動提交！HTML 中的 onload 事件會自動提交表單
			// 試圖在 setTimeout 中訪問 newWindow.document 會導致跨域錯誤
		} catch (error) {
			console.error('Error submitting form to ECPay:', error);
			alert('無法跳轉到支付頁面，請重試');
		}
	};

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
							<PaymentSection onPaymentMethodChange={setPaymentMethod} />
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
								onClick={handleSubmit}
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
