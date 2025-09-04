import React from 'react';

import { Button } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';
import useModalProvider from '@/hooks/useModalProvider';

import InspectChangesModal from './InspectChangesModal';

type Props = {};

const OrderChangesBlock = (props: Props) => {
	const modal = useModalProvider();

	const fakeRow = [
		{
			width: '120px',
			label: '訂單取消',
			show: true,
		},
		{
			width: '100px',
			label: '李大明',
			show: true,
		},
		{
			width: '150px',
			label: '2024/12/15 16:00',
			show: true,
		},
		{
			width: '280px',
			label: '因個人安排，無法參與滑雪夏令營的任何檔次，故取消訂單。',
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
							children: <InspectChangesModal reason='因個人安排，無法參與滑雪夏令營的任何檔次，故取消訂單。' />,
						});
					}}
				>
					檢視
				</Button>
			),
		},
	];

	return (
		<div>
			<FormikModalTable
				name='orderJoinedMembersTable'
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
				tableRowCell={Array(4).fill(fakeRow)}
			/>
		</div>
	);
};

export default OrderChangesBlock;
