import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { OrderMember } from './entities/order-member.entity';
import { OrderMemberSearchResponseDto, TransferOrderMemberRequestDto } from '@repo/shared';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class OrderMembersService {
  constructor(
    @InjectRepository(OrderMember)
    private readonly orderMembersRepo: Repository<OrderMember>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => OrderHistoryService))
    private readonly orderHistoryService: OrderHistoryService,
    @Inject(forwardRef(() => MembersService))
    private readonly membersService: MembersService,
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
        where: { active: true },
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
        where: { orderId, active: true },
        relations: ['member'],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByMemberId(memberId: string): Promise<OrderMember[]> {
    try {
      return await this.orderMembersRepo.find({
        where: { memberId, active: true },
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

  async transfer(transferData: TransferOrderMemberRequestDto): Promise<OrderMember> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find and validate source orderMember (fromId)
      const sourceOrderMember = await this.orderMembersRepo.findOne({
        where: { id: transferData.fromId },
        relations: ['order'],
      });

      if (!sourceOrderMember) {
        throw new HttpException(
          `OrderMember with id: ${transferData.fromId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!sourceOrderMember.active) {
        throw new HttpException(
          `OrderMember with id: ${transferData.fromId} is already inactive`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Validate target member exists (toId)
      const targetMember = await this.membersService.findMemberById(transferData.toId);
      if (!targetMember) {
        throw new HttpException(
          `Member with id: ${transferData.toId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Validate not transferring to the same member
      if (sourceOrderMember.memberId === transferData.toId) {
        throw new HttpException(
          'Cannot transfer to the same member',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 3. Set source orderMember active to false
      sourceOrderMember.active = false;
      await queryRunner.manager.save(sourceOrderMember);

      // 4. Create new orderMember with same orderId but new memberId
      const newOrderMember = this.orderMembersRepo.create({
        orderId: sourceOrderMember.orderId,
        memberId: transferData.toId,
        active: true,
      });
      const savedOrderMember = await queryRunner.manager.save(newOrderMember);

      // 5. Record in order history
      await this.orderHistoryService.create({
        orderId: sourceOrderMember.orderId,
        event: '會員轉移',
        operator: 'system',
      });

      await queryRunner.commitTransaction();

      // Return the new orderMember with relations
      return await this.findOne(savedOrderMember.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async searchWithCoursesLeft(keyword: string): Promise<OrderMemberSearchResponseDto[]> {
    try {
      const where = keyword && keyword.trim()
        ? [
            { active: true, member: { name: ILike(`%${keyword}%`) } },
            { active: true, member: { phone: ILike(`%${keyword}%`) } },
            { active: true, member: { email: ILike(`%${keyword}%`) } },
          ]
        : { active: true };



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
