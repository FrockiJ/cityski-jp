'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function BranchSection() {
	const [isOpenWalk, setIsOpenWalk] = useState(false);
	const [isOpenParking, setIsOpenParking] = useState(false);
	const [videoUrl, setVideoUrl] = useState(null);
	const [walkUrl, setWalkUrl] = useState(null);

	const branches = [
		{
			name: '台中店',
			address: '台中市西屯區四川路87號B1-38 (115) ',
			google_map_url:
				'https://www.google.com/maps/place/City+Ski+%E5%9F%8E%E5%B8%82%E6%BB%91%E9%9B%AA%E5%AD%B8%E6%A0%A1/@24.1612269,120.652367,17z/data=!4m6!3m5!1s0x34693d1b80ddbc4b:0x9b39b7fa0387bc6a!8m2!3d24.1612269!4d120.6549419!16s%2Fg%2F11t7bvlnlz?authuser=0&entry=ttu&g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%3D%3D',
			business_time: [
				{ week: '週一至五', time: '12:00 PM - 9:00 PM' },
				{ week: '週六日', time: '10:00 AM - 9:00 PM' },
			],
			tel: '(04)2312-1516',
			mail: 'cityski.tc@gmail.com',
			parking: [
				'如欲停B2臨停停車場，請跟車道警衛說要找「商辦115」即可下去停車。',
				'下去停車場之後請按指示牌前往「收費臨停」區域。',
				'上來B1的電梯在靠近車道出口的位置。',
				'電梯請按右手邊(無障礙) 的樓層按鈕。',
			],
			walking_url: '/image/contact-us/walk.png',
			parking_url: '/image/contact-us/file_example_MP4_1920_18MG.mp4',
		},
		{
			name: '新竹店',
			address: '台中市西屯區四川路87號B1-38 (115) ',
			google_map_url:
				'https://www.google.com/maps/place/City+Ski+%E5%9F%8E%E5%B8%82%E6%BB%91%E9%9B%AA%E5%AD%B8%E6%A0%A1/@24.1612269,120.652367,17z/data=!4m6!3m5!1s0x34693d1b80ddbc4b:0x9b39b7fa0387bc6a!8m2!3d24.1612269!4d120.6549419!16s%2Fg%2F11t7bvlnlz?authuser=0&entry=ttu&g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%3D%3D',
			business_time: [
				{ week: '週一至五', time: '12:00 PM - 9:00 PM' },
				{ week: '週六日', time: '10:00 AM - 9:00 PM' },
			],
			tel: '(04)2312-1516',
			mail: 'cityski.tc@gmail.com',
			parking: [
				'如欲停B2臨停停車場，請跟車道警衛說要找「商辦115」即可下去停車。',
				'下去停車場之後請按指示牌前往「收費臨停」區域。',
				'上來B1的電梯在靠近車道出口的位置。',
				'電梯請按右手邊(無障礙) 的樓層按鈕。',
			],
			walking_url: '/image/contact-us/walk.png',
			parking_url: '/image/contact-us/file_example_MP4_1920_18MG.mp4',
		},
	];

	const handleOpenWalkModal = (url: string) => {
		setWalkUrl(url);
		setIsOpenWalk(true);
	};

	const handleOpenParkingModal = (url: string) => {
		setVideoUrl(url);
		setIsOpenParking(true);
	};

	return (
		<section className='container'>
			<div className='flex flex-col'>
				<div className='mt-10 text-2xl	font-medium	leading-8	mb-6 xs:text-[32px] xs:mt-[100px] xs:mb-8'>分店資訊</div>
				{branches.map((branch, index) => {
					return (
						<div
							key={index}
							className='flex flex-col py-10 border-t-[1px] border-[#D7D7D7] gap-4 xs:flex-row xs:gap-20'
						>
							<div className='text-xl	font-medium	xs:text-[26px]'>{branch.name}</div>
							<div className='flex-1'>
								{/* 基本資料 */}
								<div className='grid grid-cols-1 border-[#D7D7D7] border-[1px] rounded-[10px] gap-4 mb-4 xs:grid-cols-3'>
									{/* 地址 */}
									<div className='flex flex-col px-5 pt-5 pb-6 border-[#D7D7D7] border-b-[1px] xs:border-r-[1px]'>
										<div className='flex flex-col'>
											<div className='text-[#818181] font-medium mb-3'>地址</div>
											<div className='font-medium mb-1'>{branch.address}</div>
											<a href={branch.google_map_url} className='flex gap-0.5	' target='_blank'>
												<div className='text-sm	font-medium text-[#0F72ED]'>查看Google地圖</div>
												<img src='/image/contact-us/Arrow right.svg' alt='arrow'></img>
											</a>
										</div>
									</div>
									{/* 營業時間 */}
									<div className='flex flex-col px-5 pt-5 pb-6 border-[#D7D7D7] border-b-[1px] xs:border-r-[1px]'>
										<div className='flex flex-col'>
											<div className='text-[#818181] font-medium mb-3'>營業時間</div>
											{branch.business_time.map((time, index) => {
												return (
													<div key={index} className='flex gap-2'>
														<div className='font-medium mb-1 w-1/4'>{time.week}</div>
														<div className='font-medium mb-1 w-3/4	'>{time.time}</div>
													</div>
												);
											})}
										</div>
									</div>
									{/* 聯絡資訊 */}
									<div className='flex flex-col px-5 pt-5 pb-6 '>
										<div className='flex flex-col'>
											<div className='text-[#818181] font-medium mb-3'>聯絡資訊</div>
											<div className='flex gap-2'>
												<img src='/image/contact-us/phone.svg' alt='phone'></img>
												<div className='font-medium mb-1'>{branch.tel}</div>
											</div>
											<div className='flex gap-2'>
												<img src='/image/contact-us/mail.svg' alt='mail'></img>
												<a href={`mailto:${branch.mail}`} className='font-medium mb-1 underline'>
													{branch.mail}
												</a>
											</div>
										</div>
									</div>
								</div>
								{/* 停車資訊 */}
								<div className='flex flex-col border-[#D7D7D7] border-[1px] rounded-[10px] p-5'>
									<div className='text-lg	font-medium	mb-4'>停車資訊</div>
									<ol className='list-decimal pl-4 text-[#818181] text-sm leading-6	'>
										{branch.parking.map((pa, index) => {
											return <li key={index}>{pa}</li>;
										})}
									</ol>
									<div className='grid grid-cols-1 gap-4 mt-9 xs:grid-cols-2'>
										<div className='pl-4 pr-6 py-6 flex gap-4 border-[#D7D7D7] border-[1px] rounded-[10px]'>
											<img src='/image/contact-us/Walk.svg' alt='walking'></img>
											<div className='flex flex-col gap-2'>
												<div className='font-bold text-sm'>步行前往教室說明圖</div>
												<div
													className='flex gap-0.5	cursor-pointer'
													onClick={() => handleOpenWalkModal(branch.walking_url)}
												>
													<div className='text-sm text-[#0F72ED]'>查看更多</div>
													<img src='/image/contact-us/Arrow right.svg' alt='arrow'></img>
												</div>
											</div>
										</div>
										<div className='pl-4 pr-6 py-6 flex gap-4 border-[#D7D7D7] border-[1px] rounded-[10px]'>
											<img src='/image/contact-us/Parking.svg' alt='parking'></img>
											<div className='flex flex-col gap-2'>
												<div className='font-bold text-sm'>從停車場前往教室說明影片</div>
												<div
													className='flex gap-0.5	cursor-pointer'
													onClick={() => handleOpenParkingModal(branch.parking_url)}
												>
													<div className='text-sm text-[#0F72ED]'>查看更多</div>
													<img src='/image/contact-us/Arrow right.svg' alt='arrow'></img>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<Dialog open={isOpenWalk} onOpenChange={setIsOpenWalk}>
				<DialogContent hideIcon className='h-full flex flex-col bg-black	xs:h-auto xs:bg-white xs:min-w-[800px]'>
					<X className='h-4 w-4 self-end xs:hidden' color='white' onClick={() => setIsOpenWalk(false)} />
					<div className='flex justify-between	'>
						<div className='text-xl	font-medium	'>步行前往教室說明圖</div>
						<X className='h-4 w-4' onClick={() => setIsOpenWalk(false)} />
					</div>
					<div className='flex flex-col h-full justify-center '>
						<img src={walkUrl} alt='walk' />
					</div>
				</DialogContent>
			</Dialog>
			<Dialog open={isOpenParking} onOpenChange={setIsOpenParking}>
				<DialogContent hideIcon className='h-full flex flex-col bg-black	xs:h-auto xs:bg-white xs:min-w-[800px]'>
					<X className='h-4 w-4 self-end xs:hidden' color='white' onClick={() => setIsOpenParking(false)} />
					<div className='flex justify-between	'>
						<div className='text-xl	font-medium	'>從停車場前往教室說明影片</div>
						<X className='h-4 w-4' onClick={() => setIsOpenParking(false)} />
					</div>
					<div className='flex flex-col h-full justify-center'>
						<video preload='auto' muted controls playsInline className='h-full w-full object-cover'>
							<source src={videoUrl} type='video/mp4' />
							您的瀏覽器不支援影片播放。
						</video>
					</div>
				</DialogContent>
			</Dialog>
		</section>
	);
}
