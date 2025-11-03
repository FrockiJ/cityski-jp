import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistoryController } from './order-history.controller';
import { OrderHistoryService } from './order-history.service';
import { OrderHistory } from './entities/order-history.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderHistory, Order, User]),
    forwardRef(() => UsersModule),
  ],
  controllers: [OrderHistoryController],
  providers: [OrderHistoryService],
  exports: [OrderHistoryService],
})
export class OrderHistoryModule {}