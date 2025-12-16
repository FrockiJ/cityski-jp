import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  Response,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EcpayService } from './ecpay.service';
import { CreditCardPaymentInitializeRequest } from './interfaces/payment.interface';
import { Order } from 'src/orders/entities/order.entity';

@Controller('payments')
export class EcpayController {
  private readonly logger = new Logger(EcpayController.name);

  constructor(
    private ecpayService: EcpayService,
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
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

      // 驗證訂單與金額
      const order = await this.ordersRepo.findOne({
        where: { no: request.orderId },
        relations: ['transaction'],
      });

      if (!order) {
        throw new BadRequestException(`Order ${request.orderId} not found`);
      }

      // 驗證金額是否等於訂金
      if (!order.transaction) {
        throw new BadRequestException(`Transaction not found for order ${request.orderId}`);
      }

      if (request.amount !== order.transaction.depositAmt) {
        this.logger.error(
          `Amount mismatch: expected ${order.transaction.depositAmt}, received ${request.amount}`,
        );
        throw new BadRequestException(
          `Invalid payment amount. Expected ${order.transaction.depositAmt}, but received ${request.amount}`,
        );
      }

      // 初始化支付
      const result = await this.ecpayService.initializeCreditCardPayment(request);

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
   * 信用卡支付回調 (ReturnURL)
   * POST /api/payments/credit-card/callback
   *
   * 注意：此端點由 ECPay 伺服器調用，用於通知支付結果
   * ECPay 期望收到 text/plain 格式的 "1|OK" 回應
   */
  @Post('credit-card/callback')
  async handleCreditCardCallback(
    @Body() notification: any,
    @Response() response: any,
  ) {
    try {
      // 處理回調
      const result = await this.ecpayService.handlePaymentCallback(notification);

      this.logger.log(
        `Payment callback processed: ${result.success ? 'success' : 'failed'}`,
      );

      // TODO: 前端開發人員需要在 TransactionsService 中新增方法來更新交易狀態
      // 根據 result.success 和支付結果更新交易狀態
      // await this.transactionsService.updatePaymentStatus(...)

      // 回應 1|OK 給 ECPay（ECPay 期望收到 text/plain）
      response.type('text/plain').send('1|OK');
    } catch (error) {
      this.logger.error(
        `Failed to process payment callback: ${error.message}`,
        error,
      );
      // 即使失敗也要回應 1|OK，避免 ECPay 重複發送通知
      response.type('text/plain').send('1|OK');
    }
  }
}