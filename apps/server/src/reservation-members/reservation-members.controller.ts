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
import { ReservationMembersService } from './reservation-members.service';
import { ReservationMember } from './entities/reservation-member.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/reservation-members')
export class ReservationMembersController {
  constructor(private reservationMembersService: ReservationMembersService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  create(@Body() body: Partial<ReservationMember>): Promise<ReservationMember> {
    return this.reservationMembersService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(): Promise<ReservationMember[]> {
    return this.reservationMembersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<ReservationMember> {
    return this.reservationMembersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get('/reservation/:reservationId')
  findByReservationId(
    @Param('reservationId') reservationId: string,
  ): Promise<ReservationMember[]> {
    return this.reservationMembersService.findByReservationId(reservationId);
  }

  @UseGuards(AuthGuard)
  @Get('/order-member/:orderMemberId')
  findByOrderMemberId(
    @Param('orderMemberId') orderMemberId: string,
  ): Promise<ReservationMember[]> {
    return this.reservationMembersService.findByOrderMemberId(orderMemberId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<ReservationMember>,
  ): Promise<ReservationMember> {
    return this.reservationMembersService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reservationMembersService.remove(id);
  }
}
