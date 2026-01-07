import React from 'react';

import Button from '../Shared/Common/Button';
import Course from '../TermsAndConditions/Course';

const Terms = () => {
	return (
		<main className='flex flex-col max-w-[856px] max-xs:ml-0 max-xs:w-full'>
			<div className='flex flex-col grow justify-center p-8 w-full bg-white rounded-2xl border border-solid border-zinc-300 max-xs:px-0 max-xs:mt-0 max-xs:max-w-full max-xs:border-none max-xs:p-0'>
				<div className='flex justify-between'>
					<h2 className='self-start text-2xl font-medium tracking-tight leading-loose text-zinc-800 max-xs:hidden'>
						課程約定事項
					</h2>
					<a href='/pdf/Terms.pdf' download className='flex items-center gap-1 max-xs:hidden'>
						<img src='/image/terms/dl-docs.svg' alt='download-document' />
						<span className='text-blue-600 hover:text-blue-700 text-sm'>
							下載文件
						</span>
					</a>
					<Button variant='secondary' className='w-full h-10 xs:hidden'>
						<a href='/pdf/Terms.pdf' download className='flex items-center gap-1'>
							<img src='/image/terms/dl-docs.svg' alt='download-document' />
							<span className='text-blue-600 hover:text-blue-700 text-sm'>
								下載文件
							</span>
						</a>
					</Button>
				</div>

				<Course />
			</div>
		</main>
	);
};

export default Terms;
