import {
	CreateCourseRequestDTO,
	CreateDraftCourseRequestDTO,
	GetCourseDetailResponseDTO,
	GetCourseManagementVenuesResponseDTO,
	GetPublishedCoursesResponseDTO,
	Response,
	ResponseWrapper,
	UpdateCourseManagementVenuesRequestDTO,
	UpdateCourseRequestDTO,
	UpdateDraftCourseRequestDTO,
	UpdatePublishedCoursesSortingRequestDTO,
} from '@repo/shared';

import http from '@/utils/http/instance';

export const getCourseDetail = (courseId: string) => {
	return http.get<ResponseWrapper<GetCourseDetailResponseDTO>>(`/api/courses/${courseId}`);
};

export const getCourseManagementVenues = ({ departmentId }: { departmentId: string }) => {
	return http.get<ResponseWrapper<GetCourseManagementVenuesResponseDTO>>(
		`/api/courses/${departmentId}/course-management-venues`,
	);
};

export const updateCourseManagementVenues = (payload: UpdateCourseManagementVenuesRequestDTO[]) => {
	return http.patch<Response>(`/api/courses/course-management-venues`, payload);
};

export const getCoursePublishedList = ({ departmentId }: { departmentId: string }) => {
	return http.get<ResponseWrapper<GetPublishedCoursesResponseDTO>>(
		`/api/courses/${departmentId}/manage-published-courses`,
	);
};

export const updateCoursePublishedList = (payload: UpdatePublishedCoursesSortingRequestDTO) => {
	return http.patch<Response>(`/api/courses/manage-published-courses/sort`, payload);
};

export const createCourseDraft = (payload: CreateDraftCourseRequestDTO) => {
	return http.post<Response>(`/api/courses/draft`, payload);
};

export const updateCourseDraft = (payload: UpdateDraftCourseRequestDTO) => {
	return http.patch<Response>(`/api/courses/draft`, payload);
};

export const deleteCourseDraft = ({ draftId }: { draftId: string }) => {
	return http.delete<Response>(`/api/courses/${draftId}/delete`);
};

export const createCourse = (payload: CreateCourseRequestDTO) => {
	return http.post<Response>(`/api/courses`, payload);
};

export const updateCourse = (payload: UpdateCourseRequestDTO) => {
	return http.patch<Response>(`/api/courses`, payload);
};

export const deleteCourse = ({ courseId }: { courseId: string }) => {
	return http.delete<Response>(`/api/courses/${courseId}`);
};

export const revertBackToDraft = ({ courseId }: { courseId: string }) => {
	return http.patch<Response>(`/api/courses/${courseId}/revert`);
};

export const unpublishCourse = ({ courseId }: { courseId: string }) => {
	return http.patch<Response>(`/api/courses/${courseId}/unpublished`);
};
