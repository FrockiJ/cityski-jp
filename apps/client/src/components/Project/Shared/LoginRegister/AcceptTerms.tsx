import { useFormContext } from '../Context/FormContext';

interface AcceptTermsProps {
	id: string;
	name?: string;
}

const AcceptTerms = ({ id, name = id }: AcceptTermsProps) => {
	const formik = useFormContext();

	const validationProps = formik
		? {
				name: id,
				checked: formik.values[id],
				onChange: formik.handleChange,
				onBlur: formik.handleBlur,
				error: formik.touched[id] && (formik.errors[id] as string),
			}
		: {
				name,
				checked: false,
				onChange: () => {},
				onBlur: () => {},
				error: undefined,
			};

	return (
		<div className='flex flex-col w-full'>
			<div className='flex overflow-hidden gap-2 items-start w-full'>
				<input type='checkbox' id={id} className='sr-only' {...validationProps} />
				<label htmlFor={id} className='flex items-start cursor-pointer'>
					<div className='flex mt-[3px]'>
						<div
							className={`w-5 h-5 flex items-center justify-center rounded border ${
								validationProps.checked
									? 'bg-blue-600 border-blue-600'
									: validationProps.error
										? 'border-red-500'
										: 'border-zinc-500'
							}`}
						>
							{validationProps.checked && (
								<svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
									<path
										d='M11.6667 3.5L5.25 9.91667L2.33333 7'
										stroke='white'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							)}
						</div>
					</div>
					<span className='text-sm leading-6 text-zinc-800 w-[303px] ml-2 select-none'>
						點擊同意表示您已閱讀且同意本網站的
						<a href='#' className='text-blue-600 hover:text-blue-700'>
							課程約定事項
						</a>
						，
						<a href='#' className='text-blue-600 hover:text-blue-700'>
							使用條款
						</a>
						以及
						<a href='#' className='text-blue-600 hover:text-blue-700'>
							隱私權政策
						</a>
					</span>
				</label>
			</div>
			{typeof validationProps.error === 'string' && (
				<p className='mt-1 text-sm text-red-500 ml-8'>{validationProps.error}</p>
			)}
		</div>
	);
};

export default AcceptTerms;
