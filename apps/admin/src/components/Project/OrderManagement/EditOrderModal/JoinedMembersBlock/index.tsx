import React from 'react';

import { Button } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';

type Props = {};

const JoinedMembersBlock = (props: Props) => {
	const fakeRow = [
		{
			width: '45px',
			label: '#1',
			show: true,
		},
		{
			width: '135px',
			label: '',
			show: true,
			component: <Button>李大明</Button>,
		},
		{
			width: '80px',
			label: '32',
			show: true,
		},
		{
			width: '120px',
			label: '0900123456',
			show: true,
		},
		{
			width: '180px',
			label: '單板 (L7)、雙板 (L7) ',
			show: true,
		},
		{
			width: '192px',
			label: '',
			show: true,
		},
	];

	return (
		<div>
			<FormikModalTable
				name='orderJoinedMembersTable'
				tableHeader={[
					{
						label: '',
						width: '60px',
						show: true,
					},
					{
						label: '姓名',
						width: '120px',
						show: true,
					},
					{
						label: '年齡',
						width: '80px',
						show: true,
					},
					{
						label: '手機',
						width: '120px',
						show: true,
					},
					{
						label: '板類 (等級)',
						width: '180px',
						show: true,
					},
					{
						label: ' ',
						width: '192px',
						show: true,
					},
				]}
				tableRowCell={Array(4).fill(fakeRow)}
			/>
		</div>
	);
};

export default JoinedMembersBlock;
