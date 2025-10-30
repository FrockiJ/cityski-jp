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
import { OrderMembersModule } from 'src/order-members/order-members.module';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      Member,
      Department,
      CoursePlan,
      Transaction,
      Reservation,
      OrderMember,
      ReservationMember,
      OrderReservation,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => MembersModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => OrderMembersModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
