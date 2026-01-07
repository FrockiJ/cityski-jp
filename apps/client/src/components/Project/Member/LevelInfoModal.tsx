'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface LevelInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	snowboardLevel: number;
	skiLevel: number;
}

const LevelInfoModal = ({ isOpen, onClose, snowboardLevel, skiLevel }: LevelInfoModalProps) => {
	const [activeTab, setActiveTab] = useState<'snowboard' | 'ski'>('snowboard');

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent hideIcon className='p-0 w-full max-w-full h-full bg-black border-0 overflow-hidden'>
				<DialogTitle className='h-[52px] relative flex items-center'>
					<span className='absolute left-4 top-4 text-white text-[18px] font-medium'>等級說明</span>
					<button
						onClick={onClose}
						className='absolute right-4 top-4 text-white hover:opacity-70'
						style={{ border: 'none', outline: 'none' }}
					>
						<X size={24} />
					</button>
				</DialogTitle>
				<div className='h-[calc(100vh-52px)] overflow-y-auto flex items-center justify-center pb-8'>
					{/* 電腦版 - 並排顯示 */}
					<div className='hidden sm:flex flex-row items-start gap-8'>
						<div className='flex flex-col items-center gap-4'>
							<img
								src={`/image/membership/level/snow_board/SB_Level_${snowboardLevel}.jpg`}
								alt={`單板 LV.${snowboardLevel}`}
								className='max-w-[45vw] max-h-[70vh] object-contain rounded-[16px]'
							/>
							<div className='flex h-[36px] px-4 py-[6px] justify-center items-center gap-2 bg-[#2B2B2B] rounded-[99px]'>
								<span className='text-white text-sm font-medium'>單板</span>
								<span className='flex w-[36px] px-1 justify-center items-center rounded-[4px] border-[1.5px] border-[#FE7B5D] text-white text-xs font-medium'>
									LV.{snowboardLevel}
								</span>
							</div>
						</div>
						<div className='flex flex-col items-center gap-4'>
							<img
								src={`/image/membership/level/ski/SKI_Level_${skiLevel}.jpg`}
								alt={`雙板 LV.${skiLevel}`}
								className='max-w-[45vw] max-h-[70vh] object-contain rounded-[16px]'
							/>
							<div className='flex h-[36px] px-4 py-[6px] justify-center items-center gap-2 bg-[#2B2B2B] rounded-[99px]'>
								<span className='text-white text-sm font-medium'>雙板</span>
								<span className='flex w-[36px] px-1 justify-center items-center rounded-[4px] border-[1.5px] border-[#FE7B5D] text-white text-xs font-medium'>
									LV.{skiLevel}
								</span>
							</div>
						</div>
					</div>

					{/* 手機版 - 切換顯示 */}
					<div className='flex sm:hidden flex-col items-center gap-4'>
						{/* 切換按鈕 */}
						<div className='flex flex-row rounded-[99px] p-1 border border-[#6A6A6A]'>
							<button
								onClick={() => setActiveTab('snowboard')}
								className={`flex h-[36px] px-4 py-[6px] justify-center items-center gap-2 rounded-[99px] ${
									activeTab === 'snowboard' ? 'bg-white' : 'bg-transparent'
								}`}
							>
								<span className={`text-sm font-medium ${activeTab === 'snowboard' ? 'text-black' : 'text-white'}`}>單板</span>
								<span className={`flex w-[36px] px-1 justify-center items-center rounded-[4px] border-[1.5px] text-xs font-medium ${activeTab === 'snowboard' ? 'text-black border-black' : 'text-white border-[#FE7B5D]'}`}>
									LV.{snowboardLevel}
								</span>
							</button>
							<button
								onClick={() => setActiveTab('ski')}
								className={`flex h-[36px] px-4 py-[6px] justify-center items-center gap-2 rounded-[99px] ${
									activeTab === 'ski' ? 'bg-white' : 'bg-transparent'
								}`}
							>
								<span className={`text-sm font-medium ${activeTab === 'ski' ? 'text-black' : 'text-white'}`}>雙板</span>
								<span className={`flex w-[36px] px-1 justify-center items-center rounded-[4px] border-[1.5px] text-xs font-medium ${activeTab === 'ski' ? 'text-black border-black' : 'text-white border-[#FE7B5D]'}`}>
									LV.{skiLevel}
								</span>
							</button>
						</div>

						{/* 圖片 */}
						{activeTab === 'snowboard' ? (
							<img
								src={`/image/membership/level/snow_board/SB_Level_${snowboardLevel}.jpg`}
								alt={`單板 LV.${snowboardLevel}`}
								className='max-w-[90vw] max-h-[60vh] object-contain rounded-[16px]'
							/>
						) : (
							<img
								src={`/image/membership/level/ski/SKI_Level_${skiLevel}.jpg`}
								alt={`雙板 LV.${skiLevel}`}
								className='max-w-[90vw] max-h-[60vh] object-contain rounded-[16px]'
							/>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LevelInfoModal;
