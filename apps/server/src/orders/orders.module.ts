import { forwardRef, Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { User } from 'src/users/entities/user.entity';
import { Member } from 'src/members/entities/member.entity';
import { MembersModule } from 'src/members/members.module';
import { Department } from 'src/departments/entities/department.entity';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionsModule } from 'src/transaction/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      Member,
      Department,
      CoursePlan,
      Transaction,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => MembersModule),
    forwardRef(() => TransactionsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
