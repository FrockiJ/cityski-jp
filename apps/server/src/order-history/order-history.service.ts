import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderHistory } from './entities/order-history.entity';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistory)
    private orderHistoryRepo: Repository<OrderHistory>,
  ) {}

  async create(data: Partial<OrderHistory>): Promise<OrderHistory> {
    const orderHistory = this.orderHistoryRepo.create(data);
    return await this.orderHistoryRepo.save(orderHistory);
  }

  async findAll(): Promise<OrderHistory[]> {
    return await this.orderHistoryRepo.find({
      relations: ['order'],
      order: { time: 'DESC' },
    });
  }

  async findOne(id: string): Promise<OrderHistory> {
    return await this.orderHistoryRepo.findOne({
      where: { id },
      relations: ['order'],
    });
  }

  async findByOrderId(orderId: string): Promise<OrderHistory[]> {
    return await this.orderHistoryRepo.find({
      where: { orderId },
      relations: ['order'],
      order: { time: 'DESC' },
    });
  }

  async update(id: string, data: Partial<OrderHistory>): Promise<OrderHistory> {
    await this.orderHistoryRepo.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.orderHistoryRepo.delete(id);
  }
}