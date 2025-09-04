import React from 'react';

interface NoticeItemProps {
	icon: string;
	title: string;
	description: string;
	link?: {
		text: string;
		url: string;
	};
}

const NoticeItem = ({ icon, title, description, link }: NoticeItemProps) => {
	return (
		<article className='flex flex-col flex-1 shrink px-6 py-5 leading-6 bg-white rounded-lg border border-solid basis-0 border-zinc-300 min-w-[240px] h-[184px] max-xs:px-5'>
			<img loading='lazy' src={icon} alt='' className='object-contain w-6 aspect-square' />
			<div className='flex flex-col mt-3 w-[101%]'>
				<h3 className='font-medium text-zinc-800'>{title}</h3>
				<p className='mt-1.5 text-zinc-500'>{description}</p>
				{link && (
					<a href={link.url} className='flex gap-0.5 items-center self-start mt-1.5 text-sm leading-6 text-blue-600'>
						<span>{link.text}</span>
						<img
							loading='lazy'
							src='https://cdn.builder.io/api/v1/image/assets/TEMP/f4b9bd9a7062c9382fcce71ed800e88f288abdf1387dd8c3e19609e3fafd7467?placeholderIfAbsent=true&apiKey=94845a89f25540f0bbe6b080603a926f'
							alt=''
							className='object-contain shrink-0 self-stretch my-auto w-4 aspect-square'
						/>
					</a>
				)}
			</div>
		</article>
	);
};

export default NoticeItem;
