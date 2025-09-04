import {
	CheckDiscountCodeRequestDTO,
	CreateDiscountRequestDTO,
	Response,
	UpdateDiscountRequestDTO,
} from '@repo/shared';

import http from '@/utils/http/instance';

export const createDiscount = (payload: CreateDiscountRequestDTO) => {
	return http.post<Response>(`/api/discounts`, payload);
};

export const updateDiscount = (payload: UpdateDiscountRequestDTO) => {
	return http.patch<Response>(`/api/discounts`, payload);
};

export const deleteDiscount = ({ discountId }: { discountId: string }) => {
	return http.delete<Response>(`/api/discounts/${discountId}`);
};

export const checkDiscountCode = (params: CheckDiscountCodeRequestDTO) => {
	return http.get<Response>(`/api/discounts/check-code`, params);
};

export const switchDiscountStatus = ({ discountId }: { discountId: string }) => {
	return http.patch<Response>(`/api/discounts/status/${discountId}`);
};
