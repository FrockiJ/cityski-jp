import { MemberResponseDto, ResponseWrapper, UpdateMemberRequestDTO } from '@repo/shared';

import http from '@/utils/http/instance';

export const updateMemberDetail = ({
	memberId,
	name,
	snowboardLevel,
	skiLevel,
	note,
}: { memberId: string } & UpdateMemberRequestDTO) => {
	return http.patch<ResponseWrapper<MemberResponseDto>>(`/api/member/${memberId}`, {
		name,
		snowboardLevel,
		skiLevel,
		note,
	});
};

export const getMemberDetail = (memberId: string) => {
	return http.get<ResponseWrapper<MemberResponseDto>>(`/api/member/${memberId}`);
};

export const switchMemberStatus = ({ memberId }: { memberId: string }) => {
	return http.patch<ResponseWrapper<MemberResponseDto>>(`/api/member/${memberId}/status`);
};
