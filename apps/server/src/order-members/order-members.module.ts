import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderMembersController } from './order-members.controller';
import { OrderMembersService } from './order-members.service';
import { OrderMember } from './entities/order-member.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Member } from 'src/members/entities/member.entity';
import { User } from 'src/users/entities/user.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { MembersModule } from 'src/members/members.module';
import { OrderHistoryModule } from 'src/order-history/order-history.module';
import { OrderReservationsModule } from 'src/order-reservations/order-reservations.module';
import { ReservationMembersModule } from 'src/reservation-members/reservation-members.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderMember, Order, Member, User]),
    forwardRef(() => OrdersModule),
    forwardRef(() => MembersModule),
    forwardRef(() => OrderHistoryModule),
    forwardRef(() => OrderReservationsModule),
    forwardRef(() => ReservationMembersModule),
    JwtModule,
  ],
  controllers: [OrderMembersController],
  providers: [OrderMembersService],
  exports: [OrderMembersService],
})
export class OrderMembersModule {}
