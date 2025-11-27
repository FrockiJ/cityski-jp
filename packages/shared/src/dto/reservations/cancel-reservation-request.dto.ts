import { IsNotEmpty, IsString } from 'class-validator';

export class CancelReservationRequestDto {
	@IsString()
	@IsNotEmpty()
	reason: string;
}
