import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcpayService } from './ecpay.service';
import { EcpayController } from './ecpay.controller';
import { EcpayConfig } from './ecpay.config';
import { EcpayCryptoService } from './ecpay-crypto.service';
import { OrdersModule } from 'src/orders/orders.module';
import { TransactionsModule } from 'src/transaction/transactions.module';
import { Order } from 'src/orders/entities/order.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Transaction]),
    OrdersModule,
    TransactionsModule,
  ],
  providers: [EcpayService, EcpayConfig, EcpayCryptoService],
  controllers: [EcpayController],
  exports: [EcpayService, EcpayConfig, EcpayCryptoService],
})
export class EcpayModule {}
