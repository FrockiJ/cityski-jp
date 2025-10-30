import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderReservationsController } from './order-reservations.controller';
import { OrderReservationsService } from './order-reservations.service';
import { OrderReservation } from './entities/order-reservation.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderReservation,
      Order,
      Reservation,
      User,
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [OrderReservationsController],
  providers: [OrderReservationsService],
  exports: [OrderReservationsService],
})
export class OrderReservationsModule {}
