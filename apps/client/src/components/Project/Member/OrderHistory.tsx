'use client';

import { OrderStatus } from '@repo/shared';

import OrderBase, { type OrderBaseProps } from './OrderBase';

const orderStatusMapper: OrderBaseProps['orderStatusMapper'] = {
	[OrderStatus.ORDER_COMPLETED]: {
		headerStyle: 'border-[#2E7BBE] text-[#2E7BBE]',
		headerLabel: '訂單完成',
		headerText: '',
		buttonLabel: '',
	},
	[OrderStatus.ORDER_CANCELED]: {
		headerStyle: 'border-[#818181] text-[#818181]',
		headerLabel: '訂單取消',
		headerText: '取消日期',
		buttonLabel: '',
	},
};

export default function OrderHistory() {
	return <OrderBase orderStatusMapper={orderStatusMapper} />;
}
