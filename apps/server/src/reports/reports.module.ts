import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, OrderReservation, User, Department]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}