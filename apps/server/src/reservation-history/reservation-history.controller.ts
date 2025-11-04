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
import { ReservationHistoryService } from './reservation-history.service';
import {
  ReservationHistoryResponseDto,
  CreateReservationHistoryRequestDto,
  UpdateReservationHistoryRequestDto,
} from '@repo/shared';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/reservation-history')
export class ReservationHistoryController {
  constructor(private reservationHistoryService: ReservationHistoryService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() body: CreateReservationHistoryRequestDto): Promise<ReservationHistoryResponseDto> {
    const result = await this.reservationHistoryService.create(body);
    return plainToInstance(ReservationHistoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll(): Promise<ReservationHistoryResponseDto[]> {
    const result = await this.reservationHistoryService.findAll();
    return plainToInstance(ReservationHistoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ReservationHistoryResponseDto> {
    const result = await this.reservationHistoryService.findOne(id);
    return plainToInstance(ReservationHistoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/reservation/:reservationId')
  async findByReservationId(@Param('reservationId') reservationId: string): Promise<ReservationHistoryResponseDto[]> {
    const result = await this.reservationHistoryService.findByReservationId(reservationId);
    return plainToInstance(ReservationHistoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateReservationHistoryRequestDto,
  ): Promise<ReservationHistoryResponseDto> {
    const result = await this.reservationHistoryService.update(id, body);
    return plainToInstance(ReservationHistoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reservationHistoryService.remove(id);
  }
}