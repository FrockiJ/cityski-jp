import React from 'react';
import { GetClientCoursesResponseDTO } from '@repo/shared';
import Link from 'next/link';

interface CourseCategoryCardProps extends GetClientCoursesResponseDTO {
	additionalInfo?: string;
	className?: string;
}

const CourseCategoryCard = ({
	id,
	name,
	description,
	lowestPrice,
	image,
	additionalInfo,
	className,
}: CourseCategoryCardProps) => {
	// Function to get the route based on name
	// const getRoute = (courseType: string) => {
	// 	switch (courseType) {
	// 		case '團體班體驗':
	// 			return '/courses/group-course';
	// 		default:
	// 			return '#'; // Default route or you can return null
	// 	}
	// };

	return (
		<Link href={`/courses/course-detail?id=${id}`}>
			<article
				className={`h-[100%] flex overflow-hidden flex-col grow shrink-0 rounded-2xl bg-neutral-200 min-w-[240px] max-xs:min-w-0 cursor-pointer group ${className}`}
			>
				<div className='relative w-full h-full'>
					<img
						loading='lazy'
						src={process.env.NEXT_PUBLIC_AWS_S3_URL + image}
						alt={name}
						className='object-cover w-full h-full scale-100 transition duration-500 motion-safe:group-hover:scale-105'
					/>
					<div className='flex absolute bottom-0 flex-col items-start px-6 pt-16 pb-6 max-xs:px-5 w-full z-10 bg-gradient-to-t from-black/70 to-transparent'>
						<div className='flex flex-col w-full mt-auto'>
							<div className='flex flex-col w-full'>
								<h2 className='w-full text-2xl font-medium text-white'>{name}</h2>
								<p className='text-sm leading-loose text-white text-opacity-90'>{description}</p>
							</div>
							<div className='flex gap-1 items-center self-start px-5 py-1.5 mt-4 font-medium bg-white group-hover:bg-gradient-to-r from-[#FE696C] to-[#FD8E4B] group-hover:text-white transition-colors duration-200 rounded-3xl text-zinc-800'>
								<div className='self-stretch my-auto text-base tracking-tight'>{lowestPrice}</div>
								<div className='self-stretch my-auto text-sm leading-loose'>元起</div>
								{additionalInfo && <div className='self-stretch my-auto text-sm leading-loose'>{additionalInfo}</div>}
							</div>
						</div>
					</div>
				</div>
			</article>
		</Link>
	);
};

export default CourseCategoryCard;
