import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrderReservationsService } from './order-reservations.service';
import { OrderReservation } from './entities/order-reservation.entity';

@Controller('/order-reservations')
export class OrderReservationsController {
  constructor(
    private orderReservationsService: OrderReservationsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/')
  create(
    @Body()
    body: {
      orderId: string;
      reservationId?: string;
      index: number;
    },
  ): Promise<OrderReservation> {
    return this.orderReservationsService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('/order/:orderId')
  findByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<OrderReservation[]> {
    return this.orderReservationsService.findByOrderId(orderId);
  }

  @UseGuards(AuthGuard)
  @Get('/reservation/:reservationId')
  findByReservationId(
    @Param('reservationId') reservationId: string,
  ): Promise<OrderReservation[]> {
    return this.orderReservationsService.findByReservationId(reservationId);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<OrderReservation> {
    return this.orderReservationsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      reservationId?: string;
      index?: number;
    },
  ): Promise<OrderReservation> {
    return this.orderReservationsService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.orderReservationsService.delete(id);
  }
}
