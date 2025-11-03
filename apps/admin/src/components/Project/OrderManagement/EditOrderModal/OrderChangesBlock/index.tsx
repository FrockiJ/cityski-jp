import React, { useEffect } from 'react';
import dayjs from 'dayjs';

import { Button } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';
import useModalProvider from '@/hooks/useModalProvider';
import { useOrderHistory } from '@/hooks/useOrder';
import CoreLoaders from '@/CIBase/CoreLoaders';

import InspectChangesModal from './InspectChangesModal';

type Props = {
	orderId?: string;
};

const OrderChangesBlock = ({ orderId }: Props) => {
	const modal = useModalProvider();
	const { histories, loading, error, fetchOrderHistory } = useOrderHistory();

	useEffect(() => {
		if (orderId) {
			fetchOrderHistory(orderId);
		}
	}, [orderId, fetchOrderHistory]);

	// 將歷史記錄轉換為表格行格式
	const historyRows = histories.map((history) => [
		{
			width: '120px',
			label: history.event,
			show: true,
		},
		{
			width: '100px',
			label: history.operator,
			show: true,
		},
		{
			width: '150px',
			label: dayjs(history.time).format('YYYY/MM/DD HH:mm'),
			show: true,
		},
		{
			width: '280px',
			label: history.reason || '無',
			show: true,
		},
		{
			width: '102px',
			label: '',
			show: true,
			component: (
				<Button
					onClick={() => {
						modal.openModal({
							title: `檢視訂單異動原因`,
							width: 480,
							noEscAndBackdrop: true,
							noTitleBorder: true,
							noCancel: true,
							confirmLabel: '關閉',
							children: <InspectChangesModal reason={history.reason || '無'} />,
						});
					}}
				>
					檢視
				</Button>
			),
		},
	]);

	if (loading) {
		return <CoreLoaders />;
	}

	if (error) {
		return <div>載入訂單異動紀錄時發生錯誤: {error}</div>;
	}

	return (
		<div>
			<FormikModalTable
				name='orderChangesTable'
				tableHeader={[
					{
						label: '事件',
						width: '120px',
						show: true,
					},
					{
						label: '操作者',
						width: '100px',
						show: true,
					},
					{
						label: '時間',
						width: '150px',
						show: true,
					},
					{
						label: '原因',
						width: '280px',
						show: true,
					},
					{
						label: '',
						width: '102px',
						show: true,
					},
				]}
				tableRowCell={historyRows}
			/>
		</div>
	);
};

export default OrderChangesBlock;
