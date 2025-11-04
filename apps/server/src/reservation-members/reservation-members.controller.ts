import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReservationMembersService } from './reservation-members.service';
import {
  ReservationMemberResponseDto,
  CreateReservationMemberRequestDto,
  UpdateReservationMemberRequestDto,
} from '@repo/shared';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/reservation-members')
export class ReservationMembersController {
  constructor(private reservationMembersService: ReservationMembersService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() body: CreateReservationMemberRequestDto): Promise<ReservationMemberResponseDto> {
    const result = await this.reservationMembersService.create(body);
    return plainToInstance(ReservationMemberResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll(): Promise<ReservationMemberResponseDto[]> {
    const result = await this.reservationMembersService.findAll();
    return plainToInstance(ReservationMemberResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ReservationMemberResponseDto> {
    const result = await this.reservationMembersService.findOne(id);
    return plainToInstance(ReservationMemberResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/reservation/:reservationId')
  async findByReservationId(
    @Param('reservationId') reservationId: string,
  ): Promise<ReservationMemberResponseDto[]> {
    const result = await this.reservationMembersService.findByReservationId(reservationId);
    return plainToInstance(ReservationMemberResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/order-member/:orderMemberId')
  async findByOrderMemberId(
    @Param('orderMemberId') orderMemberId: string,
  ): Promise<ReservationMemberResponseDto[]> {
    const result = await this.reservationMembersService.findByOrderMemberId(orderMemberId);
    return plainToInstance(ReservationMemberResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateReservationMemberRequestDto,
  ): Promise<ReservationMemberResponseDto> {
    const result = await this.reservationMembersService.update(id, body);
    return plainToInstance(ReservationMemberResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reservationMembersService.remove(id);
  }
}
