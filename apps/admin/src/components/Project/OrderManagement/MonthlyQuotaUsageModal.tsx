import React from 'react';
import { Stack } from '@mui/material';
import { Formik } from 'formik';

import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';

type Props = {};

const MonthlyQuotaUsageModal = (props: Props) => {
	const fakeRow = [
		{
			width: '54px',
			label: '',
			show: true,
		},
		{
			width: '140px',
			// label: '李大名',
			show: true,
			component: (
				<Stack spacing={0.5}>
					<div>李大名</div>
					<div>0912345678</div>
				</Stack>
			),
		},
		{
			width: '140px',
			// label: '團體課教學(3)',
			show: true,
			component: (
				<Stack spacing={0.5} color='#3360FF' sx={{ cursor: 'pointer' }}>
					<div>團體課教學(3)</div>
					<div>00001</div>
				</Stack>
			),
		},
		{
			width: '115px',
			label: '$91,000',
			show: true,
		},
		{
			width: '120px',
			label: '$6,400',
			show: true,
		},
		{
			width: '100px',
			label: '$3,200',
			show: true,
		},
		{
			width: '100px',
			label: '$3,200',
			show: true,
		},
		{
			width: '100px',
			label: '$3,200',
			show: true,
		},
		{
			width: '100px',
			label: '$3,200',
			show: true,
		},
	];
	return (
		<Stack direction='column' spacing={2} py={3}>
			<Stack direction='row' spacing={2} justifyContent='space-between'>
				<div>搜尋會員姓名或訂單編號</div>
				<Stack direction='row' spacing={2}>
					<div>2024年</div>
					<div>12月</div>
				</Stack>
			</Stack>
			<Formik initialValues={{}} onSubmit={() => {}}>
				<FormikModalTable
					// wrapperSxProps={{ height: '500px' }}
					name='monthlyQuotaUsageTable'
					tableHeader={[
						{
							label: '',
							width: '54px',
							show: true,
						},
						{
							label: '訂購人',
							width: '150px',
							show: true,
						},
						{
							label: '訂單(人數)',
							width: '140px',
							show: true,
						},
						{
							label: '總金額',
							width: '120px',
							show: true,
						},
						{
							label: '餘額',
							width: '120px',
							show: true,
						},
						{
							label: '1月',
							width: '100px',
							show: true,
						},
						{
							label: '2月',
							width: '100px',
							show: true,
						},
						{
							label: '3月',
							width: '100px',
							show: true,
						},
						{
							label: '4月',
							width: '100px',
							show: true,
						},
					]}
					tableRowCell={Array(24).fill(fakeRow)}
				/>
			</Formik>
		</Stack>
	);
};

export default MonthlyQuotaUsageModal;
