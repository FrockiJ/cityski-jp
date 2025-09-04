import React from 'react';

import NoticeItem from './NoticeItem';

const noticeData = [
	{
		icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7e3428d86d2b73a2bbb8e6d8eaa6c743105cb6957caf165094613ad9765b7aa5?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '請提早5分鐘報到',
		description:
			'課程於整點開始上課，請提早 5 分鐘報到並穿著裝備及暖身完畢。如因個人因素遲到而無法跟上課程進度，恕不負責請見諒。',
	},
	{
		icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/a7a92d2d88a85c7ea1797f95ecc7e13269900fd745f1263245c75dba17361f0a?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '依照學員程度教學',
		description:
			'建議同一梯次上課學員的上課程度要相同，如不相同，上課進度將會以最初學者的學員為優先教學。課程可以親子共學，但以小孩進度為主。',
	},
	{
		icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/4f639ec280cf7ba75edf6ca6b75b6f4caaa5a9b8894cb07424ed698c539af44e?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '穿著輕便運動服裝',
		description: '室內為一般冷氣房(約21-24℃)，穿著輕便運動服裝即可，請勿穿著牛仔褲，會不好伸展噢！',
	},
	{
		icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/2c64adb5895cf093a9fa9cd95221288ab25ff289fcade97a061787d6ab22ed2a?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '請自備長度至小腿的長襪',
		description:
			'因雪鞋(靴)為共用配備，衛生考量，請另自備長度至小腿的長襪到現場更換。如果未帶襪子，現場有代售一雙棉襪 50元、雪襪 500 元。',
	},
	{
		icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/a42342f6c77f0fe6fd12f0eb8c63d67398f15d70522659b7746ac8f49a257f59?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '補充水分、自備毛巾',
		description: '課程中需隨時補充水分，請自備水壺及毛巾。',
	},
	{
		icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/60a4c00349bdc126d234673342a3b03643479e4ec1dc60b0ce8b60ffc5850ee3?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f',
		title: '學校位置、停車資訊',
		description: '停車場規劃複雜，地下室訊號不佳，如有停車需求請先看過停車資訊與影片。',
		link: {
			text: '詳細資訊',
			url: '#',
		},
	},
];

const NoticeSection = () => {
	return (
		<section
			id='course-notes'
			className='flex flex-col self-stretch pb-12 pt-9 border-b border-solid border-b-zinc-300 max-w-[780px]'
		>
			<h2 className='text-2xl font-medium tracking-tight leading-loose text-zinc-800 max-xs:max-w-full'>注意事項</h2>
			<div className='flex flex-col mt-6 w-full text-base max-xs:max-w-full'>
				<div className='flex flex-wrap gap-3 w-full min-h-[184px] max-xs:max-w-full'>
					{noticeData.slice(0, 2).map((item, index) => (
						<NoticeItem key={index} {...item} />
					))}
				</div>
				<div className='flex flex-wrap gap-3 mt-3 w-full min-h-[184px] max-xs:max-w-full'>
					{noticeData.slice(2, 4).map((item, index) => (
						<NoticeItem key={index} {...item} />
					))}
				</div>
				<div className='flex flex-wrap gap-3 items-start mt-3 w-full max-xs:max-w-full'>
					{noticeData.slice(4).map((item, index) => (
						<NoticeItem key={index} {...item} />
					))}
				</div>
			</div>
		</section>
	);
};

export default NoticeSection;
