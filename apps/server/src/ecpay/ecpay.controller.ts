import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EcpayService } from './ecpay.service';
import { CreditCardPaymentInitializeRequest } from './interfaces/payment.interface';
import { OrdersService } from 'src/orders/orders.service';

@Controller('api/payments')
export class EcpayController {
  private readonly logger = new Logger(EcpayController.name);

  constructor(
    private ecpayService: EcpayService,
    private ordersService: OrdersService,
  ) {}

  /**
   * 信用卡支付初始化
   * POST /api/payments/credit-card/initialize
   */
  @Post('credit-card/initialize')
  async initializeCreditCardPayment(
    @Body() request: CreditCardPaymentInitializeRequest,
  ) {
    try {
      this.logger.log(
        `Initializing credit card payment for orderId: ${request.orderId}`,
      );

      // 驗證訂單
      try {
        await this.ordersService.getOrderDetail(request.orderId);
      } catch {
        throw new BadRequestException('Order not found');
      }

      // 驗證金額
      if (request.amount <= 0) {
        throw new BadRequestException('Invalid amount');
      }

      // 初始化支付
      const result = await this.ecpayService.initializeCreditCardPayment(
        request,
      );

      if (!result.success) {
        throw new InternalServerErrorException(result.error);
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to initialize credit card payment: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  /**
   * 信用卡支付回調
   * POST /api/payments/credit-card/callback
   *
   * 注意：此端點由 ECPay 伺服器調用，用於通知支付結果
   * 前端開發人員需要在 TransactionsService 中新增方法來處理支付狀態更新
   */
  @Post('credit-card/callback')
  async handleCreditCardCallback(@Body() notification: any) {
    try {
      // 處理回調
      await this.ecpayService.handlePaymentCallback(notification);

      // TODO: 前端開發人員需要在此處呼叫 TransactionsService 的方法來更新交易狀態
      // await this.transactionsService.updatePaymentStatus(
      //   paymentResult.transactionId,
      //   paymentResult.status === 'success' ? 'FULLY_PAID' : 'PENDING_DEPOSIT',
      //   {
      //     ecpayTradeNo: paymentResult.ecpayTradeNo,
      //     paymentDate: paymentResult.paymentDate,
      //   },
      // );

      // 回應 1|OK 給 ECPay
      return '1|OK';
    } catch (error) {
      this.logger.error(
        `Failed to process payment callback: ${error.message}`,
        error,
      );
      // 即使失敗也要回應 1|OK，避免 ECPay 重複發送通知
      return '1|OK';
    }
  }
}
