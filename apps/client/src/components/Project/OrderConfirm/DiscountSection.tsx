import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseWrapper } from '@repo/shared';
import { Check } from 'lucide-react';

import axios from '@/lib/api';
import { selectUserInfo } from '@/state/slices/authSlice';
import { Department, Discount, selectDiscount, setDiscount } from '@/state/slices/infoSlice';

interface DiscountResponse extends Discount {}

function DiscountSection({ department }: { department: Department }) {
	const userInfo = useSelector(selectUserInfo);
	const discount = useSelector(selectDiscount);
	const dispatch = useDispatch();
	const [discountCode, setDiscountCode] = useState('');
	const [isApplied, setIsApplied] = useState(false);
	const [errorStatus, setErrorStatus] = useState<number | null>(null);
	// console.log('userInfo', userInfo);
	// console.log('department', department);

	const handleApplyDiscount = async () => {
		if (!department?.id) return;
		console.log('department', department);
		try {
			const response = await axios.get<ResponseWrapper<DiscountResponse>>(
				`/api/discounts/client?departmentId=${department.id}&code=${discountCode}`,
			);
			// console.log('response', response);
			if (response.status === 200 && response.data?.result) {
				console.log('response.data.result', response.data.result);
				// status 0: 停用  1: 啟用 9: 已過期
				if (response.data.result.status === 1) {
					setIsApplied(true);
					setErrorStatus(null);
					dispatch(setDiscount(response.data.result));
				} else {
					setIsApplied(false);
					setErrorStatus(response.data.result.status);
					dispatch(setDiscount(null));
				}
			}
		} catch (error: any) {
			if (error.response?.status === 400) {
				setIsApplied(false);
				setErrorStatus(0);
				dispatch(setDiscount(null));
			}
		}
	};

	const getErrorMessage = () => {
		if (errorStatus === 9) return '優惠碼已過期';
		return '請輸入有效的優惠碼';
	};

	const handleClearDiscount = () => {
		setDiscountCode('');
		setErrorStatus(null);
		setIsApplied(false);
		dispatch(setDiscount(null));
	};

	return (
		<section className='pb-12 mt-9 w-full whitespace-nowrap border-b border-solid border-b-[color:var(--neutral-5,#D7D7D7)] max-xs:max-w-full'>
			<h2 className='text-2xl font-medium tracking-tight leading-loose text-justify text-zinc-800 max-xs:max-w-full'>
				優惠折扣
			</h2>
			<div className='flex relative flex-col mt-5 max-w-full min-h-14 w-[335px] max-xs:w-full'>
				<div className='overflow-hidden z-0 w-full text-base rounded-lg max-w-[335px] max-xs:max-w-full text-zinc-500'>
					<div className='relative'>
						<input
							type='text'
							placeholder='優惠碼'
							className={`flex-1 shrink gap-4 self-stretch p-4 w-full bg-white rounded-lg border border-solid basis-0 ${
								errorStatus !== null
									? 'border-red-500'
									: isApplied
										? 'border-[#1AC460]'
										: 'border-[color:var(--neutral-5,#D7D7D7)]'
							}`}
							aria-label='輸入優惠碼'
							value={discountCode}
							onChange={(e) => {
								setDiscountCode(e.target.value);
								setErrorStatus(null);
								setIsApplied(false);
							}}
						/>
						<button
							className={`overflow-hidden absolute right-2 top-2/4 z-0 gap-2.5 self-start px-5 py-2 text-sm leading-6 text-center -translate-y-2/4 translate-x-[0%] transition-all duration-300 ${
								isApplied || errorStatus !== null
									? 'text-[#0F72ED] bg-transparent'
									: 'bg-white rounded-lg border border-solid border-[color:var(--neutral-80,#2B2B2B)] text-zinc-800 hover:bg-zinc-100 hover:border-black hover:shadow-md'
							}`}
							aria-label={isApplied || errorStatus !== null ? '清除優惠碼' : '使用優惠碼'}
							onClick={() => {
								if (isApplied || errorStatus !== null) {
									handleClearDiscount();
								} else {
									handleApplyDiscount();
								}
							}}
						>
							{isApplied || errorStatus !== null ? '清除' : '使用'}
						</button>
					</div>
					{errorStatus !== null && <p className='mt-1 text-sm text-red-500'>{getErrorMessage()}</p>}
					{isApplied && (
						<div className='mt-1 flex items-center gap-1 text-sm text-[#1AC460]'>
							<Check size={16} />
							<span>已套用優惠碼</span>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default DiscountSection;
