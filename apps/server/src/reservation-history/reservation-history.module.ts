import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationHistoryController } from './reservation-history.controller';
import { ReservationHistoryService } from './reservation-history.service';
import { ReservationHistory } from './entities/reservation-history.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationHistory, Reservation, User]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ReservationHistoryController],
  providers: [ReservationHistoryService],
  exports: [ReservationHistoryService],
})
export class ReservationHistoryModule {}