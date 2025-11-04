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
import { OrderHistoryService } from './order-history.service';
import {
  OrderHistoryResponseDTO,
  CreateOrderHistoryRequestDTO,
  UpdateOrderHistoryRequestDTO,
} from '@repo/shared';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/order-history')
export class OrderHistoryController {
  constructor(private orderHistoryService: OrderHistoryService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() body: CreateOrderHistoryRequestDTO): Promise<OrderHistoryResponseDTO> {
    const result = await this.orderHistoryService.create(body);
    return plainToInstance(OrderHistoryResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll(): Promise<OrderHistoryResponseDTO[]> {
    const result = await this.orderHistoryService.findAll();
    return plainToInstance(OrderHistoryResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<OrderHistoryResponseDTO> {
    const result = await this.orderHistoryService.findOne(id);
    return plainToInstance(OrderHistoryResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string): Promise<OrderHistoryResponseDTO[]> {
    const result = await this.orderHistoryService.findByOrderId(orderId);
    return plainToInstance(OrderHistoryResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateOrderHistoryRequestDTO,
  ): Promise<OrderHistoryResponseDTO> {
    const result = await this.orderHistoryService.update(id, body);
    return plainToInstance(OrderHistoryResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderHistoryService.remove(id);
  }
}