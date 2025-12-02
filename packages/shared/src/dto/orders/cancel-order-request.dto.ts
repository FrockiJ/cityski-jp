import { IsNotEmpty, IsString } from 'class-validator';

export class CancelOrderRequestDto {
	@IsString()
	@IsNotEmpty()
	reason: string;
}
