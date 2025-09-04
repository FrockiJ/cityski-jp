import React from 'react';

import Button from '@/components/Project/Shared/Common/Button';
import OrDivider from '@/components/Project/Shared/LoginRegister/OrDivider';

import LineLoginButton from './LineLoginButton';

interface LoginFormProps {
	onEmailClick: () => void;
}

const LoginForm = ({ onEmailClick }: LoginFormProps) => {
	return (
		<section className='flex flex-col mt-6 max-xs:mt-10'>
			<div className='flex flex-col w-full'>
				<h1 className='text-4xl font-medium tracking-tighter leading-[58px] text-center text-zinc-800'>登入會員</h1>
				<div className='flex flex-col px-6 py-7 mt-6 w-full text-center bg-white rounded-xl border-2 border-green-500 border-solid max-xs:px-5'>
					<div className='flex gap-0.5 items-center justify-center text-xl font-medium leading-snug whitespace-nowrap text-zinc-800 max-xs:mx-2.5'>
						<span className='self-stretch my-auto'>加入</span>
						<span className='self-stretch py-1.5 my-auto text-xl font-bold leading-none w-[46px]'>LINE</span>
						<span className='self-stretch my-auto'>好友取得折價優惠</span>
					</div>
					<p className='mb-8 self-center mt-1 text-sm leading-6 text-zinc-500'>使用LINE登入，不需註冊</p>
					<LineLoginButton />
				</div>
				<OrDivider />
				<div className='flex flex-col mt-6 w-full text-base'>
					<Button variant='secondary' onClick={onEmailClick} className='px-6 py-3 w-full' aria-label='Email 登入'>
						Email 登入
					</Button>
					<div className='flex gap-2 items-center self-center mt-4 whitespace-nowrap'>
						<span className='self-stretch my-auto text-zinc-800'>還沒有城市滑雪帳號嗎？</span>
						<a href='/register' className='self-stretch my-auto font-medium text-blue-600 hover:text-blue-700'>
							註冊會員
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LoginForm;
