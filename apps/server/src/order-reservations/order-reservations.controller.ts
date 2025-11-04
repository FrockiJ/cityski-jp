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
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateOrderReservationRequestDto,
  UpdateOrderReservationRequestDto,
  OrderReservationResponseDto,
} from '@repo/shared';
import { OrderReservationsService } from './order-reservations.service';

@Controller('/order-reservations')
export class OrderReservationsController {
  constructor(
    private orderReservationsService: OrderReservationsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(
    @Body() body: CreateOrderReservationRequestDto,
  ): Promise<OrderReservationResponseDto> {
    const result = await this.orderReservationsService.create(body);
    return plainToInstance(OrderReservationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/order/:orderId')
  async findByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<OrderReservationResponseDto[]> {
    const result = await this.orderReservationsService.findByOrderId(orderId);
    return plainToInstance(OrderReservationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/reservation/:reservationId')
  async findByReservationId(
    @Param('reservationId') reservationId: string,
  ): Promise<OrderReservationResponseDto[]> {
    const result = await this.orderReservationsService.findByReservationId(reservationId);
    return plainToInstance(OrderReservationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<OrderReservationResponseDto> {
    const result = await this.orderReservationsService.findOne(id);
    return plainToInstance(OrderReservationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateOrderReservationRequestDto,
  ): Promise<OrderReservationResponseDto> {
    const result = await this.orderReservationsService.update(id, body);
    return plainToInstance(OrderReservationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.orderReservationsService.delete(id);
  }
}
