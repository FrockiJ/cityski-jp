'use client';

import React, { useEffect, useState } from 'react';
import { GetHomeAdBannerResponseDTO, getS3MediaUrl, ResponseWrapper } from '@repo/shared';
import axios from 'axios';
import Image from 'next/image';

import { FadeIn } from '@/components/Effects/FadeIn';
import VsIcon from '@/components/Icon/VsIcon';
import useSize from '@/hooks/useSize';

import './home.css';

export default function CoachSection() {
	const [adBanner, setAdBanner] = useState<GetHomeAdBannerResponseDTO | null>(null);
	const windowSize = useSize();
	const isDesktop = windowSize?.[0] > 480;

	useEffect(() => {
		const getCoachBannerData = async () => {
			const response = await axios.get<ResponseWrapper<GetHomeAdBannerResponseDTO>>(
				process.env.NEXT_PUBLIC_BACKEND_URL + '/api/home/ad-banner',
			);
			setAdBanner(response.data.result);
		};
		getCoachBannerData();
	}, []);

	return (
		<div className=''>
			<FadeIn className='relative xs:rounded-[24px] overflow-hidden w-[100%] xs:w-[1200px] h-[440px] xs:h-[360px] m-auto mt-[100px] xs:border border-solid border-black border-opacity-5'>
				{adBanner && (
					<Image
						src={isDesktop ? getS3MediaUrl(adBanner.desktopImgSrc) : getS3MediaUrl(adBanner.mobileImgSrc)}
						alt='單板教練培訓課'
						width={1200}
						height={360}
						className='object-cover h-[440px] xs:h-[auto] absolute top-0 left-1/2 transform -translate-x-1/2'
					/>
				)}
				{/* <div className='py-[40px] px-[35px] xs:py-[92px] xs:pl-[140px] relative z-10 text-system-white'>
					<p className='coach-banner-text-sm-shadow'>單板教練培訓課</p>
					<p className='coach-banner-text-lg-shadow text-[20px] xs:text-[27px] font-medium leading-[26px] xs:leading-[35px] mt-[10px]'>
						加入 CASI 認證專業單板教練會員
					</p>
					<p className='coach-banner-text-lg-shadow text-[27px] xs:text-[36px] leading-[35px] xs:leading-[46px] font-medium'>
						你將獲得更多機會與福利
					</p>
					<button
						className='mt-[28px] px-[16px] py-[5px] rounded-[24px] border border-solid border-white bg-system-white text-system-navy text-sm'
						onClick={() => {
							window.open(adBanner.buttonUrl, '_blank');
						}}
					>
						立即報名
					</button>
				</div> */}
			</FadeIn>

			<FadeIn className='custom-background pt-[80px] pb-[100px] xs:pb-[130px] xs:mt-[100px]'>
				<div className=' text-system-navy text-center'>
					<p>SNOWBOARD vs. SKI</p>
					<p className='text-[26px] xs:text-[40px] leading-[58px] font-bold'>單板與雙板，哪個適合我？</p>
				</div>
				<div className='relative z-10 flex justify-center items-center px-[28px] xs:px-0 xs:translate-y-[25px]'>
					<div>
						<Image src='/image/home/ski.webp' alt='單板' width={300} height={230} className='' />
					</div>
					<div className='min-w-[32px] w-[32px] xs:w-[56px] ml-[23px] xs:ml-[104px] mr-[18px] xs:mr-[95px]'>
						<VsIcon />
					</div>
					<div>
						<Image src='/image/home/board.webp' alt='雙板' width={315} height={247} className='' />
					</div>
				</div>
				<div className='flex justify-center px-[28px] gap-[30px] xs:gap-[48px]'>
					<div className='compare-card ski'>
						<p className='text-center text-xl font-bold text-neutral-80'>單板特性</p>
						<p className='mt-[12px] text-left xs:text-center text-neutral-50'>
							兩隻腳固定在同一張板子上，肌力要求高，主要運用到核心和腿力。
							<br />
							初學者摔倒的頻率比雙板高，需要反覆地從雪地上站起。
						</p>
						<hr className='bg-neutral-80 my-[24px]' />
						<p className='text-center text-xl font-bold text-neutral-80'>相似運動</p>
						<p className='mt-[12px] text-left xs:text-center text-neutral-50'>滑板、蛇板、衝浪、滑水</p>
					</div>
					<div className='compare-card board'>
						<p className='text-center text-xl font-bold text-neutral-80'>單板特性</p>
						<p className='h-[144px] xs:h-[96px] mt-[12px] text-left xs:text-center text-neutral-50'>
							兩隻腳固定在不同的板子上，雙腳相較單板較可自由活動，肌力要求低，初學者比較容易上手。
						</p>
						<hr className='bg-neutral-80 my-[24px]' />
						<p className='text-center text-xl font-bold text-neutral-80'>相似運動</p>
						<p className='pt-[12px] text-left xs:text-center text-neutral-50'>直排輪、滑輪、滑冰</p>
					</div>
				</div>
			</FadeIn>
		</div>
	);
}
