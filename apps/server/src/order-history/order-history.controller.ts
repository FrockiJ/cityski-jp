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
import { OrderHistoryService } from './order-history.service';
import { OrderHistory } from './entities/order-history.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/order-history')
export class OrderHistoryController {
  constructor(private orderHistoryService: OrderHistoryService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  create(@Body() body: Partial<OrderHistory>): Promise<OrderHistory> {
    return this.orderHistoryService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(): Promise<OrderHistory[]> {
    return this.orderHistoryService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<OrderHistory> {
    return this.orderHistoryService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get('/order/:orderId')
  findByOrderId(@Param('orderId') orderId: string): Promise<OrderHistory[]> {
    return this.orderHistoryService.findByOrderId(orderId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<OrderHistory>,
  ): Promise<OrderHistory> {
    return this.orderHistoryService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderHistoryService.remove(id);
  }
}