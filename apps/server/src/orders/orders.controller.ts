import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrdersService } from './orders.service';
import {
  CreateOrderRequestDTO,
  GetOrderDetailResponseDTO,
  GetOrdersRequestDTO,
  GetOrdersResponseDTO,
  ResWithPaginationDTO,
} from '@repo/shared';
import { ClientAuthGuard } from 'src/guards/client-auth.guard';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

@Controller('/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard, ClientAuthGuard)
  @Get('/')
  getOrders(
    @Query() request: GetOrdersRequestDTO,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    return this.ordersService.getOrders(request);
  }

  @UseGuards(AuthGuard, ClientAuthGuard)
  @Get('/:id')
  getOrderDetail(
    @Param('id') id: string,
  ): Promise<GetOrderDetailResponseDTO> {
    return this.ordersService.getOrderDetail(id);
  }

  @UseGuards(AuthGuard, ClientAuthGuard)
  @Get('/:id/reservations')
  getOrderReservations(
    @Param('id') id: string,
  ): Promise<any[]> {
    return this.ordersService.getOrderReservations(id);
  }

  @UseGuards(ClientAuthGuard)
  @Get('/my-orders')
  getMyOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() request: CustomRequest,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    const memberId = request['user'].sub;
    return this.ordersService.getOrdersByMemberId(memberId, page, limit);
  }

  @UseGuards(ClientAuthGuard)
  @Post('/')
  createOrder(
    @Body() body: CreateOrderRequestDTO,
    @Req() request: CustomRequest,
  ) {
    const memberId = request['user'].sub;
    return this.ordersService.createOrder(body, memberId);
  }
}
