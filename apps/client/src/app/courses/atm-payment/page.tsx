'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Clock, Copy, Info } from 'lucide-react';

import Button from '@/components/Project/Shared/Common/Button';

interface AtmPaymentData {
	orderId: string;
	orderNo: string;
	balanceAmt: number;
	totalAmt: number;
}

const AtmPaymentContent = () => {
	const router = useRouter();
	const [paymentData, setPaymentData] = useState<AtmPaymentData | null>(null);
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// 從 localStorage 讀取 ATM 支付資料
		const atmData = localStorage.getItem('atmPaymentData');

		if (atmData) {
			try {
				const parsedData: AtmPaymentData = JSON.parse(atmData);
				setPaymentData(parsedData);
			} catch (error) {
				console.error('Error parsing ATM payment data:', error);
				// 如果資料無效，跳轉回課程列表
				router.push('/courses');
			}
		} else {
			// 如果沒有資料，跳轉回課程列表
			router.push('/courses');
		}

		setIsLoading(false);
	}, [router]);

	const handleCopyAccount = () => {
		navigator.clipboard.writeText('77777-25115541-7');
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (isLoading) {
		return (
			<div className='max-w-[380px] mx-auto pt-[48px] max-xs:pt-0'>
				<div className='max-xs:px-5 w-full flex-col items-center justify-center'>
					<div className='flex items-center justify-center mb-4'>
						<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-zinc-900'></div>
					</div>
					<h1 className='text-xl text-center text-zinc-600'>載入中...</h1>
				</div>
			</div>
		);
	}

	if (!paymentData) {
		return null;
	}

	return (
		<div className='max-w-[380px] mx-auto pt-[48px] max-xs:pt-0 pb-10'>
			<div className='max-xs:px-5 w-full'>
				{/* Header with Clock Icon */}
				<div className='flex items-center justify-center text-[#4A90E2] mb-4'>
					<Clock size={64} strokeWidth={1.5} />
				</div>

				{/* Title */}
				<h1 className='text-3xl mb-4 text-center font-medium text-zinc-800'>請完成付款</h1>

				{/* Instructions */}
				<div className='text-center text-zinc-600 mb-8'>
					<div className='text-sm leading-6'>
						<p>請在<span className='font-bold text-zinc-800'>2天內</span>匯款至下方帳戶，逾期帳號將失效，需重新取得。</p>
						<p>轉帳完成後請等待15分鐘，系統將自動更新訂單狀態。</p>
					</div>
				</div>

				{/* Payment Info Card */}
				<div className='border border-zinc-300 rounded-xl p-6 mb-8'>
					{/* Balance Amount with Info Icon */}
					<div className='mb-6'>
						<div className='flex items-center gap-2 mb-2'>
							<span className='text-zinc-600 text-sm'>應繳尾款</span>
							<Info size={16} className='text-zinc-400' />
						</div>
						<div className='flex items-baseline justify-between'>
							<span className='text-4xl font-bold text-zinc-800'>
								{paymentData.balanceAmt.toLocaleString()}
								<span className='text-2xl ml-1'>元</span>
							</span>
							<span className='text-zinc-500 text-sm'>
								總金額 {paymentData.totalAmt.toLocaleString()}元
							</span>
						</div>
					</div>

					{/* Divider */}
					<div className='border-t border-zinc-200 mb-6'></div>

					{/* Bank Information */}
					<div className='mb-4'>
						<div className='text-base font-medium text-zinc-800 mb-2'>
							台中銀行 (053)
						</div>
						<div className='flex items-center justify-between bg-zinc-50 p-4 rounded-lg'>
							<span className='text-2xl font-mono font-semibold text-zinc-800 tracking-wide'>
								77777-25115541-7
							</span>
							<button
								onClick={handleCopyAccount}
								className='ml-3 p-2 hover:bg-zinc-200 rounded-md transition-colors'
								aria-label='複製帳號'
							>
								{copied ? (
									<Check size={20} className='text-green-600' />
								) : (
									<Copy size={20} className='text-zinc-600' />
								)}
							</button>
						</div>
					</div>

					{/* Account Details */}
					<div className='space-y-3 bg-zinc-50 p-4 rounded-lg'>
						<div className='flex items-start'>
							<span className='text-zinc-500 text-sm w-16 flex-shrink-0'>戶名</span>
							<span className='text-zinc-800 text-sm font-medium'>CitySki城市滑雪學校-台中分校</span>
						</div>
						<div className='flex items-start'>
							<span className='text-zinc-500 text-sm w-16 flex-shrink-0'>分行</span>
							<span className='text-zinc-800 text-sm font-medium'>台中銀行西屯分行</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex gap-2'>
					<Button
						variant='secondary'
						onClick={() => router.push('/')}
						className='flex-1'
						aria-label='回到首頁'
					>
						回到首頁
					</Button>
					<button
						className='flex-1 overflow-hidden gap-2.5 px-6 py-5 text-base font-bold text-white rounded-lg bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] transition-all duration-300 hover:opacity-90 hover:shadow-lg'
						onClick={() => paymentData.orderId && router.push(`/order/${paymentData.orderId}`)}
						aria-label='檢視我的訂單'
					>
						檢視我的訂單
					</button>
				</div>

				{/* Footer Note */}
				<div className='text-center text-zinc-500 text-sm mt-6'>
					您也可以在「我的訂單」內查看轉帳資訊
				</div>
			</div>
		</div>
	);
};

const AtmPaymentPage = () => {
	return (
		<Suspense
			fallback={
				<div className='max-w-[380px] mx-auto pt-[48px] max-xs:pt-0'>
					<div className='max-xs:px-5 w-full flex-col items-center justify-center'>
						<div className='flex items-center justify-center mb-4'>
							<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-zinc-900'></div>
						</div>
						<h1 className='text-xl text-center text-zinc-600'>載入中...</h1>
					</div>
				</div>
			}
		>
			<AtmPaymentContent />
		</Suspense>
	);
};

export default AtmPaymentPage;
