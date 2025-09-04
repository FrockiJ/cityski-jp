
interface CourseCardProps {
	imageUrl: string;
	title: string;
	price: number;
	showPriceLabel?: boolean;
}

function CourseCard({ imageUrl, title, price, showPriceLabel = true }: CourseCardProps) {
	return (
		<article
			className='flex overflow-hidden flex-col grow shrink bg-white rounded-2xl border border-gray-200 border-solid cursor-pointer min-w-[288px] w-[288px] max-w-[288px]'
			role='listitem'
		>
			<figure className='flex overflow-hidden flex-col w-72 max-w-full border border-solid border-black border-opacity-10'>
				<img
					loading='lazy'
					src={imageUrl}
					alt={`Course thumbnail for ${title}`}
					className='object-cover w-full aspect-[1.43]'
				/>
			</figure>
			<section className='flex flex-col px-5 py-4 w-full whitespace-nowrap text-zinc-800'>
				<h3 className='text-lg leading-none'>{title}</h3>
				<div className='flex gap-0.5 items-center self-start'>
					<span
						className='self-stretch my-auto text-base font-semibold tracking-tight'
						aria-label={`Price: ${price.toLocaleString()} dollars`}
					>
						${price.toLocaleString()}
					</span>
					{showPriceLabel && (
						<span className='self-stretch my-auto text-sm leading-6' aria-hidden='true'>
							起
						</span>
					)}
				</div>
			</section>
		</article>
	);
}

export default CourseCard;
