import { useState } from 'react';
import { OrderMemberDetailDTO } from '@repo/shared';

interface MemberListProps {
	orderMembers: OrderMemberDetailDTO[];
	onAddMember: () => void;
}

export default function MemberList({ orderMembers, onAddMember }: MemberListProps) {
	const [newMemberSlots, setNewMemberSlots] = useState<number[]>([]);

	const handleAddMember = () => {
		setNewMemberSlots([...newMemberSlots, newMemberSlots.length]);
		onAddMember();
	};

	return (
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
				{(orderMembers.length + newMemberSlots.length) <= 5 && (
					<div
						data-state='Default'
						data-type='Stroke_Blue+Icon'
						className='pl-1 pr-3 py-px rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-end items-center overflow-hidden cursor-pointer'
						onClick={handleAddMember}
					>
						<div data-svg-wrapper>
							<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M7 12H17M12 7L12 17' stroke='#0F72ED' strokeWidth='1.4' strokeLinecap='round' />
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
									fillRule='evenodd'
									clipRule='evenodd'
									d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5Z'
									fill='#0F72ED'
								/>
							</svg>
						</div>
					</div>
					<div className='flex-1 pr-2 py-1.5 inline-flex flex-col justify-center items-start gap-1'>
						<div className="self-stretch justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6">
							點擊「加入」按鈕，將親友加入參加人員名單；若親友還未註冊成為CitySki會員，可點擊「邀請加入會員」按鈕，邀請親友加入
						</div>
					</div>
				</div>

				<div className='self-stretch flex flex-col justify-start items-start gap-3'>
					<div className='self-stretch flex flex-col justify-start items-start gap-2'>
						{orderMembers.map((member, index) => (
							<div
								key={member.id}
								data-owner-icon={index === 0 ? 'true' : 'false'}
								data-property-1={member.memberBirthday && calculateAge(member.memberBirthday) >= 18 ? 'Adult Slot' : 'Children Slot'}
								data-remove-button='false'
								data-reservation='true'
								className='self-stretch h-20 pl-3 pr-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center gap-3'
							>
								<div className='w-14 h-14 relative'>
									<img
										src={member.avatar || '/image/profile/default-avatar.png'}
										alt={member.memberName}
										className='w-14 h-14 rounded-full'
									/>
								</div>
								<div className='flex-1 inline-flex flex-col justify-center items-start'>
									<div className='self-stretch inline-flex justify-start items-center gap-2'>
										<div className='justify-start'>
											<span className="text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
												{member.memberName}
											</span>
										</div>
									</div>
									<div className='self-stretch h-6 inline-flex justify-start items-center gap-1'>
										<div className="justify-start text-neutral-400 text-xs font-normal font-['Noto_Sans_TC'] leading-5">
											單板 LV.{member.snowboard} | 雙板 LV.{member.skis}
										</div>
									</div>
								</div>
							</div>
						))}

						{newMemberSlots.map((slot, index) => (
							<div
								key={`new-slot-${slot}`}
								data-owner-icon='false'
								data-property-1='Adult Slot'
								data-remove-button='true'
								data-reservation='false'
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
											<g clipPath='url(#clip0_10617_4184)'>
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
														fillRule='evenodd'
														clipRule='evenodd'
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
											<span className="text-zinc-500 text-base font-medium font-['Poppins'] leading-6">
												{orderMembers.length + index + 1}
											</span>
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
										className='px-3 py-2 bg-blue-600 rounded-[20px] flex justify-center items-center gap-2.5 overflow-hidden cursor-pointer'
									>
										<div className="text-center justify-start text-white text-xs font-medium font-['Noto_Sans_TC'] leading-5">
											加入
										</div>
									</div>
									<div
										data-state='Default'
										data-type='Stroke_Blue'
										className='px-3 py-2 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 flex justify-center items-center gap-0.5 overflow-hidden cursor-pointer'
									>
										<div className="text-center justify-start text-blue-600 text-xs font-medium font-['Noto_Sans_TC'] leading-5">
											邀請加入會員
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function calculateAge(birthday: Date): number {
	const today = new Date();
	const birthDate = new Date(birthday);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}
