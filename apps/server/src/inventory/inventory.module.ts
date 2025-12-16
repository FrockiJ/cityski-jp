import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Order } from 'src/orders/entities/order.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderReservation, Reservation])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
