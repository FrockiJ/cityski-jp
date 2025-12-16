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

    // 手動構建回應以確保 depositAmt 被包含
    const response = plainToInstance(CreateOrderResponseDTO, result, {
      excludeExtraneousValues: true,
    });

    // 明確設置 depositAmt
    response.depositAmt = result.depositAmt;

    return response;
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

      // 檢測支付失敗：
      // 1. 如果有記錄最後一次支付嘗試且結果為失敗（RtnCode_開頭表示失敗）
      // 2. 或者訂單建立超過 10 分鐘且仍在 PENDING_DEPOSIT 狀態
      const hasFailureRecord =
        order.transaction?.lastPaymentAttemptResult &&
        order.transaction.lastPaymentAttemptResult.startsWith('RtnCode_') &&
        order.transaction.lastPaymentAttemptResult !== 'RtnCode_1';

      const orderCreatedAt = new Date(order.createdTime);
      const now = new Date();
      const minutesSinceCreation = (now.getTime() - orderCreatedAt.getTime()) / (1000 * 60);
      const isTimeout =
        order.transaction?.status === 0 && // TransactionStatus.PENDING_DEPOSIT
        minutesSinceCreation > 10;

      const isPaymentFailed = hasFailureRecord || isTimeout;

      return {
        success: true,
        data: {
          orderNo: order.no,
          orderId: order.id,
          orderStatus: order.status,
          transactionStatus: order.transaction?.status,
          depositPaid,
          isPaymentFailed,
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
