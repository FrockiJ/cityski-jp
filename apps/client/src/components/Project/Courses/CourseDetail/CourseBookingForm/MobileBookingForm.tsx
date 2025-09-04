import { useEffect, useRef, useState } from 'react';
import { CourseSkiType, CourseType, GetCourseDetailResponseDTO } from '@repo/shared';
import { X } from 'lucide-react';

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { BookingFormArea, BookingFormAreaEnum } from '@/shared/constants/enums';

import { MobileDateAreaContent } from './MobileDateAreaContent';
import MobileDateField from './MobileDateField';
import { MobileNumberField } from './MobileNumberField';
import { MobileParticipantsAreaContent } from './MobileParticipantsAreaContent';
import { MobilePlanAreaContent } from './MobilePlanAreaContent';
import { MobileSelectField } from './MobileSelectField';
import { SelectBoardField } from './SelectBoardField';

interface CourseBookingFormProps {
	data: GetCourseDetailResponseDTO;
	onSubmit: (formData: FormData) => void;
}
interface FormData {
	plan: string;
	boardType: number;
	participants: { adult: number; minor: number };
	date?: string;
}

const MobileBookingForm = ({ data, onSubmit }: CourseBookingFormProps) => {
	const contentRef = useRef(null);
	const [area, setArea] = useState<BookingFormAreaEnum>(BookingFormArea.FORM);
	const [isOpen, setIsOpen] = useState(false);
	const handleOpenFormModal = () => {
		setIsOpen(true);
	};
	const [formData, setFormData] = useState<FormData>({
		plan: '',
		boardType: null,
		participants: { adult: 2, minor: 1 },
		date: '',
	});

	const handleSetBookingFormArea = (area: BookingFormAreaEnum) => {
		console.log('area', area);
		setArea(area);
	};

	const handleBack = () => {
		setArea(BookingFormArea.FORM);
	};

	const handleChange = (name: keyof FormData, value: string | number | { adult: number; minor: number }) => {
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSelectSkiType = (type: CourseSkiType) => {
		setFormData((prev) => ({ ...prev, boardType: type }));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onSubmit(formData);
	};

	const handleOpenChange = (newOpen) => {
		setIsOpen(newOpen);
		// 動畫結束後執行
		if (!newOpen && contentRef.current) {
			// 監聽關閉動畫結束
			contentRef.current.addEventListener(
				'animationend',
				() => {
					setArea(BookingFormArea.FORM);
				},
				{ once: true }, // 事件只觸發一次
			);
		}
	};

	useEffect(() => {
		if (!data) return;

		if (data.skiType === CourseSkiType.BOTH || data.skiType === CourseSkiType.SKI) {
			setFormData((prev) => ({ ...prev, plan: data.coursePlans?.[0].id, boardType: 2 }));
		} else {
			setFormData((prev) => ({ ...prev, plan: data.coursePlans?.[0].id, boardType: 1 }));
		}
	}, [data]);

	const totalPrice = 1600; // This should be calculated based on the form data

	// const currentPlan = data?.coursePlans.find(plan => plan.id === formData.plan)
	// const maxPeople = data?.coursePeople;
	return (
		<div tabIndex={-1}>
			<div className='py-[16px] px-[20px] xs:hidden  absolute z-10 left-0 bottom-0 p-10px w-[100%] h-[80px] bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10),0px_1px_16px_0px_rgba(0,0,0,0.05)]'>
				<div className='flex justify-between'>
					<p className='self-end text-[20px] font-bold text-[#2b2b2b] font-poppins'>
						1,600<span className='text-[14px]'>元</span>
					</p>
					<button
						type='button'
						className='py-[12px] px-[40px] text-white font-bold bg-gradient-to-r from-[#FE696C] to-[#FD8E4B] rounded-[8px]'
						onClick={handleOpenFormModal}
					>
						立即預訂
					</button>
				</div>
			</div>
			<Drawer open={isOpen} onOpenChange={(trigger) => handleOpenChange(trigger)}>
				<DrawerContent ref={contentRef}>
					{area == BookingFormArea.FORM && (
						<div className='mx-auto w-full max-w-sm'>
							<DrawerHeader className='h-[48px] relative'>
								<DrawerTitle>
									<button
										onClick={() => setIsOpen(false)}
										className='absolute right-4 top-4 text-white hover:opacity-70'
										style={{ border: 'none', outline: 'none' }}
									>
										<X size={20} color='black' />
									</button>
								</DrawerTitle>
								<DrawerDescription hidden />
							</DrawerHeader>
							<div className='px-5 pb-2'>
								<div>
									<form onSubmit={handleSubmit} className='flex w-[auto] flex-col'>
										<h2 className='text-2xl font-medium tracking-tight leading-tight text-[#2b2b2b]'>{data?.name}</h2>
										<div className='flex flex-col mt-4 w-full'>
											{/* 方案 */}
											<MobileSelectField
												label='方案'
												plans={data?.coursePlans}
												value={formData.plan}
												handleClick={() => handleSetBookingFormArea(BookingFormArea.SELECT_PLAN)}
											/>
											{/* 板類 */}
											<SelectBoardField formData={formData} onChange={(value) => handleChange('boardType', value)} />
											{/* 人數 */}
											<MobileNumberField
												label='人數'
												participants={formData.participants}
												handleClick={() => handleSetBookingFormArea(BookingFormArea.SELECT_PARTICIPANT)}
											/>
											{/* 日期 */}
											<MobileDateField
												label='日期'
												value={formData.date}
												handleClick={() => handleSetBookingFormArea(BookingFormArea.SELECT_DATE_TIME)}
											/>
											<div className='flex gap-2 justify-end items-center pt-4 mt-5 w-full whitespace-nowrap border-t border-solid border-t-gray-200 text-zinc-800'>
												<div className='flex gap-2 items-center self-stretch my-auto'>
													<span className='self-stretch my-auto text-base font-medium'>總計</span>
													<div className='flex gap-0.5 items-center self-stretch my-auto'>
														<span className='self-stretch my-auto text-2xl font-semibold tracking-tighter leading-none'>
															{totalPrice.toLocaleString()}
														</span>
														<span className='self-stretch my-auto text-base font-medium'>元</span>
													</div>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
							<DrawerFooter>
								<button
									type='button'
									className='py-[12px] px-[40px] text-white font-bold bg-gradient-to-r from-[#FE696C] to-[#FD8E4B] rounded-[8px]'
									onClick={handleOpenFormModal}
								>
									立即預訂
								</button>
							</DrawerFooter>
						</div>
					)}

					{area == BookingFormArea.SELECT_PLAN && (
						<MobilePlanAreaContent
							value={formData.plan}
							plans={data.coursePlans}
							onChange={(value) => handleChange('plan', value)}
							handleBack={handleBack}
						/>
					)}

					{area == BookingFormArea.SELECT_PARTICIPANT && (
						<MobileParticipantsAreaContent
							participants={formData.participants}
							value={formData.plan}
							onChange={(value) => handleChange('participants', value)}
							handleBack={handleBack}
							max={data?.type === CourseType.PRIVATE ? data?.coursePeople?.[0]?.maxPeople : 0}
						/>
					)}

					{area == BookingFormArea.SELECT_DATE_TIME && (
						<MobileDateAreaContent
							value={formData.date}
							onChange={(value) => handleChange('date', value)}
							handleBack={handleBack}
						/>
					)}
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default MobileBookingForm;
