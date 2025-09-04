import { OrderByType } from '@repo/shared';

export class PaginationRequestDto {
	offset?: number;
	limit?: number;
	sort?: string;
	order?: OrderByType;
}
