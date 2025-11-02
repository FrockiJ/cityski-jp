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
import { ReservationHistoryService } from './reservation-history.service';
import { ReservationHistory } from './entities/reservation-history.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/reservation-history')
export class ReservationHistoryController {
  constructor(private reservationHistoryService: ReservationHistoryService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  create(@Body() body: Partial<ReservationHistory>): Promise<ReservationHistory> {
    return this.reservationHistoryService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(): Promise<ReservationHistory[]> {
    return this.reservationHistoryService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<ReservationHistory> {
    return this.reservationHistoryService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get('/reservation/:reservationId')
  findByReservationId(@Param('reservationId') reservationId: string): Promise<ReservationHistory[]> {
    return this.reservationHistoryService.findByReservationId(reservationId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<ReservationHistory>,
  ): Promise<ReservationHistory> {
    return this.reservationHistoryService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reservationHistoryService.remove(id);
  }
}