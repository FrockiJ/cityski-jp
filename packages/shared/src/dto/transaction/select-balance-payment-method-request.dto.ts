import { IsString, IsIn } from 'class-validator';

export class SelectBalancePaymentMethodRequestDTO {
	@IsString()
	orderId: string;

	@IsIn(['ATM', 'CREDIT'])
	paymentMethod: string;
}
