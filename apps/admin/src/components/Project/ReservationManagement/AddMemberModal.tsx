import { useState, useCallback } from 'react';
import {
	Stack,
	Box,
	CircularProgress,
	Typography,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Chip,
	Paper,
	Avatar,
	Divider,
} from '@mui/material';
import { MemberResponseDto, OrderMemberSearchResponseDto } from '@repo/shared';
import SearchBar from '@/components/Common/CIBase/CoreDynamicTable/SearchBar';
import { useSearchOrderMembers } from '@/hooks/useSearchOrderMembers';
import { useSearchMembers } from '@/hooks/useSearchMembers';

type Props = {
	onSelectMember?: (member: OrderMemberSearchResponseDto | MemberResponseDto) => void;
	handleCloseModal?: (action: any) => void;
	searchType: 'members' | 'orderMembers';
};

const AddMemberModal = ({ onSelectMember, handleCloseModal, searchType }: Props) => {
	const [searchValue, setSearchValue] = useState('');
	const {
		searchResults: searchOrderResults,
		loading: searchOrderLoading,
		searchMembers: searchOrderMembers,
	} = useSearchOrderMembers(500);
	const {
		searchResults: searchMemberResults,
		loading: searchMemberLoading,
		searchMembers: searchMembers,
	} = useSearchMembers(500);

	const loading = searchType === 'members' ? searchMemberLoading : searchOrderLoading;
	const searchResults = searchType === 'members' ? searchMemberResults : searchOrderResults;
	const searchMembersFunc = searchType === 'members' ? searchMembers : searchOrderMembers;

	// 處理搜尋輸入變化
	const handleSearchChange = useCallback(
		(_event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>, value: string | null) => {
			const searchText = value || '';
			setSearchValue(searchText);
			searchMembersFunc(searchText);
		},
		[searchMembers, searchType, searchOrderMembers],
	);

	// 處理選擇會員
	const handleSelectMember = (member: OrderMemberSearchResponseDto | MemberResponseDto) => {
		if (onSelectMember) {
			console.log('selected member:', member);
			onSelectMember(member);
		}
		// 清空搜尋
		setSearchValue('');
		// 關閉 modal
		if (handleCloseModal) {
			handleCloseModal('confirm');
		}
	};
	console.log(searchResults);
	return (
		<Stack py={3} spacing={2}>
			<SearchBar
				title='搜尋會員帳號'
				value={searchValue}
				onChange={handleSearchChange}
				placeholder='搜尋姓名、手機或是Email'
			/>

			{/* Loading 指示器 */}
			{loading && (
				<Box display='flex' justifyContent='center' py={2}>
					<CircularProgress size={24} />
				</Box>
			)}

			{/* 搜尋結果列表 */}
			{!loading && searchResults.length > 0 && (
				<>
					{searchResults.map((member) => {
						let pureMember = member as MemberResponseDto;
						let order: OrderMemberSearchResponseDto['order'] | undefined = undefined;
						if (searchType === 'orderMembers') {
							order = (member as OrderMemberSearchResponseDto).order;
							pureMember = (member as OrderMemberSearchResponseDto).member;
						}

						return (
							<ListItem key={pureMember.id} disablePadding divider>
								<ListItemButton onClick={() => handleSelectMember(member)}>
									<Paper
										sx={{
											p: 2.5,
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											borderRadius: 2,
											bgcolor: 'background.paper',
										}}
									>
										{/* 左側：頭像 + 姓名/標籤 + Email */}
										<Stack direction='row' alignItems='center' spacing={1.5} sx={{ width: 256 }}>
											<Box sx={{ position: 'relative', width: 40, height: 40 }}>
												<Avatar
													src={pureMember.avatar || undefined}
													alt='avatar'
													sx={{ width: 36, height: 36, position: 'absolute', top: 2, left: 2, borderRadius: 99 }}
												/>
											</Box>

											<Stack spacing={0.5}>
												<Stack direction='row' alignItems='center' spacing={1} sx={{ flexWrap: 'wrap' }}>
													<Typography variant='body1' color='text.primary'>
														{pureMember.name}
													</Typography>

													{/* 單板 LV.2 Badge */}
													<Chip
														size='small'
														label={
															<Box component='span' sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
																<Typography
																	component='span'
																	variant='caption'
																	sx={{ lineHeight: 1.25, fontWeight: 400 }}
																>
																	單板LV.{pureMember.skis} 雙板LV.{pureMember.snowboard}
																</Typography>
																<Typography
																	component='span'
																	variant='caption'
																	sx={{ lineHeight: 1.25, fontWeight: 600 }}
																></Typography>
															</Box>
														}
														sx={(theme) => ({
															px: 0.75,
															height: 24,
															borderRadius: 1,
															// bgcolor: alpha(theme.palette.error.main, 0.08), // 近似 rose-50
															color: theme.palette.error.main,
															'& .MuiChip-label': { px: 0.5, py: 0.25 },
														})}
														variant='filled'
													/>
												</Stack>

												<Typography variant='caption' color='text.secondary'>
													{pureMember.email || '無 Email'}
												</Typography>
											</Stack>
										</Stack>

										{/* 中段欄位：手機號碼 */}
										<Stack spacing={1} sx={{ minWidth: 140 }}>
											<Typography variant='caption' color='text.secondary'>
												手機號碼
											</Typography>
											<Typography variant='body2' color='text.primary'>
												{pureMember.phone || '無電話'}
											</Typography>
										</Stack>

										{/* 直線分隔 */}
										<Divider orientation='vertical' flexItem sx={{ mx: 1, opacity: 0.25 }} />

										{/* 訂單類型 */}
										{searchType === 'orderMembers' && (
											<Stack spacing={1} sx={{ minWidth: 140 }}>
												<Typography variant='caption' color='text.secondary'>
													訂單類型
												</Typography>
												<Typography variant='body2' color='text.primary'>
													私人預約式????
												</Typography>
											</Stack>
										)}

										{/* 直線分隔 */}
										<Divider orientation='vertical' flexItem sx={{ mx: 1, opacity: 0.25 }} />

										{/* 使用堂數 */}
										{searchType === 'orderMembers' && (
											<Stack spacing={1} sx={{ minWidth: 80 }}>
												<Typography variant='caption' color='text.secondary' sx={{ width: 48 }}>
													使用堂數
												</Typography>
												<Typography variant='body2' color='text.primary'>
													{order?.orderReservations.length}/{order?.planNumber}
												</Typography>
											</Stack>
										)}
									</Paper>
								</ListItemButton>
							</ListItem>
						);
					})}
				</>
			)}

			{/* 無結果提示 */}
			{!loading && searchValue && searchResults.length === 0 && (
				<Box py={2}>
					<Typography variant='body2' color='text.secondary' textAlign='center'>
						沒有找到符合的會員
					</Typography>
				</Box>
			)}
		</Stack>
	);
};

export default AddMemberModal;
