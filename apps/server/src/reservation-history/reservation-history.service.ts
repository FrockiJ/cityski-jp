import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationHistory } from './entities/reservation-history.entity';

@Injectable()
export class ReservationHistoryService {
  constructor(
    @InjectRepository(ReservationHistory)
    private reservationHistoryRepo: Repository<ReservationHistory>,
  ) {}

  async create(data: Partial<ReservationHistory>): Promise<ReservationHistory> {
    const reservationHistory = this.reservationHistoryRepo.create(data);
    return await this.reservationHistoryRepo.save(reservationHistory);
  }

  async findAll(): Promise<ReservationHistory[]> {
    return await this.reservationHistoryRepo.find({
      relations: ['reservation'],
      order: { time: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ReservationHistory> {
    return await this.reservationHistoryRepo.findOne({
      where: { id },
      relations: ['reservation'],
    });
  }

  async findByReservationId(reservationId: string): Promise<ReservationHistory[]> {
    return await this.reservationHistoryRepo.find({
      where: { reservationId },
      relations: ['reservation'],
      order: { time: 'DESC' },
    });
  }

  async update(id: string, data: Partial<ReservationHistory>): Promise<ReservationHistory> {
    await this.reservationHistoryRepo.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.reservationHistoryRepo.delete(id);
  }
}