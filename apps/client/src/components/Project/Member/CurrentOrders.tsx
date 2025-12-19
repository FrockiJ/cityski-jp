'use client';

import { OrderStatus } from '@repo/shared';

import OrderBase from './OrderBase';

export const orderStatusMapper = {
	[OrderStatus.PENDING_DEPOSIT]: {
		headerStyle: 'border-[#FE7B5D] text-[#FE7B5D]',
		headerLabel: '待付訂金',
		headerText: '訂單保留期限',
		buttonLabel: '回覆匯款帳號',
	},
	[OrderStatus.WAITING_FOR_CONFIRMATION]: {
		headerStyle: 'border-[#2B2B2B] text-[#2B2B2B]',
		headerLabel: '等待確認',
		headerText: '即將上課時間',
		buttonLabel: '管理參加人員',
	},
	[OrderStatus.ORDER_SUCCESSFUL]: {
		headerStyle: 'border-[#169B62] text-[#169B62]',
		headerLabel: '訂購成功',
		headerText: '即將上課時間',
		buttonLabel: '預約課程',
	},
	[OrderStatus.ORDER_COMPLETED]: {
		headerStyle: 'border-[#2E7BBE] text-[#2E7BBE]',
		headerLabel: '訂單完成',
		headerText: '即將上課時間',
		buttonLabel: '預約課程',
	},
	[OrderStatus.ORDER_CANCELED]: {
		headerStyle: 'border-[#9CA3AF] text-[#9CA3AF]',
		headerLabel: '訂單取消',
		headerText: '取消時間',
		buttonLabel: '查看詳情',
	},
};

export default function CurrentOrders() {
	return <OrderBase orderStatusMapper={orderStatusMapper} />;
}
