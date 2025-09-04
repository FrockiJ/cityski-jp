import {
	CreateHomeVideoRequestDTO,
	GetHomeBannerResponseDTO,
	GetHomeVideoResponseDTO,
	Response,
	ResponseWrapper,
	UpdateHomeBannerRequestDTO,
} from '@repo/shared';

import http from '@/utils/http/instance';

export const getHomeBanner = () => {
	return http.get<ResponseWrapper<GetHomeBannerResponseDTO>>(`/api/content-management/home-banner`);
};

export const updateHomeBanner = ({ buttonUrl, attachments }: UpdateHomeBannerRequestDTO) => {
	return http.patch<Response>(`/api/content-management/home-banner`, {
		buttonUrl,
		attachments,
	});
};

export const getHomeVideo = () => {
	return http.get<ResponseWrapper<GetHomeVideoResponseDTO[]>>(`/api/content-management/home-video`);
};

export const updateHomeVideo = (homeVideoList: CreateHomeVideoRequestDTO[]) => {
	return http.post<Response>(`/api/content-management/home-video`, homeVideoList);
};
