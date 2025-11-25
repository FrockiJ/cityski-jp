import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayDepositRequestDTO, TransactionStatus, DiscountType } from '@repo/shared';
import { Order } from 'src/orders/entities/order.entity';
import { Transaction } from './entities/transaction.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { CustomException } from 'src/common/exception/custom.exception';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Discount)
    private readonly discountsRepo: Repository<Discount>,
  ) {}

  async createTransaction(order: Order) {
    try {
      // 計算原價：單價 × 購買堂數
      const originalPrice = order.coursePlan.price * order.planNumber;

      // 計算折扣金額
      let discountFee = 0;
      if (order.discountId) {
        const discount = await this.discountsRepo.findOne({
          where: { id: order.discountId },
        });

        if (discount) {
          if (discount.type === DiscountType.AMOUNT) {
            // 固定金額折扣
            discountFee = discount.discount;
          } else if (discount.type === DiscountType.PERCENT) {
            // 百分比折扣 (discount範圍: 0-10，表示0%-100%)
            discountFee = Math.round(originalPrice * (discount.discount / 10));
          }
        }
      }

      // 計算總金額（扣除折扣後）
      const totalAmt = originalPrice - discountFee;

      // 計算訂金（總金額的 50%）
      const depositAmt = Math.round(totalAmt * 0.5);

      // 計算尾款
      const balanceAmt = totalAmt - depositAmt;

      const savedTransaction = this.transactionsRepo.create({
        ...new Transaction(),
        totalAmt,
        discountFee,
        depositAmt,
        balanceAmt,
        status: TransactionStatus.PENDING_DEPOSIT,
        order: order,
      });

      console.log('savedTransaction with calculated amounts:', {
        originalPrice,
        discountFee,
        totalAmt,
        depositAmt,
        balanceAmt,
      });

      await this.transactionsRepo.save(savedTransaction);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // pay deposit for an order (DEV ONLY)
  async payDeposit(body: PayDepositRequestDTO, memberId: string) {
    try {
      const { orderId } = body;

      // Find order with transaction
      const order = await this.ordersRepo.findOne({
        where: { id: orderId },
        relations: ['transaction'],
      });

      if (!order) {
        throw new CustomException('Order not found', HttpStatus.NOT_FOUND);
      }

      if (!order.transaction) {
        throw new CustomException('Transaction not found', HttpStatus.NOT_FOUND);
      }

      const transaction = order.transaction;

      // Validate current status
      if (transaction.status !== TransactionStatus.PENDING_DEPOSIT) {
        throw new CustomException(
          'Deposit has already been paid',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Update transaction status to PENDING_FULL_PAYMENT
      transaction.status = TransactionStatus.PENDING_FULL_PAYMENT;
      transaction.depositDate = new Date();

      await this.transactionsRepo.save(transaction);

      // Update order status to WAITING_FOR_CONFIRMATION
      order.status = 1; // WAITING_FOR_CONFIRMATION
      await this.ordersRepo.save(order);

      return {
        success: true,
        message: 'Deposit paid successfully',
        data: {
          transactionId: transaction.id,
          status: transaction.status,
          depositDate: transaction.depositDate,
        },
      };
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async settleTransaction(orderId: string, balanceDate: Date, paymentMethod: string, invoice?: string) {
    try {
      const order = await this.ordersRepo.findOne({
        where: { id: orderId },
        relations: ['transaction'],
      });

      if (!order) {
        throw new CustomException('Order not found', HttpStatus.NOT_FOUND);
      }

      if (!order.transaction) {
        throw new CustomException('Transaction not found', HttpStatus.NOT_FOUND);
      }

      const transaction = order.transaction;

      transaction.status = TransactionStatus.FULLY_PAID;
      transaction.balanceDate = balanceDate;
      transaction.balancePaymentMethod = paymentMethod;
      if (invoice) {
        transaction.balanceInvoice = invoice;
      }

      await this.transactionsRepo.save(transaction);

      return {
        success: true,
        message: 'Transaction settled successfully',
        data: transaction,
      };
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
