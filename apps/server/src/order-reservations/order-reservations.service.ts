import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderReservation } from './entities/order-reservation.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { CustomException } from 'src/common/exception/custom.exception';

@Injectable()
export class OrderReservationsService {
  constructor(
    @InjectRepository(OrderReservation)
    private readonly orderReservationsRepo: Repository<OrderReservation>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
  ) {}

  // 建立 order-reservation
  async create(data: {
    orderId: string;
    reservationId?: string;
    index: number;
  }): Promise<OrderReservation> {
    try {
      // 驗證 order 是否存在
      const order = await this.ordersRepo.findOne({
        where: { id: data.orderId },
      });
      if (!order) {
        throw new CustomException(
          `Order with id: ${data.orderId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // 如果有 reservationId，驗證 reservation 是否存在
      if (data.reservationId) {
        const reservation = await this.reservationsRepo.findOne({
          where: { id: data.reservationId },
        });
        if (!reservation) {
          throw new CustomException(
            `Reservation with id: ${data.reservationId} not found`,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      const orderReservation = this.orderReservationsRepo.create({
        orderId: data.orderId,
        reservationId: data.reservationId,
        index: data.index,
      });

      return await this.orderReservationsRepo.save(orderReservation);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 根據 orderId 查詢所有 order-reservations
  async findByOrderId(orderId: string): Promise<OrderReservation[]> {
    try {
      return await this.orderReservationsRepo.find({
        where: { orderId },
        relations: ['order', 'reservation'],
        order: { index: 'ASC' },
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 根據 reservationId 查詢所有 order-reservations
  async findByReservationId(reservationId: string): Promise<OrderReservation[]> {
    try {
      return await this.orderReservationsRepo.find({
        where: { reservationId },
        relations: ['order', 'reservation'],
        order: { index: 'ASC' },
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 根據 id 查詢單一 order-reservation
  async findOne(id: string): Promise<OrderReservation> {
    try {
      const orderReservation = await this.orderReservationsRepo.findOne({
        where: { id },
        relations: ['order', 'reservation'],
      });

      if (!orderReservation) {
        throw new CustomException(
          `OrderReservation with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return orderReservation;
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 更新 order-reservation
  async update(
    id: string,
    data: {
      reservationId?: string;
      index?: number;
    },
  ): Promise<OrderReservation> {
    try {
      const orderReservation = await this.findOne(id);

      if (data.reservationId !== undefined) {
        if (data.reservationId) {
          const reservation = await this.reservationsRepo.findOne({
            where: { id: data.reservationId },
          });
          if (!reservation) {
            throw new CustomException(
              `Reservation with id: ${data.reservationId} not found`,
              HttpStatus.NOT_FOUND,
            );
          }
        }
        orderReservation.reservationId = data.reservationId;
      }

      if (data.index !== undefined) {
        orderReservation.index = data.index;
      }

      return await this.orderReservationsRepo.save(orderReservation);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 刪除 order-reservation
  async delete(id: string): Promise<void> {
    try {
      const orderReservation = await this.findOne(id);
      await this.orderReservationsRepo.remove(orderReservation);
    } catch (err) {
      if (err instanceof CustomException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
