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
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrdersService } from './orders.service';
import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  GetOrderDetailResponseDTO,
  GetOrdersRequestDTO,
  GetOrdersResponseDTO,
  OrderReservationResponseDto,
  ResWithPaginationDTO,
} from '@repo/shared';
import { ClientAuthGuard } from 'src/guards/client-auth.guard';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { AdminOrMemberGuard } from 'src/guards/admin-or-member.guard';

@Controller('/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getOrders(
    @Query() request: GetOrdersRequestDTO,
    @Req() req: CustomRequest,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    const user = req['user'];
    console.log('Authenticated user:', user);
    const result = await this.ordersService.getOrders(request);
    return {
      ...result,
      data: plainToInstance(GetOrdersResponseDTO, result.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @UseGuards(ClientAuthGuard)
  @Get('/my-orders')
  async getMyOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() request: CustomRequest,
  ): Promise<ResWithPaginationDTO<GetOrdersResponseDTO[]>> {
    console.log(request);
    const memberId = request['user'].sub;
    const result = await this.ordersService.getOrdersByMemberId(memberId, page, limit);
    return {
      ...result,
      data: plainToInstance(GetOrdersResponseDTO, result.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @UseGuards(AdminOrMemberGuard)
  @Get('/:id')
  async getOrderDetail(
    @Param('id') id: string,
    @Req() request: CustomRequest,
  ): Promise<GetOrderDetailResponseDTO> {
    console.log(request['roles']);
    const result = await this.ordersService.getOrderDetail(id);
    return plainToInstance(GetOrderDetailResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AdminOrMemberGuard)
  @Get('/:id/reservations')
  async getOrderReservations(
    @Param('id') id: string,
  ): Promise<OrderReservationResponseDto[]> {
    const result = await this.ordersService.getOrderReservations(id);
    
    return plainToInstance(OrderReservationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createOrder(
    @Body() body: CreateOrderRequestDTO,
    @Req() request: CustomRequest,
  ): Promise<CreateOrderResponseDTO> {
    const memberId = request['user'].sub;
    const result = await this.ordersService.createOrder(body, memberId);
    return plainToInstance(CreateOrderResponseDTO, result, {
      excludeExtraneousValues: true,
    });
  }
}
