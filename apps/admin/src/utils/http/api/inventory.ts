import {
  GetInventoryRequestDTO,
  GetInventoryResponseDTO,
  ResponseWrapper,
} from '@repo/shared';
import { http } from '@/utils/http/instance';

export const getInventory = (params?: GetInventoryRequestDTO) => {
  return http.get<ResponseWrapper<GetInventoryResponseDTO>>('/api/inventory', { params });
};
