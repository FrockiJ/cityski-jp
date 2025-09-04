'use client';

type FAQItemProps = {
	question: string;
	answer?: string;
	defaultExpanded?: boolean;
	onToggle?: () => void;
};

export default function FAQItem({ question, answer, defaultExpanded = false, onToggle }: FAQItemProps) {
	const itemId = `faq-${question.replace(/\s+/g, '-').toLowerCase()}`;
	const answerId = `${itemId}-answer`;

	const handleToggle = () => {
		onToggle?.();
	};

	return (
		<div className='flex flex-col gap-2 px-5 py-5 rounded-lg bg-slate-50 max-sm:p-4'>
			<div className='flex gap-4 justify-between items-start w-full'>
				<button
					className='flex-1 text-left text-base leading-6 text-neutral-700 max-sm:text-base'
					onClick={handleToggle}
					aria-expanded={defaultExpanded}
					aria-controls={answerId}
				>
					{question}
				</button>
				<div>
					<button
						onClick={handleToggle}
						aria-label={defaultExpanded ? 'Collapse answer' : 'Expand answer'}
						className='focus:outline-none'
					>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							className={`arrow-icon transition-transform ${defaultExpanded ? 'rotate-180' : ''}`}
							style={{ width: '24px', height: '24px', flexShrink: 0 }}
						>
							<path
								d='M7 10L12 15L17 10'
								stroke='#818181'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
				</div>
			</div>
			{defaultExpanded && answer && (
				<div id={answerId} className='text-sm leading-6 text-zinc-500 max-sm:text-sm'>
					{answer}
				</div>
			)}
		</div>
	);
}
