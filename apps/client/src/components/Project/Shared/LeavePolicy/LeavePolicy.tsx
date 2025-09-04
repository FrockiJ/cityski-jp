import React from 'react';
import { CourseBkgType, CourseCancelPolicyTypeEnum } from '@repo/shared';

import DeadlineInfo from './DeadlineInfo';
import PolicyHeader from './PolicyHeader';

interface LeavePolicyProps {
	title: string;
	bkgType: CourseBkgType;
	data: {
		id: string;
		type: CourseCancelPolicyTypeEnum;
		days: number | string;
		sequence: number;
		condition: string;
		fee: string;
	}[];
}

const LeavePolicy = ({ title, bkgType, data }: LeavePolicyProps) => {
	const deadlineData = [
		{ days: '7', condition: '日以上', fee: '可免費更改時段，以 1 次為限。' },
		{ days: '4-7', condition: '日內', fee: '更改時段酌收時段費300 元/人，於上課當日繳交。' },
		{ days: '3', condition: '日內', fee: '更改時段酌收時段場地費1,200 元/人，於上課當日繳交。' },
		{ days: '', condition: '當日臨時請假', fee: '需出示醫師證明或報案三聯單。' },
	];

	const description =
		bkgType === CourseBkgType.FIXED
			? '期限後只能取消訂單申請退費'
			: '經請假改期後的課程，恕不接受取消，未到將視同放棄。';
	return (
		<section
			id='leave-policy'
			className='flex flex-col self-stretch pb-12 pt-9 border-b border-solid border-b-zinc-300 max-w-[780px]'
			aria-labelledby='leave-policy-title'
		>
			<PolicyHeader title={title} description={description} />
			<div className='flex flex-col mt-6 w-full max-xs:max-w-full'>
				<h2 id='deadline-info' className='text-base font-medium text-[#2b2b2b]'>
					請假改期截止時間
				</h2>
				<div
					className='flex flex-col mt-1 w-full text-sm leading-6 text-[#414141] max-xs:max-w-full'
					aria-labelledby='deadline-info'
				>
					{data.map((item, index) => (
						<DeadlineInfo key={index} days={item.days} condition={item.condition} fee={item.fee} />
					))}
				</div>
			</div>
		</section>
	);
};

export default LeavePolicy;
