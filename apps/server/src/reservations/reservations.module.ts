import { forwardRef, Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';
import { Department } from 'src/departments/entities/department.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Department,
      OrderReservation,
      User,
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}