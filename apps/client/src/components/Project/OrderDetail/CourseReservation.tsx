import { useEffect,useState } from 'react';
import {
	CoursePeople,
	CourseType,
	OrderMemberDetailDTO,
	OrderReservationResponseDto,
	ReservationStatus,
	ResponseWrapper,
} from '@repo/shared';

import DatePicker from '@/components/Project/Shared/DatePicker';
import { showToast } from '@/components/Project/Utils/Toast';
import api from '@/lib/api';

interface CourseReservationProps {
	orderReservations: OrderReservationResponseDto[];
	courseType: CourseType;
	orderMembers: OrderMemberDetailDTO[];
	coursePeople: CoursePeople[];
	adultCount: number;
	childCount: number;
	orderId: string;
	departmentId: string;
	accessToken: string;
	planNumber: number;
	onReservationCreated?: () => void;
	canAddReservation?: boolean;
	coursePlanName?: string;
	expDate?: Date;
}

const courseTypeMap = {
	[CourseType.GROUP]: '團體班教學',
	[CourseType.PRIVATE]: '私人班教學',
	[CourseType.INDIVIDUAL]: '個人練習',
};

export default function CourseReservation({
	orderReservations,
	courseType,
	orderMembers,
	coursePeople,
	adultCount,
	childCount,
	orderId,
	departmentId,
	accessToken,
	planNumber,
	onReservationCreated,
	canAddReservation = true,
	coursePlanName,
	expDate,
}: CourseReservationProps) {
	const [showMemberModal, setShowMemberModal] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
	const [showError, setShowError] = useState(false);
	const [showSurchargeModal, setShowSurchargeModal] = useState(false);
	const [showDatePickerModal, setShowDatePickerModal] = useState(false);
	const [selectedDateTime, setSelectedDateTime] = useState<string>('');
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
	const [cancelReason, setCancelReason] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showCancelReasonError, setShowCancelReasonError] = useState(false);
	const [fullyBookedSlots, setFullyBookedSlots] = useState<string[]>([]);

	// 獲取最低人數要求
	const minPeople = coursePeople.length > 0 ? Math.min(...coursePeople.map((cp) => cp.minPeople)) : 1;
	// 訂單總人數
	const totalOrderCount = adultCount + childCount;
	// 計算當前 active 預約數量
	const activeReservationCount = orderReservations.filter(
		(or) => or.reservation && or.reservation.reservationStatus !== ReservationStatus.CANCELED,
	).length;

	const toggleMemberSelection = (memberId: string) => {
		const newSelected = new Set(selectedMembers);
		if (newSelected.has(memberId)) {
			newSelected.delete(memberId);
		} else {
			newSelected.add(memberId);
		}
		setSelectedMembers(newSelected);
		// 清除錯誤提示當用戶重新選擇時
		if (showError) {
			setShowError(false);
		}
	};

	const handleNextStep = () => {
		// 檢查選擇的人數是否達到最低要求 (僅針對非團體班)
		if (courseType !== CourseType.GROUP && selectedMembers.size < minPeople) {
			setShowError(true);
			return;
		}

		setShowError(false);

		// 檢查選擇的人數是否超過訂單人數
		if (selectedMembers.size > totalOrderCount) {
			// 顯示加購通知彈窗
			setShowSurchargeModal(true);
			return;
		}

		// 驗證通過，顯示日期選擇彈窗
		setShowMemberModal(false);
		setShowDatePickerModal(true);
	};

	const handleSurchargeConfirm = () => {
		// 確認加購後，顯示日期選擇彈窗
		setShowSurchargeModal(false);
		setShowMemberModal(false);
		setShowDatePickerModal(true);
	};

	// 獲取所有已預約的日期時間（未取消的預約）
	const reservedDateTimes = orderReservations
		.filter((or) => or.reservation && or.reservation.reservationStatus !== ReservationStatus.CANCELED)
		.map((or) => {
			const classTime = or.reservation!.classTime;
			// 確保轉換為 ISO 字串格式
			return typeof classTime === 'string' ? classTime : new Date(classTime).toISOString();
		});

	// 獲取已滿的時段（每時段最多2個預約）
	useEffect(() => {
		const fetchFullyBookedSlots = async () => {
			try {
				// 獲取當前月份的開始和結束日期
				const now = new Date();
				const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
				const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0); // 獲取兩個月的資料

				const response = await api.get<ResponseWrapper<{ fullyBookedSlots: string[] }>>(
					`/api/orders/${orderId}/time-slot-availability`,
					{
						params: {
							startDate: startDate.toISOString().split('T')[0],
							endDate: endDate.toISOString().split('T')[0],
						},
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);

				if (response.data.result) {
					setFullyBookedSlots(response.data.result.fullyBookedSlots);
				}
			} catch (error) {
				console.error('獲取時段可用性失敗:', error);
			}
		};

		if (orderId && accessToken) {
			fetchFullyBookedSlots();
		}
	}, [orderId, accessToken]);

	const handleDateTimeChange = async (value: string) => {
		// DatePicker 在確認時會調用此函數並自動關閉
		setSelectedDateTime(value);
		setShowDatePickerModal(false);

		try {
			// 確定 teachingLevel - 使用選中成員的最高技能等級
			// 調用創建預約 API
			const response = await api.post(
				'/api/reservations',
				{
					departmentId,
					classTime: new Date(value).toISOString(),
					orderId,
					orderMemberIds: Array.from(selectedMembers),
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (response.status === 201) {
				showToast('預約課程成功！', 'success');
				// 調用回調函數刷新數據
				if (onReservationCreated) {
					onReservationCreated();
				}
			}
		} catch (error: any) {
			console.error('創建預約失敗:', error);
			const errorMessage = error.response?.data?.message || '創建預約失敗，請稍後再試';
			showToast(errorMessage, 'error');
		} finally {
			// 重置選擇狀態
			setSelectedMembers(new Set());
			// 清除選擇的日期時間
			setSelectedDateTime('');
		}
	};

	const handleCloseDatePicker = () => {
		setShowDatePickerModal(false);
		// 取消時也清除選擇狀態
		setSelectedMembers(new Set());
		// 清除選擇的日期時間
		setSelectedDateTime('');
	};

	const handleCancelReservation = async () => {
		if (!selectedReservationId || !cancelReason.trim()) {
			setShowCancelReasonError(true);
			return;
		}

		setIsLoading(true);
		try {
			const response = await api.put(
				`/api/reservations/${selectedReservationId}/cancel`,
				{ reason: cancelReason },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (response.status === 200) {
				showToast('預約已成功取消', 'success');
				setShowCancelModal(false);
				setCancelReason('');
				setShowCancelReasonError(false);
				setSelectedReservationId(null);
				// 刷新預約列表
				if (onReservationCreated) {
					onReservationCreated();
				}
			}
		} catch (error: any) {
			console.error('取消預約失敗:', error);
			const errorMessage = error.response?.data?.message || '取消預約失敗，請稍後再試';
			showToast(errorMessage, 'error');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{/* 選人彈窗 */}
			{showMemberModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-[580px] bg-white rounded-[20px] shadow-[0_10px_26px_0_rgba(0,0,0,0.13)] flex flex-col'>
						{/* 彈窗標題 */}
						<div className='w-full h-[68px] bg-white flex items-center justify-between px-8 relative'>
							<div className="text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">參加人員</div>
							<button
								onClick={() => setShowMemberModal(false)}
								className='w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors'
							>
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='#2B2B2B'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						{/* 錯誤提示 */}
						{showError && (
							<div className='w-full px-8 pb-2'>
								<div
									data-property-1='Alert'
									className='self-stretch pr-1 py-[3px] bg-rose-100 rounded-lg inline-flex justify-start items-center'
								>
									<div className='self-stretch pl-3 pr-2 py-1.5 flex justify-start items-start'>
										<div className='w-6 h-6 relative'>
											<svg
												width='20'
												height='20'
												viewBox='0 0 20 20'
												className='absolute left-[2px] top-[2px]'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 11C9.45 11 9 10.55 9 10V6C9 5.45 9.45 5 10 5C10.55 5 11 5.45 11 6V10C11 10.55 10.55 11 10 11ZM11 15H9V13H11V15Z'
													fill='#DC2626'
												/>
											</svg>
										</div>
									</div>
									<div className='flex-1 pr-2 py-1.5 inline-flex flex-col justify-center items-start gap-1'>
										<div className="self-stretch justify-start text-red-600 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
											必須至少選擇{minPeople}位參加人員，請選擇參加人員。
										</div>
									</div>
								</div>
							</div>
						)}

						{/* 彈窗內容 */}
						<div className='w-full px-8 pb-8 flex flex-col gap-2'>
							<div className='w-full'>
								<div className="text-neutral-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
									選擇參加課程的人員
								</div>
							</div>

							<div className='w-full flex flex-col gap-2 max-h-[400px] overflow-y-auto'>
								{orderMembers.map((member) => (
									<div
										key={member.id}
										onClick={() => toggleMemberSelection(member.id)}
										className='w-full h-[84px] px-[18px] py-3 bg-white rounded-xl border border-zinc-300 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors'
									>
										{/* 選擇框 */}
										<div className='w-6 h-6 flex items-center justify-center'>
											<div
												className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
													selectedMembers.has(member.id) ? 'bg-blue-600' : 'border-2 border-gray-300'
												}`}
											>
												{selectedMembers.has(member.id) && (
													<svg
														width='12'
														height='12'
														viewBox='0 0 12 12'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M2 6L5 9L10 3'
															stroke='white'
															strokeWidth='2'
															strokeLinecap='round'
															strokeLinejoin='round'
														/>
													</svg>
												)}
											</div>
										</div>

										{/* 成員資訊 */}
										<div className='flex-1 flex items-center gap-3'>
											{/* 頭像 */}
											<div className='w-[60px] h-[60px] relative'>
												<img
													src={member.avatar || '/image/profile/default-avatar.png'}
													alt={member.memberName}
													className='w-[54px] h-[54px] rounded-full object-cover absolute left-[3px] top-[3px]'
												/>
											</div>

											{/* 姓名和技能等級 */}
											<div className='flex-1 flex flex-col justify-center gap-0'>
												<div className='flex items-center gap-2'>
													<div className="text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
														{member.memberName}
													</div>
													<div className='flex items-center gap-1.5 pt-[3px]'>
														{member.snowboard > 0 && (
															<div className='px-[5px] py-[5px] bg-orange-50 rounded flex items-end gap-0.5'>
																<span className="text-orange-500 text-xs font-normal font-['Noto_Sans_TC'] leading-4">
																	單板{' '}
																</span>
																<span className='text-orange-500 text-xs font-semibold font-poppins leading-[19px]'>
																	LV.{member.snowboard}
																</span>
															</div>
														)}
														{member.skis > 0 && (
															<div className='px-[5px] py-[5px] bg-blue-50 rounded flex items-end gap-0.5'>
																<span className="text-blue-700 text-xs font-normal font-['Noto_Sans_TC'] leading-4">
																	雙板{' '}
																</span>
																<span className='text-blue-700 text-xs font-semibold font-poppins leading-[19px]'>
																	LV.{member.skis}
																</span>
															</div>
														)}
													</div>
												</div>
												<div className='text-neutral-500 text-xs font-normal font-poppins leading-4'>
													{member.memberPhone}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 彈窗底部按鈕 */}
						<div className='w-full px-8 py-5 border-t border-zinc-300 bg-white rounded-b-[20px] flex justify-end gap-2'>
							<button
								onClick={() => setShowMemberModal(false)}
								className="px-5 py-2 bg-white rounded-lg border border-zinc-800 text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6 hover:bg-gray-50 transition-colors"
							>
								取消
							</button>
							<button
								onClick={handleNextStep}
								disabled={selectedMembers.size === 0}
								className="px-5 py-2 bg-zinc-800 rounded-lg text-white text-sm font-medium font-['Noto_Sans_TC'] leading-6 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								下一步
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 加購通知彈窗 */}
			{showSurchargeModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-96 bg-white rounded-[20px] shadow-[0px_10px_26px_0px_rgba(0,0,0,0.13)] inline-flex flex-col justify-start items-center overflow-hidden'>
						<div className='self-stretch h-16 relative bg-white'>
							<button
								onClick={() => setShowSurchargeModal(false)}
								className='w-10 h-10 absolute left-[352px] top-[8px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors'
							>
								<div className='w-6 h-6 overflow-hidden'>
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M18 6L6 18M6 6L18 18'
											stroke='#737373'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</div>
							</button>
							<div className="absolute left-[32px] top-[20px] justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
								增加上課人數需支付加價費
							</div>
						</div>
						<div className='self-stretch px-8 pt-4 pb-10 flex flex-col justify-start items-center gap-2.5'>
							<div className="self-stretch justify-start text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
								因您增加了此次課程預約的人數，需要支付加價費用{coursePeople[0].addPrice}
								元，請於此預約上課時現場完成繳費。若有相關疑問請隨時聯繫CitySki工作人員。
							</div>
						</div>
						<div className='self-stretch px-8 py-5 bg-white border-t border-zinc-300 inline-flex justify-end items-center gap-2'>
							<button
								onClick={handleSurchargeConfirm}
								data-icon='false'
								data-state='Default'
								data-type='Primary'
								className='px-5 py-2 bg-zinc-800 rounded-lg flex justify-center items-center gap-2.5 overflow-hidden hover:bg-zinc-700 transition-colors cursor-pointer'
							>
								<div className="text-center justify-start text-white text-sm font-medium font-['Noto_Sans_TC'] leading-6">
									確認
								</div>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 日期選擇彈窗 */}
			{showDatePickerModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-white rounded-[20px] shadow-[0px_10px_26px_0px_rgba(0,0,0,0.13)] overflow-hidden'>
						<DatePicker
							value={selectedDateTime || ''}
							handleChange={handleDateTimeChange}
							handleCloseModal={handleCloseDatePicker}
							reservedDateTimes={reservedDateTimes}
							fullyBookedSlots={fullyBookedSlots}
							maxDate={expDate}
						/>
					</div>
				</div>
			)}

			{/* 原有的課程預約內容 */}
			<div
				data-property-1='Initial'
				data-reservation-info={orderReservations.length > 0 ? 'true' : 'false'}
				className='self-stretch px-8 pt-6 pb-8 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start gap-6'
			>
				<div className='self-stretch inline-flex justify-between items-center'>
					<div className="justify-start text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
						課程預約
					</div>
					{canAddReservation && activeReservationCount < planNumber && (
						<button
							onClick={() => {
								if (orderMembers.length === 0) {
									showToast('請先加入參加人員', 'error');
									return;
								}
								setShowMemberModal(true);
							}}
							data-state='Active'
							data-type='Stroke_Blue+Icon'
							className='pl-1 pr-3 py-px rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 flex justify-center items-center overflow-hidden cursor-pointer hover:bg-blue-50 transition-colors'
						>
							<div data-svg-wrapper>
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path d='M7 12H17M12 7L12 17' stroke='#0F72ED' strokeWidth='1.4' strokeLinecap='round' />
								</svg>
							</div>
							<div className="text-center justify-start text-blue-600 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
								預約課程
							</div>
						</button>
					)}
				</div>

				{orderReservations.length === 0 ? (
					<div className='self-stretch h-20 px-72 py-8 inline-flex justify-center items-center gap-2.5'>
						<div className="text-center justify-start text-zinc-500 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
							目前沒有預約課程
						</div>
					</div>
				) : (
					<>
						<div className='self-stretch h-px bg-gray-200' />
						<div className='self-stretch inline-flex flex-col justify-start items-start gap-2'>
							<div className='self-stretch inline-flex justify-start items-start gap-2 flex-wrap content-start'>
								{orderReservations
									.filter((or) => or.reservation)
									.filter((or) => or.reservation!.reservationStatus !== ReservationStatus.CANCELED)
									.map((orderRes, index) => {
										const reservation = orderRes.reservation!;
										const classTime = new Date(reservation.classTime);
										const formattedDate = `${classTime.getFullYear()}/${classTime.getMonth() + 1}/${classTime.getDate()} ${classTime.getHours().toString().padStart(2, '0')}:${classTime.getMinutes().toString().padStart(2, '0')}`;

										return (
											<div
												key={orderRes.id}
												data-property-1={index === 0 ? 'Next time' : 'Default'}
												data-show-level='false'
												data-state='Default'
												className='w-36 relative bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-center items-center gap-2 overflow-hidden group'
											>
												{/* 卡片內容 */}
												<div className='w-36 px-3 pt-3 pb-3.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-center items-center gap-2'>
													<div className='self-stretch h-28 relative'>
														<div className='w-full inline-flex flex-col justify-start items-center gap-3'>
															<div className='inline-flex justify-center items-center gap-1'>
																<div className="text-center justify-start text-zinc-800 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
																	{courseTypeMap[courseType]}
																</div>
															</div>
															<div className='self-stretch flex flex-col justify-start items-center gap-3'>
																<div className='inline-flex justify-center items-center gap-1'>
																	<div className="justify-start text-zinc-800 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
																		第
																	</div>
																	<div className='justify-start text-zinc-800 text-4xl font-medium font-poppins leading-9'>
																		{orderRes.index + 1}
																	</div>
																	<div className="justify-start text-zinc-800 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
																		堂
																	</div>
																</div>
																<div className='self-stretch inline-flex justify-center items-center'>
																	{reservation.reservationMembers?.slice(0, 2).map((resMember, idx) => (
																		<div
																			key={resMember.id}
																			data-show-hover='false'
																			data-size={idx === 0 ? '36' : 'User_36'}
																			className={`w-6 h-6 relative rounded-[99px] overflow-hidden ${idx > 0 ? 'outline outline-2 outline-white -ml-2' : ''}`}
																		>
																			<img
																				className='w-6 h-6 left-0 top-0 absolute rounded-[99px]'
																				src={
																					resMember.orderMember?.member?.avatar || '/image/profile/default-avatar.png'
																				}
																				alt={resMember.orderMember?.member?.name || 'Member'}
																			/>
																		</div>
																	))}
																</div>
															</div>
														</div>
													</div>
													<div className='justify-start text-zinc-800 text-sm font-normal font-poppins leading-6 border-t border-gray-200 pt-2'>
														{formattedDate}
													</div>
												</div>

												{/* Hover 遮罩層 */}
												<div className='w-36 h-44 left-0 top-0 absolute bg-zinc-800/80 flex flex-col justify-center items-center gap-2 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity'>
													<button
														disabled
														data-state='Default'
														data-type='Stroke_Rounded'
														className='px-3 py-2 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-center items-center gap-2.5 overflow-hidden hover:bg-white/10 transition-colors cursor-not-allowed opacity-50'
													>
														<div className="text-center justify-start text-white text-xs font-medium font-['Noto_Sans_TC'] leading-5">
															修改預約
														</div>
													</button>
													<button
														onClick={() => {
															setSelectedReservationId(reservation.id);
															setShowCancelModal(true);
														}}
														disabled={reservation.reservationStatus !== ReservationStatus.SCHEDULED}
														data-state='Default'
														data-type='Stroke_Rounded'
														className={`px-3 py-2 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-center items-center gap-2.5 overflow-hidden transition-colors ${
															reservation.reservationStatus === ReservationStatus.SCHEDULED
																? 'hover:bg-white/10 cursor-pointer'
																: 'cursor-not-allowed opacity-50'
														}`}
													>
														<div className="text-center justify-start text-white text-xs font-medium font-['Noto_Sans_TC'] leading-5">
															取消預約
														</div>
													</button>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</>
				)}
			</div>

			{/* 取消預約彈窗 */}
			{showCancelModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-[400px] h-[354px] bg-white rounded-[20px] shadow-[0px_10px_26px_0px_rgba(0,0,0,0.13)] flex flex-col items-center justify-between overflow-hidden'>
						{/* 彈窗標題 */}
						<div className='self-stretch h-16 relative bg-white flex items-center justify-between px-8'>
							<div className="text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">取消預約</div>
							<button
								onClick={() => {
									setShowCancelModal(false);
									setCancelReason('');
									setShowCancelReasonError(false);
								}}
								className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors'
							>
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='#737373'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						{/* 內容 */}
						<div className='self-stretch px-8 pt-4 pb-8 flex flex-col justify-start items-center gap-4'>
							<div className="text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
								若取消預約，請注意根據取消政策可能會產生額外費用。確定要取消預約嗎？
							</div>
							<div className='w-full'>
								<textarea
									value={cancelReason}
									onChange={(e) => {
										setCancelReason(e.target.value);
										if (e.target.value.trim()) {
											setShowCancelReasonError(false);
										}
									}}
									placeholder='輸入取消原因'
									className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none text-zinc-800 font-normal font-['Noto_Sans_TC'] ${
										showCancelReasonError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
									}`}
									rows={1}
								/>
								<div className='h-6'>
									{showCancelReasonError && (
										<div className="text-red-500 text-sm font-normal font-['Noto_Sans_TC'] mt-2">必填欄位</div>
									)}
								</div>
							</div>
						</div>

						{/* 按鈕區域 */}
						<div className='self-stretch px-8 py-5 bg-white border-t border-zinc-300 inline-flex justify-end items-center gap-3'>
							<button
								onClick={() => {
									setShowCancelModal(false);
									setCancelReason('');
									setShowCancelReasonError(false);
								}}
								className="px-6 py-2.5 bg-white rounded-lg border border-zinc-800 text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6 hover:bg-gray-50 transition-colors cursor-pointer"
							>
								不，保留預約
							</button>
							<button
								onClick={handleCancelReservation}
								disabled={isLoading}
								className="px-6 py-2.5 bg-red-600 rounded-lg text-white text-sm font-medium font-['Noto_Sans_TC'] leading-6 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
							>
								{isLoading ? '處理中...' : '取消預約'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
