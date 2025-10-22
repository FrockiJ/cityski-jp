'use client';

import { OrderStatus } from '@repo/shared';
import { useRouter } from 'next/navigation';

import ArrowIcon from '@/components/Icon/ArrowIcon';
import InfoIcon from '@/components/Icon/InfoIcon';
import { Button } from '@/components/ui/button';
import { useMyOrders } from '@/hooks/useMyOrders';

type UIOrderStatus = 'unpaid' | 'paid' | 'confirmed';

export default function CurrentOrders() {
	const router = useRouter();
	const { orders, loading, error } = useMyOrders();

	// Map API order status to local status format
	const mapOrderStatus = (apiOrder: any): UIOrderStatus => {
		switch (apiOrder.status) {
			case OrderStatus.PENDING_DEPOSIT: // 0 - 待付訂金
				return 'unpaid';
			case OrderStatus.WAITING_FOR_CONFIRMATION: // 1 - 等待確認
				return 'paid';
			case OrderStatus.ORDER_SUCCESSFUL: // 2 - 訂購成功
			case OrderStatus.ORDER_COMPLETED: // 3 - 訂單完成
				return 'confirmed';
			case OrderStatus.ORDER_CANCELED: // 9 - 訂單取消
			default:
				return 'unpaid';
		}
	};

	// Transform API orders to UI format
	const transformedOrders = (orders || []).map((apiOrder) => ({
		id: apiOrder.id,
		status: mapOrderStatus(apiOrder),
		date: new Date(apiOrder.createdTime).toLocaleString('zh-TW'),
		title: apiOrder.courseName,
		description: `${apiOrder.number}堂課程\n${apiOrder.people}人`,
		price: apiOrder.price.toLocaleString(),
		courseType: 'group', // TODO: Map from API data
		isAllConfirm: true, // TODO: Map from API data
	}));

	// Use transformed orders from API
	const displayOrders = transformedOrders;

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

	const handleClick = (orderId: string | number) => {
		router.push(`/order/${orderId}`);
	};

	// Show loading state
	if (loading) {
		return (
			<main className='flex flex-col max-w-[856px] max-xs:ml-0 max-xs:w-full'>
				<section className='xs:p-8 xs:border xs:rounded-2xl flex flex-col gap-4 w-full'>
					<div className='hidden xs:block text-[26px] font-medium mb-4'>目前預約/訂單</div>
					<div className='text-center py-8'>載入中...</div>
				</section>
			</main>
		);
	}

	// Show error state
	if (error) {
		return (
			<main className='flex flex-col max-w-[856px] max-xs:ml-0 max-xs:w-full'>
				<section className='xs:p-8 xs:border xs:rounded-2xl flex flex-col gap-4 w-full'>
					<div className='hidden xs:block text-[26px] font-medium mb-4'>目前預約/訂單</div>
					<div className='text-center py-8 text-red-500'>載入失敗: {error}</div>
				</section>
			</main>
		);
	}

	return (
		<main className='flex flex-col max-w-[856px] max-xs:ml-0 max-xs:w-full'>
			<section className='xs:p-8 xs:border xs:rounded-2xl	flex flex-col gap-4 w-full'>
				<div className='hidden xs:block text-[26px] font-medium mb-4'>目前預約/訂單</div>
				{displayOrders.length ? (
					displayOrders.map((order) => (
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
