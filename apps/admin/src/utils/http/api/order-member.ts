import { ResponseWrapper, TransferOrderMemberRequestDto } from '@repo/shared';
import { http } from '@/utils/http/instance';

export const transferOrderMember = (data: TransferOrderMemberRequestDto) => {
	return http.post<ResponseWrapper<void>>('/api/order-members/transfer', data);
};
