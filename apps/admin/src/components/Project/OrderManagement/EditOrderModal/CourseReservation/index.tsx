import React from 'react';

import { Button } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';
import RoundedArrowTopRight from '@/components/Common/Icon/RoundedArrowTopRight';

type Props = {};

const CourseReservation = (props: Props) => {
	const fakeRow = [
		{
			width: '60px',
			label: '#1',
			show: true,
		},
		{
			width: '80px',
			label: '已完成',
			show: true,
		},
		{
			width: '150px',
			label: '2024/12/20 18:00',
			show: true,
		},
		{
			width: '60px',
			label: '2',
			show: true,
		},
		{
			width: '300px',
			label: '李大名、李大名、李大名、李大名、李大名',
			show: true,
		},
		{
			width: '100px',
			// label: '檢視',
			show: true,
			component: <Button endIcon={<RoundedArrowTopRight />}>編輯</Button>,
		},
	];

	return (
		<div>
			<FormikModalTable
				name='courseReservationTable'
				tableHeader={[
					{
						label: '',
						width: '60px',
						show: true,
					},
					{
						label: '狀態',
						width: '80px',
						show: true,
					},
					{
						label: '時間',
						width: '150px',
						show: true,
					},
					{
						label: '等級',
						width: '60px',
						show: true,
					},
					{
						label: '參加人員',
						width: '300px',
						show: true,
					},
					{
						label: ' ',
						width: '100px',
						show: true,
					},
				]}
				tableRowCell={Array(4).fill(fakeRow)}
			/>
		</div>
	);
};

export default CourseReservation;
