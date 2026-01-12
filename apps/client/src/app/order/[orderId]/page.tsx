'use client';

import { useEffect, useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import {
	CourseSkiType,
	CourseType,
	GetCourseDetailResponseDTO,
	GetOrderDetailResponseDTO,
	OrderReservationResponseDto,
	OrderStatus,
	ResponseWrapper,
} from '@repo/shared';
import { useParams, useRouter } from 'next/navigation';

import ProfileIcon from '@/components/Icon/ProfileIcon';
import SnowBoardIcon from '@/components/Icon/SnowBoardIcon';
import { orderStatusMapper } from '@/components/Project/Member/CurrentOrders';
import CancelOrderModal from '@/components/Project/OrderDetail/CancelOrderModal';
import CourseReservation from '@/components/Project/OrderDetail/CourseReservation';
import MemberList from '@/components/Project/OrderDetail/MemberList';
import { showToast } from '@/components/Project/Utils/Toast';
import api from '@/lib/api';
import { selectToken } from '@/state/slices/authSlice';

const courseTypeMap = {
	[CourseType.GROUP]: '團體班教學',
	[CourseType.PRIVATE]: '私人班教學',
	[CourseType.INDIVIDUAL]: '個人練習',
};

const skiTypeMap = {
	[CourseSkiType.SKI]: '雙板',
	[CourseSkiType.SNOWBOARD]: '單板',
	[CourseSkiType.BOTH]: '單板/雙板',
};

export default function OrderDetail() {
	const { orderId } = useParams<{ orderId: string }>();
	const router = useRouter();
	const [orderDetail, setOrderDetail] = useState<GetOrderDetailResponseDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const accessToken = useSelector(selectToken);

	const [courseDetail, setCourseDetail] = useState<GetCourseDetailResponseDTO>();
	const [orderMembers, setOrderMembers] = useState(orderDetail?.orderMembers || []);
	const [orderReservations, setOrderReservations] = useState<OrderReservationResponseDto[]>([]);
	const [pendingInvitations, setPendingInvitations] = useState(orderDetail?.pendingInvitations || []);
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit' | 'atm' | null>(null);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [isPolling, setIsPolling] = useState(false);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const previousBalancePaymentInitiatedAtRef = useRef<Date | null | undefined>(null);

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

	useEffect(() => {
		if (!accessToken || !orderId) return;

		const getOrderReservations = async (orderId: string) => {
			try {
				const response = await api.get<ResponseWrapper<OrderReservationResponseDto[]>>(
					`/api/orders/${orderId}/reservations`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setOrderReservations(response.data.result);
			} catch (error) {
				console.error('Failed to fetch order reservations:', error);
			}
		};

		getOrderReservations(orderId);
	}, [accessToken, orderId]);

	useEffect(() => {
		if (orderDetail) {
			setOrderMembers(orderDetail.orderMembers || []);
			setPendingInvitations(orderDetail.pendingInvitations || []);
		}
	}, [orderDetail]);

	// Polling 函數：檢查尾款支付狀態
	const stopPolling = () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
		}
		setIsPolling(false);
	};

	const startPolling = async () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}

		// 先獲取最新的訂單狀態來記錄初始的 balancePaymentInitiatedAt
		try {
			const initialResponse = await api.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const initialOrder = initialResponse.data.result;
			previousBalancePaymentInitiatedAtRef.current = initialOrder.transaction?.balancePaymentInitiatedAt;
		} catch (error) {
			console.error('Failed to get initial order state:', error);
		}

		pollingIntervalRef.current = setInterval(async () => {
			try {
				const response = await api.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				const updatedOrder = response.data.result;

				// 檢查尾款是否已支付成功
				if (updatedOrder.transaction?.balanceDate) {
					stopPolling();

					// 清除失敗資料，儲存成功資料到 localStorage
					localStorage.removeItem('balancePaymentFailed');
					const dataToStore = {
						orderNo: updatedOrder.no,
						orderId: updatedOrder.id,
					};
					localStorage.setItem('balancePaymentSuccess', JSON.stringify(dataToStore));

					// 導向付款成功頁面
					router.push('/courses/payment-success');
					return;
				}

				// 檢查是否支付失敗或 timeout（balancePaymentInitiatedAt 被清除）
				// 之前有值，現在變成 null/undefined，表示後端清除了
				if (previousBalancePaymentInitiatedAtRef.current && !updatedOrder.transaction?.balancePaymentInitiatedAt) {
					stopPolling();

					// 檢查 lastPaymentAttemptResult 來區分支付失敗和 timeout
					const lastAttemptResult = updatedOrder.transaction?.lastPaymentAttemptResult;

					// 如果 lastPaymentAttemptResult 以 "RtnCode_" 開頭，表示支付失敗
					if (lastAttemptResult && lastAttemptResult.startsWith('RtnCode_')) {
						// 尾款支付失敗，localStorage 已經在開始支付時儲存了
						router.push('/courses/order-error?reason=balance_payment_failed');
					} else {
						// Timeout
						router.push('/courses/order-error?reason=balance-timeout');
					}
					return;
				}
			} catch (error) {
				console.error('Error during polling:', error);
				stopPolling();
			}
		}, 2000); // 每 2 秒 polling 一次

		setIsPolling(true);
	};

	// Cleanup polling on unmount
	useEffect(() => {
		return () => {
			stopPolling();
		};
	}, []);

	if (!orderDetail || !courseDetail) return null;

	const coursePlan = courseDetail?.coursePlans.find((plan) => plan.name === orderDetail.coursePlanName);
	const price = coursePlan?.price || 0;
	const deposit = orderDetail.transaction?.depositAmt || Math.floor(price * 0.5);

	const handleCancelOrder = async (reason: string) => {
		try {
			const response = await api.put(
				`/api/orders/${orderId}/cancel`,
				{ reason },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (response.data.result?.success) {
				showToast('訂單已成功取消', 'success');
				setIsCancelModalOpen(false);

				// Refresh order detail to show updated status
				const updatedOrder = await api.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setOrderDetail(updatedOrder.data.result);

				// Also refresh reservations
				const updatedReservations = await api.get<ResponseWrapper<OrderReservationResponseDto[]>>(
					`/api/orders/${orderId}/reservations`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setOrderReservations(updatedReservations.data.result);
			}
		} catch (error: any) {
			console.error('取消訂單失敗:', error);

			// Handle specific error messages
			const errorMessage = error.response?.data?.message || error.response?.data?.error || '取消訂單失敗，請重試';

			showToast(errorMessage, 'error');
		}
	};

	// 根據交易狀態返回狀態標籤和樣式
	const getTransactionStatusInfo = () => {
		const transactionStatus = orderDetail?.transaction?.status;

		if (transactionStatus === 0) {
			return {
				label: '待付訂金',
				style: 'border-[#FE7B5D] text-[#FE7B5D]',
			};
		} else if (transactionStatus === 2) {
			return {
				label: '待結清',
				style: 'border-[#2B2B2B] text-[#2B2B2B]',
			};
		} else if (transactionStatus === 3) {
			return {
				label: '已結清',
				style: 'border-[#169B62] text-[#169B62]',
			};
		}

		// 默認使用訂單狀態
		return {
			label: orderStatusMapper[orderDetail?.status || OrderStatus.PENDING_DEPOSIT].headerLabel,
			style: orderStatusMapper[orderDetail?.status || OrderStatus.PENDING_DEPOSIT].headerStyle,
		};
	};

	// 處理線上支付尾款
	const handlePayBalanceClick = () => {
		setShowPaymentDialog(true);
		setSelectedPaymentMethod(null);
	};

	const handleConfirmPayment = async () => {
		if (!selectedPaymentMethod || !orderDetail?.no) return;

		setIsProcessingPayment(true);

		try {
			const balanceAmt = orderDetail.transaction?.balanceAmt || 0;

			console.log('Initializing payment:', {
				orderId: orderDetail.no,
				amount: balanceAmt,
				paymentMethod: selectedPaymentMethod,
			});

			if (selectedPaymentMethod === 'credit') {
				// 儲存訂單資料到 localStorage，以便支付失敗時使用
				const dataToStore = {
					orderId: orderDetail.id,
				};
				localStorage.setItem('balancePaymentFailed', JSON.stringify(dataToStore));

				// 信用卡支付
				const response = await api.post(
					'/api/payments/credit-card/initialize',
					{
						orderId: orderDetail.no,
						amount: balanceAmt,
					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				);

				console.log('Payment initialization response:', response.data);

				// 後端返回格式: { statusCode, message, result: { success, formHtml, merchantTradeNo } }
				const result = response.data.result;

				if (result && result.success && result.formHtml) {
					// 在新視窗中打開支付表單
					const newWindow = window.open('', '_blank');
					if (newWindow) {
						newWindow.document.write(result.formHtml);
						newWindow.document.close();
					}

					setShowPaymentDialog(false);

					// 啟動 polling 檢查支付狀態
					startPolling();
				} else {
					const errorMsg = result?.error || response.data.message || 'Payment initialization failed';
					console.error('Payment initialization failed:', errorMsg);
					showToast(errorMsg, 'error');
				}
			} else if (selectedPaymentMethod === 'atm') {
				// 1. 調用後端 API 記錄選擇 ATM 支付
				await api.patch(
					'/api/transactions/select-balance-payment-method',
					{
						orderId: orderDetail.id,
						paymentMethod: 'ATM',
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);

				// 2. 儲存 ATM 支付資料到 localStorage
				const totalAmt = orderDetail.transaction?.totalAmt || 0;
				const dataToStore = {
					orderId: orderDetail.id,
					orderNo: orderDetail.no,
					balanceAmt: balanceAmt,
					totalAmt: totalAmt,
				};
				localStorage.setItem('atmPaymentData', JSON.stringify(dataToStore));

				setShowPaymentDialog(false);

				// 3. 跳轉到 ATM 支付頁面
				router.push('/courses/atm-payment');
			}
		} catch (error) {
			console.error('Payment error:', error);
			if (error.response) {
				console.error('Error response:', error.response.data);
				showToast(error.response.data.message || '支付初始化失敗，請稍後再試', 'error');
			} else {
				showToast('支付初始化失敗，請稍後再試', 'error');
			}
		} finally {
			setIsProcessingPayment(false);
		}
	};

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
											<div className='justify-start text-zinc-500 text-sm font-normal font-poppins leading-6'>
												{new Date(orderDetail.expDate).toLocaleDateString('sv-SE')}{' '}
												{new Date(orderDetail.expDate).toLocaleTimeString('sv-SE', {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</div>
										</div>
									)}
									{orderDetail.status === OrderStatus.ORDER_SUCCESSFUL && orderReservations.length > 0 && (
										<div className='inline-flex justify-start items-center gap-1'>
											<div className="justify-start text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
												訂單有效時間
											</div>
											<div className='justify-start text-zinc-500 text-sm font-normal font-poppins leading-6'>
												{(() => {
													// Find the first reservation's classTime
													const firstReservation = orderReservations
														.filter((or) => or.reservation?.classTime)
														.sort((a, b) => {
															const dateA = new Date(a.reservation!.classTime).getTime();
															const dateB = new Date(b.reservation!.classTime).getTime();
															return dateA - dateB;
														})[0];

													if (firstReservation?.reservation?.classTime) {
														const startDate = new Date(firstReservation.reservation.classTime);
														const endDate = new Date(orderDetail.expDate);
														return `${startDate.toLocaleDateString('sv-SE')} - ${endDate.toLocaleDateString('sv-SE')}`;
													}
													return '';
												})()}
											</div>
										</div>
									)}
									{orderDetail.transaction?.status === 2 &&
										orderDetail.transaction?.balancePaymentMethod === 'ATM' &&
										!orderDetail.transaction?.balanceDate && (
											<div className='inline-flex justify-start items-center gap-1'>
												<div className="justify-start text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
													匯款帳號有效時間
												</div>
												<div className='justify-start text-zinc-500 text-sm font-normal font-poppins leading-6'>
													{(() => {
														const baseDate = orderDetail.transaction.balancePaymentInitiatedAt
															? new Date(orderDetail.transaction.balancePaymentInitiatedAt)
															: new Date();
														const validUntil = new Date(baseDate);
														validUntil.setDate(validUntil.getDate() + 3);
														return (
															validUntil.toLocaleDateString('sv-SE') +
															' ' +
															validUntil.toLocaleTimeString('sv-SE', {
																hour: '2-digit',
																minute: '2-digit',
															})
														);
													})()}
												</div>
											</div>
										)}
								</div>
								{/* 訂金 ATM 轉帳資訊 */}
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
																fillRule='evenodd'
																clipRule='evenodd'
																d='M8.00038 1.33325C4.31848 1.33325 1.33371 4.31802 1.33371 7.99992C1.33371 11.6818 4.31848 14.6666 8.00038 14.6666C11.6823 14.6666 14.667 11.6818 14.667 7.99992C14.667 6.23181 13.9647 4.53612 12.7144 3.28587C11.4642 2.03563 9.76849 1.33325 8.00038 1.33325ZM2.53371 7.99992C2.53371 4.98076 4.98122 2.53325 8.00038 2.53325C9.45022 2.53325 10.8407 3.1092 11.8659 4.1344C12.8911 5.1596 13.467 6.55007 13.467 7.99992C13.467 11.0191 11.0195 13.4666 8.00038 13.4666C4.98122 13.4666 2.53371 11.0191 2.53371 7.99992Z'
																fill='#0F72ED'
															/>
														</svg>
													</div>
												</div>
												<div className='inline-flex justify-start items-center gap-0.5'>
													<div className='justify-start text-zinc-800 text-3xl font-semibold font-poppins leading-8'>
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
													<div className='justify-start text-zinc-500 text-sm font-normal font-poppins leading-5'>
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
														<span className='text-zinc-800 text-base font-medium font-poppins leading-6'>(053)</span>
													</div>
												</div>
												<div className='self-stretch inline-flex justify-between items-center'>
													<div className='justify-start text-zinc-800 text-xl font-semibold font-poppins leading-7'>
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
														<span className='text-zinc-500 text-sm font-normal font-poppins leading-6'>CitySki</span>
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

								{/* 尾款 ATM 轉帳資訊 */}
								{orderDetail.transaction?.status === 2 &&
									orderDetail.transaction?.balancePaymentMethod === 'ATM' &&
									!orderDetail.transaction?.balanceDate && (
										<div className='self-stretch rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-800 inline-flex justify-start items-start overflow-hidden'>
											<div className='flex-1 m-0.5 self-stretch relative border-r border-zinc-300 overflow-hidden'>
												<div className='left-[24px] top-[24px] absolute inline-flex flex-col justify-center items-start gap-0.5'>
													<div className='inline-flex justify-start items-center gap-1'>
														<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
															應繳尾款
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
																	fillRule='evenodd'
																	clipRule='evenodd'
																	d='M8.00038 1.33325C4.31848 1.33325 1.33371 4.31802 1.33371 7.99992C1.33371 11.6818 4.31848 14.6666 8.00038 14.6666C11.6823 14.6666 14.667 11.6818 14.667 7.99992C14.667 6.23181 13.9647 4.53612 12.7144 3.28587C11.4642 2.03563 9.76849 1.33325 8.00038 1.33325ZM2.53371 7.99992C2.53371 4.98076 4.98122 2.53325 8.00038 2.53325C9.45022 2.53325 10.8407 3.1092 11.8659 4.1344C12.8911 5.1596 13.467 6.55007 13.467 7.99992C13.467 11.0191 11.0195 13.4666 8.00038 13.4666C4.98122 13.4666 2.53371 11.0191 2.53371 7.99992Z'
																	fill='#0F72ED'
																/>
															</svg>
														</div>
													</div>
													<div className='inline-flex justify-start items-center gap-0.5'>
														<div className='justify-start text-zinc-800 text-3xl font-semibold font-poppins leading-8'>
															{orderDetail.transaction.balanceAmt?.toLocaleString()}
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
														<div className='justify-start text-zinc-500 text-sm font-normal font-poppins leading-5'>
															{orderDetail.transaction.totalAmt?.toLocaleString()}
														</div>
														<div className="w-3.5 h-3.5 justify-center text-zinc-500 text-xs font-['Noto_Sans_TC'] leading-5">
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
															<span className='text-zinc-800 text-base font-medium font-poppins leading-6'>(053)</span>
														</div>
													</div>
													<div className='self-stretch inline-flex justify-between items-center'>
														<div className='justify-start text-zinc-800 text-xl font-semibold font-poppins leading-7'>
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
															<span className='text-zinc-500 text-sm font-normal font-poppins leading-6'>CitySki</span>
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
															fillRule='evenodd'
															clipRule='evenodd'
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
													{orderDetail ? skiTypeMap[orderDetail.skiType] || '雙板' : '雙板'}
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
							<CourseReservation
								orderReservations={orderReservations}
								courseType={courseDetail.type}
								orderMembers={orderMembers}
								coursePeople={courseDetail.coursePeople}
								adultCount={orderDetail.adultCount}
								childCount={orderDetail.childCount}
								orderId={orderId}
								departmentId={courseDetail.departmentId}
								accessToken={accessToken}
								planNumber={orderDetail.planNumber}
								canAddReservation={orderDetail.status !== OrderStatus.ORDER_CANCELED}
								onReservationCreated={async () => {
									// 重新獲取訂單預約資訊和訂單詳情
									try {
										const [reservationsResponse, orderResponse] = await Promise.all([
											api.get<ResponseWrapper<OrderReservationResponseDto[]>>(`/api/orders/${orderId}/reservations`, {
												headers: {
													Authorization: `Bearer ${accessToken}`,
												},
											}),
											api.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`, {
												headers: {
													Authorization: `Bearer ${accessToken}`,
												},
											}),
										]);
										setOrderReservations(reservationsResponse.data.result);
										setOrderDetail(orderResponse.data.result);
									} catch (error) {
										console.error('Failed to refresh order data:', error);
									}
								}}
							/>
							<MemberList
								orderMembers={orderMembers}
								orderId={orderId}
								courseType={courseDetail.type}
								skiType={orderDetail.skiType}
								purchasedQuantity={orderDetail.adultCount + orderDetail.childCount}
								pendingInvitations={pendingInvitations}
								orderReservations={orderReservations}
								planNumber={orderDetail.planNumber}
								canAddMember={orderDetail.status !== OrderStatus.ORDER_CANCELED}
								onAddMember={async () => {
									// 重新获取订单详情以更新成员列表
									try {
										const response = await api.get<ResponseWrapper<GetOrderDetailResponseDTO>>(
											`/api/orders/${orderId}`,
											{
												headers: {
													Authorization: `Bearer ${accessToken}`,
												},
											},
										);
										setOrderDetail(response.data.result);
									} catch (error) {
										console.error('Failed to refresh order detail:', error);
									}
								}}
								onInvitationCreated={(newInvitation) => {
									// 直接將新邀請添加到列表中
									setPendingInvitations((prev) => [...prev, newInvitation]);
								}}
							/>
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
															<span className='text-zinc-800 text-base font-medium font-poppins leading-6'>5</span>
															<span className="text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
																分鐘報到
															</span>
														</div>
														<div className='self-stretch justify-start'>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																課程於整點開始上課，請提早
															</span>
															<span className='text-zinc-500 text-base font-normal font-poppins leading-6'>5</span>
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
															<span className='text-zinc-500 text-base font-normal font-poppins leading-6'>21-24℃</span>
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
															<span className='text-zinc-500 text-base font-normal font-poppins leading-6'>50</span>
															<span className="text-zinc-500 text-base font-normal font-['Noto_Sans_TC'] leading-6">
																元、雪襪
															</span>
															<span className='text-zinc-500 text-base font-normal font-poppins leading-6'>500</span>
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
																		strokeWidth='1.5'
																		strokeLinecap='round'
																		strokeLinejoin='round'
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
														<div className='justify-start text-neutral-700 text-xl font-medium font-poppins leading-7'>
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
														<span className='text-neutral-700 text-sm font-normal font-poppins leading-6'>1</span>
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
														<div className='justify-start text-neutral-700 text-xl font-medium font-poppins leading-7'>
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
														<span className='text-neutral-700 text-sm font-normal font-poppins leading-6'>300</span>
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
														<div className='justify-start text-neutral-700 text-xl font-medium font-poppins leading-7'>
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
														<span className='text-neutral-700 text-sm font-normal font-poppins leading-6'>1,200</span>
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
											<button
												className="text-blue-600 text-base font-normal font-['Noto_Sans_TC'] leading-6 hover:underline cursor-pointer"
												onClick={() => window.open('/terms-and-conditions', '_blank')}
											>
												課程約定事項
											</button>
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
								<div className='self-stretch flex flex-col gap-3'>
									<div className='self-stretch inline-flex justify-between items-center'>
										<div className="justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
											付款資料
										</div>
										<div
											className={
												'px-2.5 py-1.5 rounded-3xl outline outline-1 outline-offset-[-1px] flex justify-start items-center gap-1 ' +
												getTransactionStatusInfo().style
											}
										>
											<div className={"text-center justify-center text-xs font-medium font-['Noto_Sans_TC'] leading-5"}>
												{getTransactionStatusInfo().label}
											</div>
										</div>
									</div>
									{/* 尾款 ATM 支付提示 */}
									{orderDetail.transaction?.status === 2 && orderDetail.transaction?.balancePaymentMethod === 'ATM' && (
										<div className='self-stretch p-3 bg-blue-50 rounded-lg flex items-center gap-2'>
											<div data-svg-wrapper className='relative'>
												<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path
														d='M8.00038 11.3333C8.36857 11.3333 8.66704 11.0348 8.66704 10.6666V7.33325C8.66704 6.96506 8.36857 6.66659 8.00038 6.66659C7.63219 6.66659 7.33371 6.96506 7.33371 7.33325V10.6666C7.33371 11.0348 7.63219 11.3333 8.00038 11.3333Z'
														fill='#0F72ED'
													/>
													<path
														d='M8.00038 5.99992C7.63219 5.99992 7.33371 5.70144 7.33371 5.33325C7.33371 4.96506 7.63219 4.66659 8.00038 4.66659C8.36857 4.66659 8.66704 4.96506 8.66704 5.33325C8.66704 5.70144 8.36857 5.99992 8.00038 5.99992Z'
														fill='#0F72ED'
													/>
													<path
														fillRule='evenodd'
														clipRule='evenodd'
														d='M8.00038 1.33325C4.31848 1.33325 1.33371 4.31802 1.33371 7.99992C1.33371 11.6818 4.31848 14.6666 8.00038 14.6666C11.6823 14.6666 14.667 11.6818 14.667 7.99992C14.667 6.23181 13.9647 4.53612 12.7144 3.28587C11.4642 2.03563 9.76849 1.33325 8.00038 1.33325ZM2.53371 7.99992C2.53371 4.98076 4.98122 2.53325 8.00038 2.53325C9.45022 2.53325 10.8407 3.1092 11.8659 4.1344C12.8911 5.1596 13.467 6.55007 13.467 7.99992C13.467 11.0191 11.0195 13.4666 8.00038 13.4666C4.98122 13.4666 2.53371 11.0191 2.53371 7.99992Z'
														fill='#0F72ED'
													/>
												</svg>
											</div>
											<div className="text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-5 whitespace-nowrap">
												請於首堂課開始前支付尾款
											</div>
										</div>
									)}
								</div>
								<div className='self-stretch flex flex-col justify-start items-start gap-2'>
									{/* 訂單金額 */}
									<div className='self-stretch inline-flex justify-between items-end'>
										<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
											訂單金額
										</div>
										<div className='flex justify-start items-center gap-0.5'>
											<div className='justify-start text-zinc-800 text-base font-medium font-poppins leading-6'>
												{(
													orderDetail.transaction?.totalAmt + (orderDetail.transaction?.discountFee || 0)
												).toLocaleString() || price.toLocaleString()}
											</div>
											<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
												元
											</div>
										</div>
									</div>

									{/* 優惠折扣 */}
									{(orderDetail.transaction?.discountFee || 0) > 0 && (
										<div className='self-stretch inline-flex justify-between items-end'>
											<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												優惠折扣
											</div>
											<div className='flex justify-start items-center gap-0.5'>
												<div className='justify-start text-emerald-600 text-base font-medium font-poppins leading-6'>
													-{orderDetail.transaction?.discountFee.toLocaleString()}
												</div>
												<div className="justify-start text-emerald-600 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
													元
												</div>
											</div>
										</div>
									)}

									{/* 已付訂金 - 僅在已支付訂金後顯示 */}
									{orderDetail.transaction?.status >= 2 && (
										<div className='self-stretch inline-flex justify-between items-end'>
											<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												已付訂金
											</div>
											<div className='flex justify-start items-center gap-0.5'>
												<div className='justify-start text-zinc-800 text-base font-medium font-poppins leading-6'>
													-{orderDetail.transaction?.depositAmt.toLocaleString()}
												</div>
												<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
													元
												</div>
											</div>
										</div>
									)}

									{/* 尾款 - 僅在待結清狀態時顯示 */}
									{orderDetail.transaction?.status === 2 && (
										<div className='self-stretch pt-4 border-t border-gray-200 inline-flex justify-end items-center gap-2'>
											<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
												尾款
											</div>
											<div className='flex justify-start items-center gap-1'>
												<div className='justify-start text-zinc-800 text-2xl font-semibold font-poppins leading-7'>
													{orderDetail.transaction?.balanceAmt.toLocaleString()}
												</div>
												<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
													元
												</div>
											</div>
										</div>
									)}

									{/* 線上支付尾款按鈕 - 僅在待結清且尚未選擇支付方式時顯示，且訂單未取消 */}
									{orderDetail.status !== OrderStatus.ORDER_CANCELED &&
										orderDetail.transaction?.status === 2 &&
										!orderDetail.transaction?.balancePaymentMethod && (
											<div className='self-stretch flex flex-col gap-3 pt-4'>
												<button
													className='self-stretch overflow-hidden gap-2.5 px-6 py-2 text-base font-bold text-white whitespace-nowrap rounded-lg bg-zinc-900 w-full transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg'
													onClick={handlePayBalanceClick}
													aria-label='線上支付尾款'
												>
													線上支付尾款
												</button>
												<div className="text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-5">
													您可以點擊上方按鈕線上刷卡/ATM轉帳，或至CitySki現場以現金/信用卡付款。
												</div>
											</div>
										)}
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
												{orderDetail.ordererName}
											</div>
										</div>
										<div className='self-stretch inline-flex justify-between items-end'>
											<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												訂單編號
											</div>
											<div className='justify-start text-zinc-800 text-base font-medium font-poppins leading-6'>
												{orderDetail.no}
											</div>
										</div>
										<div className='self-stretch inline-flex justify-between items-end'>
											<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
												訂購日期
											</div>
											<div className='justify-start text-zinc-800 text-base font-medium font-poppins leading-6'>
												{new Date(orderDetail.createdTime).toLocaleDateString('sv-SE')}
											</div>
										</div>

										{/* 訂金付款日期 - 僅在待結清或已結清狀態時顯示 */}
										{orderDetail.transaction?.status >= 2 && orderDetail.transaction?.depositDate && (
											<div className='self-stretch inline-flex justify-between items-end'>
												<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
													訂金付款日期
												</div>
												<div className='justify-start text-zinc-800 text-base font-medium font-poppins leading-6'>
													{new Date(orderDetail.transaction.depositDate).toLocaleDateString('sv-SE')}
												</div>
											</div>
										)}

										{/* 訂金付款方式 - 僅在待結清或已結清狀態時顯示 */}
										{orderDetail.transaction?.status >= 2 && (
											<div className='self-stretch inline-flex justify-between items-end'>
												<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
													訂金付款方式
												</div>
												<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
													{orderDetail.transaction.depositPaymentMethod === 'ATM'
														? '線上ATM'
														: orderDetail.transaction.depositPaymentMethod === 'CREDIT'
															? '線上信用卡'
															: orderDetail.transaction.depositPaymentMethod === 'CASH'
																? '現場付現'
																: orderDetail.transaction.depositPaymentMethod || '未記錄'}
												</div>
											</div>
										)}

										{/* 尾款付款日期 - 僅在已結清狀態時顯示 */}
										{orderDetail.transaction?.status === 3 && orderDetail.transaction?.balanceDate && (
											<div className='self-stretch inline-flex justify-between items-end'>
												<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
													尾款付款日期
												</div>
												<div className='justify-start text-zinc-800 text-base font-medium font-poppins leading-6'>
													{new Date(orderDetail.transaction.balanceDate).toLocaleDateString('sv-SE')}
												</div>
											</div>
										)}

										{/* 尾款付款方式 - 僅在已結清狀態時顯示 */}
										{orderDetail.transaction?.status === 3 && (
											<div className='self-stretch inline-flex justify-between items-end'>
												<div className="justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
													尾款付款方式
												</div>
												<div className="justify-start text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
													{orderDetail.transaction.balancePaymentMethod === 'ATM'
														? '線上ATM'
														: orderDetail.transaction.balancePaymentMethod === 'CREDIT'
															? '線上信用卡'
															: orderDetail.transaction.balancePaymentMethod === 'CASH'
																? '現場付現'
																: orderDetail.transaction.balancePaymentMethod || '未記錄'}
												</div>
											</div>
										)}
									</div>
								</div>
								{orderDetail &&
									orderDetail.status !== OrderStatus.ORDER_CANCELED &&
									orderReservations.every(
										(or) =>
											!or.reservation ||
											or.reservation.reservationStatus === 1 ||
											or.reservation.reservationStatus === 9,
									) && (
										<button
											onClick={() => setIsCancelModalOpen(true)}
											className="mt-4 justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] underline leading-6 hover:text-blue-600 transition-colors cursor-pointer"
										>
											申請取消訂單
										</button>
									)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<CancelOrderModal
				isOpen={isCancelModalOpen}
				onClose={() => setIsCancelModalOpen(false)}
				onConfirm={handleCancelOrder}
			/>

			{/* 支付方式選擇對話框 */}
			{showPaymentDialog && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg max-w-md w-full p-6'>
						<h2 className='text-2xl font-bold mb-4 text-left'>線上支付尾款</h2>
						<p className='text-sm text-zinc-600 mb-6'>選擇支付方式</p>

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
										<div className='text-sm text-zinc-600'>VISA / Mastercard / JCB</div>
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
										<div className='text-sm text-zinc-600'>ATM 虛擬銀行轉帳</div>
									</div>
								</div>
							</div>
						</div>

						<div className='flex gap-3 justify-end'>
							<button
								onClick={() => {
									setShowPaymentDialog(false);
									setSelectedPaymentMethod(null);
								}}
								className='px-4 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 font-medium'
							>
								取消
							</button>
							<button
								className={`px-4 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
									selectedPaymentMethod && !isProcessingPayment
										? 'bg-zinc-900 hover:bg-zinc-800 hover:shadow-lg'
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
		</div>
	);
}
