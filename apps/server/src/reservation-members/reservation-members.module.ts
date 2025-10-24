import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationMembersController } from './reservation-members.controller';
import { ReservationMembersService } from './reservation-members.service';
import { ReservationMember } from './entities/reservation-member.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { OrderMembersModule } from 'src/order-members/order-members.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationMember, Reservation, OrderMember, User]),
    forwardRef(() => ReservationsModule),
    forwardRef(() => OrderMembersModule),
    JwtModule,
  ],
  controllers: [ReservationMembersController],
  providers: [ReservationMembersService],
  exports: [ReservationMembersService],
})
export class ReservationMembersModule {}
