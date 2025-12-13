import {
  Body,
  Controller,
  Get,
  Logger,
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
  private readonly logger = new Logger(OrdersController.name);

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

  /**
   * 查詢訂單支付狀態
   * GET /api/orders/:orderNo/payment-status
   */
  @Get(':orderNo/payment-status')
  async getPaymentStatus(@Param('orderNo') orderNo: string) {
    try {
      const order = await this.ordersService.getOrderByOrderNo(orderNo);

      if (!order) {
        return {
          success: false,
          error: 'Order not found',
        };
      }

      const depositPaid = order.transaction?.status >= 1;

      return {
        success: true,
        data: {
          orderNo: order.no,
          orderId: order.id,
          orderStatus: order.status,
          transactionStatus: order.transaction?.status,
          depositPaid,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get payment status: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
