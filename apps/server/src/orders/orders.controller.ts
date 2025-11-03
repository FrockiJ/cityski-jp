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
  ReservationResponseDto,
} from '@repo/shared';
import { ClientAuthGuard } from 'src/guards/client-auth.guard';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { AdminOrMemberGuard } from 'src/guards/admin-or-member.guard';

@Controller('/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getOrders(
    @Query() request: GetOrdersRequestDTO,
    @Req() req: CustomRequest,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    const user = req['user'];
    console.log('Authenticated user:', user);
    return this.ordersService.getOrders(request);
  }

  @UseGuards(ClientAuthGuard)
  @Get('/my-orders')
  getMyOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() request: CustomRequest,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    console.log(request);
    const memberId = request['user'].sub;
    return this.ordersService.getOrdersByMemberId(memberId, page, limit);
  }

  @UseGuards(AdminOrMemberGuard)
  @Get('/:id')
  getOrderDetail(
    @Param('id') id: string,
    @Req() request: CustomRequest,
  ): Promise<GetOrderDetailResponseDTO> {
    console.log(request['roles']);
    return this.ordersService.getOrderDetail(id);
  }

  @UseGuards(AdminOrMemberGuard)
  @Get('/:id/reservations')
  getOrderReservations(
    @Param('id') id: string,
  ): Promise<ReservationResponseDto[]> {
    return this.ordersService.getOrderReservations(id);
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
