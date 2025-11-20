import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationMember } from './entities/reservation-member.entity';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';

@Injectable()
export class ReservationMembersService {
  constructor(
    @InjectRepository(ReservationMember)
    private readonly reservationMembersRepo: Repository<ReservationMember>,
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
  ) {}

  async create(
    reservationMemberData: Partial<ReservationMember>,
  ): Promise<ReservationMember> {
    try {
      const reservationMember =
        this.reservationMembersRepo.create(reservationMemberData);
      return await this.reservationMembersRepo.save(reservationMember);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<ReservationMember[]> {
    try {
      return await this.reservationMembersRepo.find({
        relations: ['reservation', 'orderMember', 'orderMember.member', 'orderMember.order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<ReservationMember> {
    try {
      const reservationMember = await this.reservationMembersRepo.findOne({
        where: { id },
        relations: ['reservation', 'orderMember', 'orderMember.member', 'orderMember.order'],
      });

      if (!reservationMember) {
        throw new HttpException(
          `ReservationMember with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return reservationMember;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByReservationId(reservationId: string): Promise<ReservationMember[]> {
    try {
      return await this.reservationMembersRepo.find({
        where: { reservationId },
        relations: ['orderMember', 'orderMember.member', 'orderMember.order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByOrderMemberId(orderMemberId: string): Promise<ReservationMember[]> {
    try {
      return await this.reservationMembersRepo.find({
        where: { orderMemberId },
        relations: ['reservation', 'orderMember', 'orderMember.member', 'orderMember.order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateData: Partial<ReservationMember>,
  ): Promise<ReservationMember> {
    try {
      const reservationMember = await this.findOne(id);

      // Check if note or attended is being updated
      const isNoteOrAttendedUpdate =
        updateData.note !== undefined ||
        updateData.attended !== undefined;

      Object.assign(reservationMember, updateData);
      const savedMember = await this.reservationMembersRepo.save(reservationMember);

      // If note or attendance updated, check if reservation should auto-complete
      if (isNoteOrAttendedUpdate && reservationMember.reservation) {
        const reservation = await this.reservationsRepo.findOne({
          where: { id: reservationMember.reservationId },
        });

        // Only auto-update if status is PENDING_REVIEW (2)
        if (reservation && reservation.reservationStatus === ReservationStatus.PENDING_REVIEW) {
          // Update to COMPLETED (3)
          reservation.reservationStatus = ReservationStatus.COMPLETED;
          await this.reservationsRepo.save(reservation);
        }
      }

      return savedMember;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const reservationMember = await this.findOne(id);
      await this.reservationMembersRepo.remove(reservationMember);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
