'use client';

import { useRouter } from 'next/navigation';

import ArrowIcon from '@/components/Icon/ArrowIcon';
import InfoIcon from '@/components/Icon/InfoIcon';
import { Button } from '@/components/ui/button';

export default function CurrentOrders() {
	const router = useRouter();
	const orders = [
		{
			id: 1,
			status: 'unpaid',
			date: '2024/9/30 21:25',
			title: '團體班教學',
			description: `5堂團體班
2成人 + 1青少年/兒童`,
			price: '20,300',
			courseType: 'group',
			isAllConfirm: true,
		},
		{
			id: 2,
			status: 'paid',
			date: '2024/11/30 18:00',
			title: '團體班教學',
			description: `5堂團體班
2成人 + 1青少年/兒童`,
			price: '20,300',
			courseType: 'group',
			isAllConfirm: true,
		},
		{
			id: 3,
			status: 'confirmed',
			date: '2024/11/30 18:00',
			title: '團體班教學',
			description: `5堂團體班
2成人 + 1青少年/兒童`,
			price: '20,300',
			courseType: 'group',
			isAllConfirm: true,
		},
		{
			id: 4,
			status: 'confirmed',
			date: '2024/11/30 18:00',
			title: '團體班教學',
			description: `5堂團體班
2成人 + 1青少年/兒童`,
			price: '20,300',
			courseType: 'group',
			isAllConfirm: false,
		},
	];

	const orderStatusMapper = {
		unpaid: {
			headerStyle: 'border-[#FE7B5D] text-[#FE7B5D]',
			headerLabel: '待付訂金',
			headerText: '訂單保留時間',
			buttonLabel: '回報付款資訊',
		},
		paid: {
			headerStyle: 'border-[#2B2B2B] text-[#2B2B2B]',
			headerLabel: '等待確認',
			headerText: '即將上課時間',
			buttonLabel: '管理參加人員',
		},
		confirmed: {
			headerStyle: 'border-[#169B62] text-[#169B62]',
			headerLabel: '訂購確認',
			headerText: '預約課程',
			buttonLabel: '預約課程',
		},
	};

	const handleClick = (orderId: number) => {
		router.push(`/order/${orderId}`);
	};

	return (
		<main className='flex flex-col max-w-[856px] max-xs:ml-0 max-xs:w-full'>
			<section className='xs:p-8 xs:border xs:rounded-2xl	flex flex-col gap-4 w-full'>
				<div className='hidden xs:block text-[26px] font-medium mb-4'>目前預約/訂單</div>
				{orders.length ? (
					orders.map((order) => (
						<div key={order.id} className='border rounded-xl flex flex-col'>
							{!order.isAllConfirm && (
								<div className='flex flex-col gap-1.5 py-2 pl-4 pr-3 bg-[#E4F1FC] xs:flex-row xs:justify-between'>
									<div className='flex gap-1.5'>
										<InfoIcon color='#2E7BBE' width='20' height='20' />
										<span className='text-[13px] font-medium text-[#2E7BBE]'>
											還有參加人員未確認，請上課前確認所有人員
										</span>
									</div>
									<div className='flex gap-1.5 pl-[26px] items-center'>
										<span className='text-[13px] font-medium text-[#2E7BBE]'>立即邀請</span>
										<ArrowIcon color='#2E7BBE' />
									</div>
								</div>
							)}
							<div className='px-4 py-[15px] flex justify-between items-center border-b border-[#EDEDED] xs:gap-3 xs:justify-start'>
								<div
									className={
										'py-1.5 px-2.5 border rounded-3xl text-[13px] font-medium xs:text-xl ' +
										orderStatusMapper[order.status].headerStyle
									}
								>
									{orderStatusMapper[order.status].headerLabel}
								</div>
								<div className='text-[13px] text-[#818181] xs:text-base'>
									{orderStatusMapper[order.status].headerText} {order.date}
								</div>
							</div>
							<div className='p-4 flex flex-col xs:flex-row xs:items-end'>
								<div className='flex gap-4 justify-between xs:flex-row-reverse xs:justify-end xs:flex-1'>
									<div className='flex flex-col'>
										<div className='text-lg font-medium mb-1'>{order.title}</div>
										<div className='text-[#818181] whitespace-break-spaces mb-4'>{order.description}</div>
										<div className='font-semibold text-xl mb-4 xs:mb-0'>
											{order.price}
											<span className='font-normal text-sm'>元</span>
										</div>
									</div>
									<div>
										<img src='/image/membership/order.png' alt='order' width='80' height='80' className='xs:hidden' />
										<img
											src='/image/membership/order.png'
											alt='order'
											width='130'
											height='130'
											className='hidden xs:block'
										/>
									</div>
								</div>
								<Button variant='outline' size='lg' className='border-[#2B2B2B]' onClick={() => handleClick(order.id)}>
									{orderStatusMapper[order.status].buttonLabel}
								</Button>
							</div>
						</div>
					))
				) : (
					<h4>No order</h4>
				)}
			</section>
		</main>
	);
}
