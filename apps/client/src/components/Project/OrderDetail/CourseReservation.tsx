import { OrderReservationResponseDto, CourseType } from '@repo/shared';

interface CourseReservationProps {
	orderReservations: OrderReservationResponseDto[];
	courseType: CourseType;
}

const courseTypeMap = {
	[CourseType.GROUP]: '團體班教學',
	[CourseType.PRIVATE]: '私人班教學',
	[CourseType.INDIVIDUAL]: '個人練習',
};

export default function CourseReservation({ orderReservations, courseType }: CourseReservationProps) {
	return (
		<div
			data-property-1='Initial'
			data-reservation-info={orderReservations.length > 0 ? 'true' : 'false'}
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
							<path d='M7 12H17M12 7L12 17' stroke='#ACACAC' strokeWidth='1.4' strokeLinecap='round' />
						</svg>
					</div>
					<div className="text-center justify-start text-neutral-400 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
						預約課程
					</div>
				</div>
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
											className='w-36 px-3 pt-5 pb-3.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-center items-center gap-2'
										>
											<div className='self-stretch h-28 relative border-b border-gray-200'>
												<div className='w-14 left-[34px] top-0 absolute inline-flex flex-col justify-start items-center gap-5'>
													<div className='inline-flex justify-center items-center gap-1'>
														<div className="text-center justify-start text-zinc-800 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
															{courseTypeMap[courseType]}
														</div>
													</div>
													<div className='self-stretch flex flex-col justify-start items-center gap-4'>
														<div className='inline-flex justify-center items-center gap-1'>
															<div className="justify-start text-zinc-800 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
																第
															</div>
															<div className="justify-start text-zinc-800 text-4xl font-medium font-['Poppins'] leading-9">
																{orderRes.index + 1}
															</div>
															<div className="justify-start text-zinc-800 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
																堂
															</div>
														</div>
														<div className='self-stretch inline-flex justify-center items-center'>
															{reservation.reservationMembers
																?.slice(0, 2)
																.map((resMember, idx) => (
																	<div
																		key={resMember.id}
																		data-show-hover='false'
																		data-size={idx === 0 ? '36' : 'User_36'}
																		className={`w-6 h-6 relative rounded-[99px] overflow-hidden ${idx > 0 ? 'outline outline-2 outline-white -ml-2' : ''}`}
																	>
																		<img
																			className='w-6 h-6 left-0 top-0 absolute rounded-[99px]'
																			src={
																				resMember.orderMember?.member?.avatar ||
																				'/image/profile/default-avatar.png'
																			}
																			alt={resMember.orderMember?.member?.name || 'Member'}
																		/>
																	</div>
																))}
														</div>
													</div>
												</div>
											</div>
											<div className="justify-start text-zinc-800 text-sm font-normal font-['Poppins'] leading-6">
												{formattedDate}
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
