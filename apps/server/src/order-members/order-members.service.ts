import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { OrderMember } from './entities/order-member.entity';
import { OrderMemberSearchResponseDto } from '@repo/shared';

@Injectable()
export class OrderMembersService {
  constructor(
    @InjectRepository(OrderMember)
    private readonly orderMembersRepo: Repository<OrderMember>,
  ) {}

  async create(orderMemberData: Partial<OrderMember>): Promise<OrderMember> {
    try {
      const orderMember = this.orderMembersRepo.create(orderMemberData);
      return await this.orderMembersRepo.save(orderMember);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<OrderMember[]> {
    try {
      return await this.orderMembersRepo.find({
        relations: ['order', 'member'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<OrderMember> {
    try {
      const orderMember = await this.orderMembersRepo.findOne({
        where: { id },
        relations: ['order', 'member'],
      });

      if (!orderMember) {
        throw new HttpException(
          `OrderMember with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return orderMember;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByOrderId(orderId: string): Promise<OrderMember[]> {
    try {
      return await this.orderMembersRepo.find({
        where: { orderId },
        relations: ['member'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByMemberId(memberId: string): Promise<OrderMember[]> {
    try {
      return await this.orderMembersRepo.find({
        where: { memberId },
        relations: ['order'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateData: Partial<OrderMember>,
  ): Promise<OrderMember> {
    try {
      const orderMember = await this.findOne(id);
      Object.assign(orderMember, updateData);
      return await this.orderMembersRepo.save(orderMember);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const orderMember = await this.findOne(id);
      await this.orderMembersRepo.remove(orderMember);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchWithCoursesLeft(keyword: string): Promise<OrderMemberSearchResponseDto[]> {
    try {
      const where = keyword && keyword.trim()
        ? [
            { member: { name: ILike(`%${keyword}%`) } },
            { member: { phone: ILike(`%${keyword}%`) } },
            { member: { email: ILike(`%${keyword}%`) } },
          ]
        : {};



      return await this.orderMembersRepo.find({
        where,
        relations: {
          member: true,
          order: {
            orderReservations: true,
          },
        },
        order: {
          member: {
            name: 'ASC',
          },
        },
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
