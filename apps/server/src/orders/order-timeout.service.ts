import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, IsNull } from 'typeorm';
import { Order } from './entities/order.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { OrderStatus } from '@repo/shared';

@Injectable()
export class OrderTimeoutService {
  private readonly logger = new Logger(OrderTimeoutService.name);
  private readonly PAYMENT_TIMEOUT_MINUTES = 15;

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  /**
   * 每分鐘檢查一次是否有訂單支付超時
   * 如果訂單在 15 分鐘內沒有收到 ECPay 的回應，則自動取消訂單
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkPaymentTimeout() {
    this.logger.log('Checking for payment timeout orders...');

    try {
      // 計算 15 分鐘前的時間
      const timeoutThreshold = new Date(
        Date.now() - this.PAYMENT_TIMEOUT_MINUTES * 60 * 1000,
      );

      // 查找符合以下條件的訂單：
      // 1. 訂單狀態為 PENDING_DEPOSIT (0)
      // 2. paymentInitiatedAt 不為空（表示已經開始支付流程）
      // 3. paymentInitiatedAt 早於 15 分鐘前
      // 4. depositDate 為空（表示還沒有完成支付）
      const timedOutOrders = await this.ordersRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.transaction', 'transaction')
        .where('order.status = :status', {
          status: OrderStatus.PENDING_DEPOSIT,
        })
        .andWhere('transaction.paymentInitiatedAt IS NOT NULL')
        .andWhere('transaction.paymentInitiatedAt < :threshold', {
          threshold: timeoutThreshold,
        })
        .andWhere('transaction.depositDate IS NULL')
        .getMany();

      if (timedOutOrders.length === 0) {
        this.logger.log('No timed out orders found');
        return;
      }

      this.logger.log(
        `Found ${timedOutOrders.length} timed out orders, proceeding to cancel...`,
      );

      // 取消所有超時的訂單
      for (const order of timedOutOrders) {
        await this.cancelTimedOutOrder(order);
      }

      this.logger.log(
        `Successfully cancelled ${timedOutOrders.length} timed out orders`,
      );

      // 檢查尾款支付 timeout
      const balanceTimedOutOrders = await this.ordersRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.transaction', 'transaction')
        .where('order.status = :orderStatus', {
          orderStatus: OrderStatus.ORDER_SUCCESSFUL,
        })
        .andWhere('transaction.status = :txStatus', {
          txStatus: 2, // TransactionStatus.PENDING_FULL_PAYMENT
        })
        .andWhere('transaction.balancePaymentInitiatedAt IS NOT NULL')
        .andWhere('transaction.balancePaymentInitiatedAt < :threshold', {
          threshold: timeoutThreshold,
        })
        .andWhere('transaction.balanceDate IS NULL')
        .getMany();

      if (balanceTimedOutOrders.length > 0) {
        this.logger.log(
          `Found ${balanceTimedOutOrders.length} balance payment timed out orders, marking as failed...`,
        );

        // 處理尾款 timeout
        for (const order of balanceTimedOutOrders) {
          await this.markBalancePaymentFailed(order);
        }

        this.logger.log(
          `Successfully marked ${balanceTimedOutOrders.length} balance payments as failed`,
        );
      } else {
        this.logger.log('No balance payment timed out orders found');
      }
    } catch (error) {
      this.logger.error(
        `Error checking payment timeout: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * 取消超時的訂單
   */
  private async cancelTimedOutOrder(order: Order): Promise<void> {
    try {
      const transaction = order.transaction;

      if (!transaction) {
        this.logger.warn(`Order ${order.no} has no transaction, skipping`);
        return;
      }

      // 計算超時時間（分鐘）
      const timeoutMinutes = Math.floor(
        (Date.now() - transaction.paymentInitiatedAt.getTime()) / 60000,
      );

      this.logger.log(
        `Cancelling order ${order.no} (timeout: ${timeoutMinutes} minutes)`,
      );

      // 更新訂單狀態為已取消
      order.status = OrderStatus.ORDER_CANCELED;
      order.cancelDate = new Date();

      // 記錄超時原因
      transaction.lastPaymentAttemptDate = new Date();
      transaction.lastPaymentAttemptResult = `Timeout_${timeoutMinutes}min`;

      // 保存更新
      await this.ordersRepo.save(order);
      await this.transactionsRepo.save(transaction);

      this.logger.log(
        `Order ${order.no} cancelled successfully due to payment timeout`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to cancel order ${order.no}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * 標記尾款支付失敗（不取消訂單，允許重新嘗試）
   */
  private async markBalancePaymentFailed(order: Order): Promise<void> {
    try {
      const transaction = order.transaction;

      if (!transaction) {
        this.logger.warn(`Order ${order.no} has no transaction, skipping`);
        return;
      }

      // 計算超時時間（分鐘）
      const timeoutMinutes = Math.floor(
        (Date.now() - transaction.balancePaymentInitiatedAt.getTime()) / 60000,
      );

      this.logger.log(
        `Marking balance payment failed for order ${order.no} (timeout: ${timeoutMinutes} minutes)`,
      );

      // 記錄失敗原因，但不改變訂單狀態
      transaction.lastPaymentAttemptDate = new Date();
      transaction.lastPaymentAttemptResult = `Balance_Timeout_${timeoutMinutes}min`;

      // 清除 balancePaymentInitiatedAt 以允許重新嘗試
      transaction.balancePaymentInitiatedAt = null;

      // 保存更新
      await this.transactionsRepo.save(transaction);

      this.logger.log(
        `Balance payment marked as failed for order ${order.no}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to mark balance payment failed for order ${order.no}: ${error.message}`,
        error.stack,
      );
    }
  }
}
