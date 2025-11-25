import { forwardRef, Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';
import { Department } from 'src/departments/entities/department.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Member } from 'src/members/entities/member.entity';
import { ReservationHistoryModule } from 'src/reservation-history/reservation-history.module';
import { CoursePlanSession } from 'src/course-plan-session/entities/course-plan-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Department,
      OrderReservation,
      User,
      ReservationMember,
      OrderMember,
      Order,
      Member,
      CoursePlanSession,
    ]),
    forwardRef(() => UsersModule),
    ReservationHistoryModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
