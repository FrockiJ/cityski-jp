export default function LineSection() {
	return (
		<section className='mt-12'>
			<div className='xs:container'>
				<div className='flex flex-col xs:flex-row'>
					<div className='p-5 bg-[#161616] xs:bg-inherit	xs:p-0'>
						<div className="bg-[url('/image/contact-us/bg-line-mobile.svg')] xs:bg-[url('/image/contact-us/bg-line-desktop.svg')] flex flex-col py-[38px] px-[25px] bg-no-repeat	bg-cover xs:py-[70px] xs:px-16 xs:gap-0.5">
							<div className='flex gap-1 items-center justify-center	xs:justify-start'>
								<div className='text-lg font-medium leading-6	'>加入CitySki</div>
								<img src='/image/contact-us/line-mobile.svg' alt='line'></img>
								<div className='text-lg font-medium leading-6	'>官方帳號</div>
							</div>
							<div className='text-[26px] font-medium leading-10 tracking-[-.52px]	text-center xs:text-left	xs:text-2xl	xs:leading-10	'>專屬客服為您解決大小事</div>
							<div className='text-[14px] font-normal leading-6 text-[#2B2B2B] opacity-80	text-center	xs:text-left	xs:mt-4'>
								快速解決問題，享受貼心服務，就從加入我們的LINE官方帳號開始
							</div>
							<button className='flex gap-2 justify-center mt-8 bg-[#1AC460] rounded-lg py-3 px-6 xs:hidden'>
								<img src='/image/contact-us/Line_White.svg' alt='line'></img>
								<div className='text-lg font-bold leading-6	text-white	'>cityski 客服中心</div>
							</button>
							<div className="hidden xs:flex mt-12  gap-4 items-center">
								<img src='/image/contact-us/QRCode.png' alt='qrcode'></img>
								<div className="max-w-[122px] text-[13px] text-[#2B2B2B] opacity-60	">掃描左側 QR Code，即可加入LINE好友</div>
							</div>
						</div>
					</div>
					<img src='/image/contact-us/bg-mobile.svg' alt='place' className="xs:hidden"></img>
					<img src='/image/contact-us/bg-desktop.svg' alt='place' className="hidden xs:block"></img>
				</div>
			</div>
		</section>
	);
}
