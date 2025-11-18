import { GetOrderDetailResponseDTO } from '../orders/get-order-detail-response.dto';

export class RedeemInvitationResponseDto {
  message: string;
  order: GetOrderDetailResponseDTO;
}
  