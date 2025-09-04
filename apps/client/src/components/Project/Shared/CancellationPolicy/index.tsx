import React from 'react';

interface CancellationPolicyProps {
	title: string;
	description: string;
	linkText: string;
	linkHref: string;
}

const CancellationPolicy = ({ title, description, linkText, linkHref }: CancellationPolicyProps): JSX.Element => {
	return (
		<section
			id='cancellation-policy'
			className='flex flex-col pb-12 pt-9 max-w-[780px]'
			aria-labelledby='cancellation-policy-title'
		>
			<div className='flex flex-col w-full max-xs:max-w-full'>
				<h2
					id='cancellation-policy-title'
					className='text-2xl font-medium tracking-tight leading-loose text-zinc-800 max-xs:max-w-full'
				>
					{title}
				</h2>
				<p className='mt-2 text-base leading-6 text-zinc-500'>
					{description}{' '}
					<a href={linkHref} className='text-blue-600' aria-label={`Read more about ${linkText}`}>
						{linkText}
					</a>
					。
				</p>
			</div>
		</section>
	);
};

export default CancellationPolicy;
