'use client';

import React, { useState } from 'react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';

import FAQItem from './FaqItem';

const poppins = Poppins({
	weight: ['400'],
	subsets: ['latin'],
});

const faqItems = [
	{
		question: '什麼是滑雪冬令營？',
		answer:
			'藉由CitySki引進的訓練模擬機台，讓學員在台灣先學會滑雪技巧，再讓教練們帶至雪場進行移地教學，幫助學員銜接適應，隨時指導學員在滑雪學校所學動作，讓學員輕輕鬆鬆享受滑雪樂趣！',
		defaultExpanded: true,
	},
	{
		question: '機票可以請你們代訂嗎?',
		answer: 'test1',
	},
	{
		question: '雪具自備可以扣費用嗎？',
		answer: 'test2',
	},
	{
		question: '沒有使用到的配備與服務可以退費嗎？雪具自備可以扣費用嗎？',
		answer: 'test3',
	},
	{
		question: '可以不滑雪，只陪同家人朋友一起去嗎？',
		answer: 'test4',
	},
	{
		question: '可以第一天滑Ski，第二天滑SB嗎?',
		answer: 'test5',
	},
	{
		question: '請問雪票有含夜滑嗎？',
		answer: 'test6',
	},
	{
		question: '下機後要坐多久的車到雪場？',
		answer: 'test7',
	},
	{
		question: '單人也可以報名嗎？需要加費用嗎？',
		answer: 'test8',
	},
	{
		question: '住宿為幾人房一間？有家庭房嗎？',
		answer: 'test9',
	},
	{
		question: '最少幾人成團呢？',
		answer: 'test10',
	},
	{
		question: '學員一定要在滑雪學校上完課，才可以報名嗎？',
		answer: 'test11',
	},
	{
		question: '沒有滑雪經驗，可以報名嗎?',
		answer: 'test12',
	},
	{
		question: '付訂金之後，後續因故無法參加行程，是否可以退費？',
		answer: 'test13',
	},
	{
		question: '結束行程，我可以留在日本嗎?',
		answer: 'test14',
	},
];

export const FaqSection = () => {
	const [openIndex, setOpenIndex] = useState(0);

	return (
		<div>
			<div className={`mt-[140px] text-center text-[#B38607] text-xl ${poppins.className} max-xs:mt-[100px]`}>FAQ</div>
			<div className='mt-5 flex justify-center items-center relative'>
				<Image src='/image/overseas/faq-title.svg' alt='faq title' width='192' height='35' aria-hidden='true' />
				<Image
					src='/image/overseas/styled-divider.svg'
					alt='styled divider'
					width='1200'
					height='60'
					aria-hidden='true'
					className='absolute top-6 max-xs:hidden'
				/>
				<Image
					src='/image/overseas/styled-divider-mobile.svg'
					alt='styled divider mobile'
					width='480'
					height='60'
					aria-hidden='true'
					className='absolute top-10 hidden max-xs:block'
				/>
			</div>
			<section
				aria-labelledby='faq-heading'
				className='mt-20 flex flex-col gap-2 p-4 mx-auto my-0 max-w-screen-sm max-xs:p-3'
			>
				<h2 id='faq-heading' className='sr-only'>
					Frequently Asked Questions
				</h2>
				{faqItems.map((item, index) => (
					<FAQItem
						key={index}
						question={item.question}
						answer={item.answer}
						defaultExpanded={index === openIndex}
						onToggle={() => setOpenIndex(index === openIndex ? -1 : index)}
					/>
				))}
			</section>
		</div>
	);
};
