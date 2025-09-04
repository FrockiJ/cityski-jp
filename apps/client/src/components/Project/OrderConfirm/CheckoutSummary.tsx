import React from 'react';
import { useSelector } from 'react-redux';
import { CoursePlanResponseDTO } from '@repo/shared';

import { selectDiscount } from '@/state/slices/infoSlice';

interface CheckoutSummaryProps {
	isMobile?: boolean;
	participants: {
		adult: number;
		minor: number;
	};
	plan: CoursePlanResponseDTO;
}

function CheckoutSummary({ isMobile = false, participants, plan }: CheckoutSummaryProps) {
	const discount = useSelector(selectDiscount);
	const totalPrice =
		plan?.price * (plan?.number || 1) * participants?.adult + plan?.price * (plan?.number || 1) * participants?.minor;

	const calculateDiscountAmount = () => {
		if (!discount) return 0;
		if (discount.type === 'A') {
			return Math.round(discount.discount);
		} else if (discount.type === 'P') {
			// For percentage discount, discount.discount represents the percentage (e.g., 9 means 9折, 8.5 means 8.5折)
			return Math.round(totalPrice * (1 - discount.discount / 10));
		}
		return 0;
	};

	const discountAmount = calculateDiscountAmount();
	const finalPrice = totalPrice - discountAmount;

	const formatNumber = (num: number) => {
		return Math.round(num)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	const getDiscountDisplay = () => {
		if (!discount) return '';
		return `-${formatNumber(discountAmount)}`;
	};

	const getDiscountTitle = () => {
		if (!discount) return '';
		if (discount.type === 'A') {
			return `優惠折扣`;
		} else if (discount.type === 'P') {
			// Format the discount value to show decimal if needed (e.g., 8.5折)
			const discountValue = discount.discount % 1 === 0 ? discount.discount : discount.discount.toFixed(1);
			return `優惠折扣 (${discountValue}折)`;
		}
		return '';
	};

	return (
		<aside
			className={`${isMobile ? 'flex' : 'hidden xs:flex'} w-full flex-col ${isMobile ? 'px-0 pb-8 border-b border-solid border-[#d7d7d7]' : 'p-7'} bg-white ${!isMobile && 'rounded-2xl border border-solid shadow-lg border-[#d7d7d7]'} ${isMobile ? 'max-w-full' : 'max-w-[360px]'}`}
		>
			<h2 className='text-2xl font-medium tracking-tight leading-loose text-justify'>價格詳情</h2>
			<div className='mt-6 w-full'>
				<div className='w-full'>
					{/* Show adult entries first */}
					{participants?.adult > 0 &&
						Array.from({ length: participants.adult }).map((_, index) => (
							<PriceItem
								key={`adult-${index}`}
								title={`${plan?.type === 1 ? '單堂體驗課' : plan?.name + plan?.number + '堂'} (成人)`}
								price={formatNumber(plan?.price * (plan?.number || 1))}
							/>
						))}
					{/* Show minor entries next */}
					{participants?.minor > 0 &&
						Array.from({ length: participants.minor }).map((_, index) => (
							<PriceItem
								key={`minor-${index}`}
								title={`${plan?.type === 1 ? '單堂體驗課' : plan?.name + plan?.number + '堂'} (青少年/兒童)`}
								price={formatNumber(plan?.price * (plan?.number || 1))}
							/>
						))}
					{/* Show discount if exists */}
					{discount && <PriceItem title={getDiscountTitle()} price={getDiscountDisplay()} isDiscount={true} />}
				</div>
				<div className='flex gap-2 justify-between items-center pt-4 mt-5 w-full whitespace-nowrap border-t border-solid border-t-[color:var(--neutral-3,#EDEDED)] min-h-11'>
					<div className='self-stretch my-auto text-base font-medium'>總計</div>
					<div className='flex gap-0.5 items-center self-stretch my-auto'>
						<div className='self-stretch my-auto text-2xl font-semibold tracking-tighter leading-none'>
							{formatNumber(finalPrice)}
						</div>
						<div className='self-stretch my-auto text-base font-medium'>元</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

function PriceItem({ title, price, isDiscount = false }: { title: string; price: string; isDiscount?: boolean }) {
	return (
		<div className='flex gap-10 justify-between items-end mt-2 first:mt-0 w-full'>
			<div className='text-base'>{title}</div>
			<div className='flex gap-0.5 items-center whitespace-nowrap'>
				<div
					className={`self-stretch my-auto text-base font-medium tracking-tight ${isDiscount ? 'text-[#1AC460]' : ''}`}
				>
					{price}
				</div>
				<div className='self-stretch my-auto text-sm leading-6'>元</div>
			</div>
		</div>
	);
}

export default CheckoutSummary;
