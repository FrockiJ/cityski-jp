import React from 'react';

function PaymentSection() {
	return (
		<section className='pb-12 mt-9 w-full text-justify border-b border-solid border-b-[color:var(--neutral-5,#D7D7D7)] text-zinc-800 max-xs:max-w-full'>
			<h2 className='text-2xl font-medium tracking-tight leading-loose max-xs:max-w-full'>付款方式</h2>
			<div className='mt-5 w-full leading-6 max-xs:max-w-full'>
				<h3 className='text-base font-bold'>
					<span
						style={{
							fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
						}}
					>
						ATM
					</span>
					轉帳
				</h3>
				<p className='mt-2 text-sm max-xs:max-w-full'>
					請於
					<span style={{ fontWeight: 700, color: 'rgba(43,43,43,1)' }}>訂購確認後</span>
					<span
						style={{
							fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
							fontWeight: 600,
							color: 'rgba(43,43,43,1)',
						}}
					>
						2
					</span>
					<span style={{ fontWeight: 700, color: 'rgba(43,43,43,1)' }}>天內 (不含下單日) 完成匯款</span>
					，並透過網頁或
					<span
						style={{
							fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
						}}
					>
						LINE
					</span>
					官方帳號回覆您的轉帳帳號後
					<span
						style={{
							fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
						}}
					>
						5
					</span>
					碼給
					<span
						style={{
							fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
						}}
					>
						CitySki
					</span>
					，以進行後續預約課程流程。若未在期限內付款，系統將會自動釋出名額。
				</p>
			</div>
		</section>
	);
}

export default PaymentSection;
