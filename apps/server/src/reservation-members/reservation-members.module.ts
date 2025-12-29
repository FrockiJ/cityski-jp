import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationMembersController } from './reservation-members.controller';
import { ReservationMembersService } from './reservation-members.service';
import { ReservationMember } from './entities/reservation-member.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { OrderMembersModule } from 'src/order-members/order-members.module';
import { MembersModule } from 'src/members/members.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Member } from 'src/members/entities/member.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReservationMember,
      Reservation,
      OrderMember,
      OrderReservation,
      Order,
      User,
      Member,
    ]),
    forwardRef(() => ReservationsModule),
    forwardRef(() => OrderMembersModule),
    forwardRef(() => MembersModule),
    forwardRef(() => OrdersModule),
    JwtModule,
  ],
  controllers: [ReservationMembersController],
  providers: [ReservationMembersService],
  exports: [ReservationMembersService],
})
export class ReservationMembersModule {}
