import React from 'react';

import { Button } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';
import { OrderReservationResponseDto, ReservationResponseDto, CourseSkiType } from '@repo/shared';

interface OrderMember {
	id: string;
	memberId: string;
	memberName: string;
	memberPhone: string;
	memberBirthday: Date;
	snowboard: number;
	skis: number;
}

interface Props {
	members?: OrderMember[];
	reservations?: OrderReservationResponseDto[];
	skiType?: CourseSkiType;
}

const JoinedMembersBlock = ({ members = [], reservations = [], skiType }: Props) => {
	// Calculate age from birthday
	const calculateAge = (birthday: Date | null | undefined): number => {
		if (!birthday) return 0;
		const today = new Date();
		const birthDate = new Date(birthday);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};
	const getUsedReservations = (member: OrderMember): number => {
		let count = 0;

		reservations.forEach((reservation) => {
			if (reservation?.reservation?.reservationMembers && reservation.reservation.reservationMembers.some((m) => m.orderMemberId === member.id)) {
				count++;
			}
		});

		return count;
	};
	// Format board type and level based on skiType
	const formatBoardLevel = (snowboard: number, skis: number): string => {
		const parts: string[] = [];

		// CourseSkiType: BOTH=0, SNOWBOARD=1, SKI=2
		// If skiType is not provided, show both (backward compatibility)
		const shouldShowSnowboard = skiType === undefined || skiType === CourseSkiType.SNOWBOARD || skiType === CourseSkiType.BOTH;
		const shouldShowSki = skiType === undefined || skiType === CourseSkiType.SKI || skiType === CourseSkiType.BOTH;

		if (shouldShowSnowboard ) {
			parts.push(`單板 (L${snowboard})`);
		}
		if (shouldShowSki ) {
			parts.push(`雙板 (L${skis})`);
		}
		return parts.length > 0 ? parts.join('、') : '-';
	};

	const tableRowCell = members.map((member, index) => [
		{
			width: '45px',
			label: `#${index + 1}`,
			show: true,
		},
		{
			width: '135px',
			label: '',
			show: true,
			component: <Button>{member.memberName || '-'}</Button>,
		},
		{
			width: '80px',
			label: member.memberBirthday ? calculateAge(member.memberBirthday).toString() : '-',
			show: true,
		},
		{
			width: '120px',
			label: member.memberPhone || '-',
			show: true,
		},
		{
			width: '180px',
			label: formatBoardLevel(member.snowboard, member.skis),
			show: true,
		},
		{
			width: '192px',
			label: getUsedReservations(member).toString(),
			show: true,
		},
	]);

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
						label: '使用堂數',
						width: '192px',
						show: true,
					},
				]}
				tableRowCell={tableRowCell}
			/>
		</div>
	);
};

export default JoinedMembersBlock;
