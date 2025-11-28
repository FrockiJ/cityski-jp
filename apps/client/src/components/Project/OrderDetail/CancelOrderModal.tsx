'use client';

import { useState } from 'react';

interface CancelOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => Promise<void>;
}

const CancelOrderModal = ({ isOpen, onClose, onConfirm }: CancelOrderModalProps) => {
	const [reason, setReason] = useState('');
	const [showError, setShowError] = useState(false);

	const handleConfirm = async () => {
		if (!reason.trim()) {
			setShowError(true);
			return;
		}
		await onConfirm(reason);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='w-[400px] bg-white rounded-[20px] shadow-[0px_10px_26px_0px_rgba(0,0,0,0.13)] flex flex-col items-center overflow-hidden'>
				<div className='self-stretch h-16 relative bg-white flex items-center justify-between px-8'>
					<div className="text-zinc-800 text-xl font-medium font-['Noto_Sans_TC'] leading-7">
						申請取消訂單
					</div>
					<button
						onClick={() => {
							onClose();
							setReason('');
							setShowError(false);
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
				<div className='self-stretch px-8 pt-4 pb-8 flex flex-col justify-start items-center gap-4'>
					<div className="text-zinc-800 text-base font-normal font-['Noto_Sans_TC'] leading-6">
						若取消課程，將依據退款政策扣除部分費用後退款給您。確定要取消訂單嗎？
					</div>
					<div className='w-full'>
						<input
							type='text'
							placeholder='輸入取消原因'
							value={reason}
							onChange={(e) => {
								setReason(e.target.value);
								if (e.target.value.trim()) {
									setShowError(false);
								}
							}}
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-zinc-800 font-normal font-['Noto_Sans_TC'] ${
								showError
									? 'border-red-500 focus:ring-red-500'
									: 'border-gray-300 focus:ring-blue-500'
							}`}
						/>
						<div className='h-6'>
							{showError && (
								<div className="text-red-500 text-sm font-normal font-['Noto_Sans_TC'] mt-2">
									必填欄位
								</div>
							)}
						</div>
					</div>
				</div>
				<div className='self-stretch px-8 py-5 bg-white border-t border-zinc-300 inline-flex justify-end items-center gap-3'>
					<button
						onClick={() => {
							onClose();
							setReason('');
							setShowError(false);
						}}
						className="px-6 py-2.5 bg-white rounded-lg border border-zinc-800 text-zinc-800 text-sm font-normal font-['Noto_Sans_TC'] leading-6 hover:bg-gray-50 transition-colors cursor-pointer"
					>
						不，保留預約
					</button>
					<button
						onClick={handleConfirm}
						className="px-6 py-2.5 bg-red-600 rounded-lg text-white text-sm font-medium font-['Noto_Sans_TC'] leading-6 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
					>
						申請取消訂單
					</button>
				</div>
			</div>
		</div>
	);
};

export default CancelOrderModal;
