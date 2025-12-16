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
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Controller('payments')
export class EcpayController {
  private readonly logger = new Logger(EcpayController.name);

  constructor(
    private ecpayService: EcpayService,
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionsRepo: Repository<Transaction>,
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

      // 驗證交易是否存在
      if (!order.transaction) {
        throw new BadRequestException(`Transaction not found for order ${request.orderId}`);
      }

      const transaction = order.transaction;

      // 根據交易狀態判斷應該支付的金額類型
      let expectedAmount: number;
      let paymentType: string;

      if (transaction.status === 0) {
        // TransactionStatus.PENDING_DEPOSIT: 應支付訂金
        expectedAmount = transaction.depositAmt;
        paymentType = '訂金';
      } else if (transaction.status === 2) {
        // TransactionStatus.PENDING_FULL_PAYMENT: 應支付尾款
        expectedAmount = transaction.balanceAmt;
        paymentType = '尾款';
      } else {
        // 其他狀態不允許支付
        this.logger.error(
          `Order ${request.orderId} is not in a payable state. Current status: ${transaction.status}`,
        );
        throw new BadRequestException(
          `Order is not in a payable state. Current transaction status: ${transaction.status}`,
        );
      }

      // 記錄支付開始時間
      order.transaction.paymentInitiatedAt = new Date();
      await this.transactionsRepo.save(order.transaction);
      this.logger.log(`Payment initiated at ${order.transaction.paymentInitiatedAt} for order ${request.orderId}`);

      // 驗證金額是否正確
      if (request.amount !== expectedAmount) {
        this.logger.error(
          `Amount mismatch for ${paymentType}: expected ${expectedAmount}, received ${request.amount}`,
        );
        throw new BadRequestException(
          `Invalid payment amount for ${paymentType}. Expected ${expectedAmount}, but received ${request.amount}`,
        );
      }

      this.logger.log(
        `Payment validation passed: ${paymentType} amount ${expectedAmount} for order ${request.orderId}`,
      );

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