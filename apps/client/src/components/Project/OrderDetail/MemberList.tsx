import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OrderMemberDetailDTO } from '@repo/shared';
import api from '@/lib/api';
import { selectToken } from '@/state/slices/authSlice';

interface MemberListProps {
	orderMembers: OrderMemberDetailDTO[];
	onAddMember: () => void;
}

type MemberType = 'adult' | 'youth';

interface MemberSlot {
	id: number;
	type: MemberType;
}

interface Member {
	id: string;
	no: string;
	name: string;
	phone: string | null;
	avatar: string | null;
	snowboard: number;
	skis: number;
	birthday: Date | null;
}

export default function MemberList({ orderMembers, onAddMember }: MemberListProps) {
	const [newMemberSlots, setNewMemberSlots] = useState<MemberSlot[]>([]);
	const [showTypeSelector, setShowTypeSelector] = useState(false);
	const [showMemberModal, setShowMemberModal] = useState(false);
	const [selectedSlotType, setSelectedSlotType] = useState<MemberType | null>(null);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [searchResults, setSearchResults] = useState<Member[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const selectorRef = useRef<HTMLDivElement>(null);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const accessToken = useSelector(selectToken);

	// 点击外部关闭选择器
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
				setShowTypeSelector(false);
			}
		};

		if (showTypeSelector) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showTypeSelector]);

	// 清理搜索超时
	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	// 搜索会员
	const searchMembers = useCallback(
		async (keyword: string) => {
			if (!keyword.trim()) {
				setSearchResults([]);
				setIsSearching(false);
				return;
			}

			if (!accessToken) {
				console.error('No access token available');
				setSearchResults([]);
				setIsSearching(false);
				return;
			}

			setIsSearching(true);
			try {
				const response = await api.get(`/api/member?keyword=${encodeURIComponent(keyword)}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setSearchResults(response.data.result.data || []);
			} catch (error) {
				console.error('搜索会员失败:', error);
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		},
		[accessToken],
	);

	// 处理搜索输入（带防抖）
	const handleSearchChange = (value: string) => {
		setSearchKeyword(value);

		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		if (!value.trim()) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);
		searchTimeoutRef.current = setTimeout(() => {
			searchMembers(value);
		}, 500);
	};

	const handleAddMemberClick = () => {
		setShowTypeSelector(!showTypeSelector);
	};

	const handleSelectType = (type: MemberType) => {
		setNewMemberSlots([...newMemberSlots, { id: newMemberSlots.length, type }]);
		setShowTypeSelector(false);
		onAddMember();
	};

	// 点击"加入"按钮，打开会员选择模态窗口
	const handleJoinClick = (slotType: MemberType) => {
		setSelectedSlotType(slotType);
		setShowMemberModal(true);
		setSearchKeyword('');
		setSearchResults([]);
	};

	// 选择会员
	const handleSelectMember = (member: Member) => {
		console.log('选中的会员:', member);
		// TODO: 调用API将会员添加到订单
		setShowMemberModal(false);
		setSearchKeyword('');
		setSearchResults([]);
	};

	// 关闭会员选择模态窗口
	const handleCloseModal = () => {
		setShowMemberModal(false);
		setSearchKeyword('');
		setSearchResults([]);
		setSelectedSlotType(null);
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
				{orderMembers.length + newMemberSlots.length <= 5 && (
					<div className='relative'>
						<div
							data-state='Default'
							data-type='Stroke_Blue+Icon'
							className='pl-1 pr-3 py-px rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-end items-center overflow-hidden cursor-pointer'
							onClick={handleAddMemberClick}
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

						{showTypeSelector && (
							<div
								ref={selectorRef}
								className='absolute top-full right-0 mt-2 w-auto min-w-[120px] p-2 bg-white rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.13)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-start overflow-hidden z-10'
							>
								<div
									onClick={() => handleSelectType('adult')}
									className='self-stretch px-3 py-2 bg-white hover:bg-gray-200 rounded-lg flex flex-col justify-start items-start gap-2.5 cursor-pointer transition-colors'
								>
									<div className='self-stretch inline-flex justify-start items-center gap-2'>
										<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6 whitespace-nowrap">
											成人
										</div>
									</div>
								</div>
								<div
									onClick={() => handleSelectType('youth')}
									className='self-stretch px-3 py-2 bg-white hover:bg-gray-200 rounded-lg flex flex-col justify-start items-start gap-2.5 cursor-pointer transition-colors'
								>
									<div className='self-stretch inline-flex justify-start items-center gap-2'>
										<div className="justify-start text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6 whitespace-nowrap">
											青少年/兒童
										</div>
									</div>
								</div>
							</div>
						)}
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
								data-property-1={
									member.memberBirthday && calculateAge(member.memberBirthday) >= 18 ? 'Adult Slot' : 'Children Slot'
								}
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
								key={`new-slot-${slot.id}`}
								data-owner-icon='false'
								data-property-1={slot.type === 'adult' ? 'Adult Slot' : 'Children Slot'}
								data-remove-button='true'
								data-reservation='false'
								className='self-stretch h-20 pl-3 pr-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center gap-3'
							>
								<div className='w-14 h-14 relative'>
									<div
										data-svg-wrapper
										data-property-1={slot.type === 'adult' ? 'Adult' : 'Children'}
										className='left-[3px] top-[3px] absolute'
									>
										<svg width='54' height='54' viewBox='0 0 54 54' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
										{slot.type === 'adult' ? '成人' : '青少年/兒童'}
									</div>
								</div>
								<div className='flex justify-start items-center gap-2'>
									<div
										data-state='Default'
										data-type='Primary_Rounded'
										className='px-3 py-2 bg-blue-600 rounded-[20px] flex justify-center items-center gap-2.5 overflow-hidden cursor-pointer hover:bg-blue-700 transition-colors'
										onClick={() => handleJoinClick(slot.type)}
									>
										<div className="text-center justify-start text-white text-xs font-medium font-['Noto_Sans_TC'] leading-5">
											加入
										</div>
									</div>
									<div
										data-state='Default'
										data-type='Stroke_Blue'
										className='px-3 py-2 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-blue-600 flex justify-center items-center gap-0.5 overflow-hidden cursor-pointer hover:bg-blue-50 transition-colors'
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

			{/* 会员选择模态窗口 */}
			{showMemberModal && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
					onClick={handleCloseModal}
				>
					<div
						className='bg-white rounded-2xl w-[600px] max-h-[80vh] flex flex-col shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]'
						onClick={(e) => e.stopPropagation()}
					>
						{/* 标题栏 */}
						<div className='flex justify-between items-center px-8 py-6 border-b border-gray-200'>
							<div className="text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
								選擇會員 ({selectedSlotType === 'adult' ? '成人' : '青少年/兒童'})
							</div>
							<div
								className='cursor-pointer p-1 hover:bg-gray-100 rounded-lg transition-colors'
								onClick={handleCloseModal}
							>
								<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='#52525B'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</div>
						</div>

						{/* 搜索框 */}
						<div className='px-8 pt-6 pb-4'>
							<div className='relative'>
								<input
									type='text'
									value={searchKeyword}
									onChange={(e) => handleSearchChange(e.target.value)}
									placeholder='搜尋會員姓名或電話'
									className="w-full px-4 py-3 pr-10 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-600 text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6"
								/>
								<div className='absolute right-3 top-1/2 -translate-y-1/2'>
									{isSearching ? (
										<div className='w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
									) : (
										<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
											<path
												d='M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z'
												stroke='#71717A'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
											<path
												d='M19 19L14.65 14.65'
												stroke='#71717A'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
									)}
								</div>
							</div>
						</div>

						{/* 搜索结果列表 */}
						<div className='flex-1 overflow-y-auto px-8 pb-6'>
							{searchKeyword.trim() === '' ? (
								<div className='flex flex-col items-center justify-center py-12 text-zinc-500'>
									<svg
										width='48'
										height='48'
										viewBox='0 0 48 48'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										className='mb-3'
									>
										<path
											d='M20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34Z'
											stroke='#A1A1AA'
											strokeWidth='3'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
										<path
											d='M42 42L30.3 30.3'
											stroke='#A1A1AA'
											strokeWidth='3'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
									<div className="text-sm font-normal font-['Noto_Sans_TC'] leading-6">
										請輸入會員姓名或電話進行搜尋
									</div>
								</div>
							) : (
								(() => {
									// 过滤掉已经在参加人员名单中的会员
									const existingMemberIds = new Set(orderMembers.map((m) => m.memberId));
									const filteredResults = searchResults.filter((member) => !existingMemberIds.has(member.id));
									console.log('过滤后的搜索结果:', existingMemberIds, searchResults);

									return filteredResults.length === 0 && !isSearching ? (
										<div className='flex flex-col items-center justify-center py-12 text-zinc-500'>
											<svg
												width='48'
												height='48'
												viewBox='0 0 48 48'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
												className='mb-3'
											>
												<path
													d='M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z'
													stroke='#A1A1AA'
													strokeWidth='3'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M24 16V24'
													stroke='#A1A1AA'
													strokeWidth='3'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M24 32H24.02'
													stroke='#A1A1AA'
													strokeWidth='3'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
											<div className="text-sm font-normal font-['Noto_Sans_TC'] leading-6">查無符合的會員</div>
										</div>
									) : (
										<div className='flex flex-col gap-2'>
											{filteredResults.map((member) => (
												<div
													key={member.id}
													className='p-4 border border-zinc-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-all'
													onClick={() => handleSelectMember(member)}
												>
													<div className='flex items-center gap-3'>
														<div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
															<img
																src={member.avatar || '/image/profile/default-avatar.png'}
																alt={member.name}
																className='w-full h-full object-cover'
															/>
														</div>
														<div className='flex-1'>
															<div className='flex items-center gap-2 mb-1'>
																<div className="text-zinc-800 text-base font-medium font-['Noto_Sans_TC'] leading-6">
																	{member.name}
																</div>
																<div className='flex items-center gap-1'>
																	{member.snowboard > 0 && (
																		<div className='px-2 py-1 bg-rose-50 rounded flex items-center gap-0.5'>
																			<span className="text-red-400 text-xs font-normal font-['Noto_Sans_TC'] leading-4">
																				單板{' '}
																			</span>
																			<span className="text-red-400 text-xs font-semibold font-['Poppins'] leading-5">
																				LV.{member.snowboard}
																			</span>
																		</div>
																	)}
																	{member.skis > 0 && (
																		<div className='px-2 py-1 bg-sky-100 rounded flex items-center gap-0.5'>
																			<span className="text-cyan-600 text-xs font-normal font-['Noto_Sans_TC'] leading-4">
																				雙板{' '}
																			</span>
																			<span className="text-cyan-600 text-xs font-semibold font-['Poppins'] leading-5">
																				LV.{member.skis}
																			</span>
																		</div>
																	)}
																</div>
															</div>
															<div className="text-zinc-500 text-xs font-normal font-['Poppins'] leading-5">
																{member.phone || '無電話'}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									);
								})()
							)}
						</div>
					</div>
				</div>
			)}
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
