import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayDepositRequestDTO, TransactionStatus } from '@repo/shared';
import { Order } from 'src/orders/entities/order.entity';
import { Transaction } from './entities/transaction.entity';
import { CustomException } from 'src/common/exception/custom.exception';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
  ) {}

  async createTransaction(order: Order) {
    try {
      const savedTransaction = this.transactionsRepo.create({
        ...new Transaction(),

        // todo: 其他需要的欄位還沒加入

        status: TransactionStatus.PENDING_DEPOSIT,
        // 設定cascade可一起儲存關聯資料
        order: order,
      });
      console.log('savedTransaction', savedTransaction);

      this.transactionsRepo.save(savedTransaction);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // get order list of all
  async payDeposit(body: PayDepositRequestDTO, memberId: string) {
    try {
      console.log('body', body, memberId);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }
}
