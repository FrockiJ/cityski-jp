import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import {
  OrderInvitation,
  OrderInvitationStatus,
  InviteeType,
} from './entities/order-invitation.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderMembersService } from 'src/order-members/order-members.service';
import {
  CreateOrderInvitationRequestDto,
  OrderInvitationResponseDto,
  ValidateInvitationResponseDto,
} from '@repo/shared';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderInvitationsService {
  constructor(
    @InjectRepository(OrderInvitation)
    private readonly orderInvitationsRepo: Repository<OrderInvitation>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @Inject(forwardRef(() => OrderMembersService))
    private readonly orderMembersService: OrderMembersService,
  ) {}

  /**
   * 建立邀請並生成 token
   */
  async create(
    createDto: CreateOrderInvitationRequestDto,
    inviterUserId: string,
  ): Promise<OrderInvitationResponseDto> {
    try {
      // 檢查訂單是否存在
      const order = await this.ordersRepo.findOne({
        where: { id: createDto.orderId },
        relations: ['coursePlan', 'coursePlan.course'],
      });

      if (!order) {
        throw new HttpException('訂單不存在', HttpStatus.NOT_FOUND);
      }

      // 驗證邀請人是否是訂單所有者
      if (order.orderer !== inviterUserId) {
        throw new HttpException('您不是此訂單的所有者', HttpStatus.FORBIDDEN);
      }

      // 生成唯一 token
      const inviteToken = uuidv4();

      // 設定過期時間（7 天後）
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // 建立邀請
      const invitation = this.orderInvitationsRepo.create({
        orderId: createDto.orderId,
        inviterUserId,
        inviteToken,
        inviteeType: createDto.inviteeType as InviteeType,
        status: OrderInvitationStatus.PENDING,
        expiresAt,
        createdUser: inviterUserId,
        updatedUser: inviterUserId,
      });

      const savedInvitation = await this.orderInvitationsRepo.save(invitation);

      // 生成邀請連結
      const baseUrl = process.env.CLIENT_DOMAIN || 'https://cityski.com.tw';
      const inviteLink = `${baseUrl}/login?invitation=${inviteToken}`;

      const response = plainToInstance(
        OrderInvitationResponseDto,
        savedInvitation,
        {
          excludeExtraneousValues: true,
        },
      );
      response.inviteLink = inviteLink;

      return response;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 驗證邀請 token
   */
  async validateToken(token: string): Promise<ValidateInvitationResponseDto> {
    try {
      const invitation = await this.orderInvitationsRepo.findOne({
        where: { inviteToken: token },
        relations: [
          'order',
          'order.coursePlan',
          'order.coursePlan.course',
          'inviter',
        ],
      });

      if (!invitation) {
        return {
          valid: false,
          message: '邀請連結無效',
        };
      }

      // 檢查是否已過期
      if (new Date() > invitation.expiresAt) {
        // 自動標記為過期
        await this.orderInvitationsRepo.update(
          { id: invitation.id },
          { status: OrderInvitationStatus.EXPIRED },
        );
        return {
          valid: false,
          message: '邀請連結已過期',
        };
      }

      // 檢查狀態
      if (invitation.status !== OrderInvitationStatus.PENDING) {
        const statusMessage = {
          [OrderInvitationStatus.REDEEMED]: '此邀請已被使用',
          [OrderInvitationStatus.EXPIRED]: '邀請連結已過期',
          [OrderInvitationStatus.CANCELLED]: '邀請已被取消',
        };
        return {
          valid: false,
          message: statusMessage[invitation.status] || '邀請連結無效',
        };
      }

      return plainToInstance(
        ValidateInvitationResponseDto,
        {
          valid: true,
          inviteeType: invitation.inviteeType,
          order: invitation.order,
          inviter: invitation.inviter,
          expiresAt: invitation.expiresAt,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 兌換邀請（註冊完成後呼叫）
   */
  async redeemInvitation(
    token: string,
    newMemberId: string,
  ): Promise<OrderInvitation> {
    try {
      const invitation = await this.orderInvitationsRepo.findOne({
        where: { inviteToken: token },
      });

      if (!invitation) {
        throw new HttpException('邀請連結無效', HttpStatus.NOT_FOUND);
      }

      // 驗證邀請狀態
      if (invitation.status !== OrderInvitationStatus.PENDING) {
        throw new HttpException(
          '此邀請已被使用或已失效',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (new Date() > invitation.expiresAt) {
        throw new HttpException('邀請連結已過期', HttpStatus.BAD_REQUEST);
      }

      // 檢查用戶是否已經是訂單成員
      const orderMembers = await this.orderMembersService.findByOrderId(
        invitation.orderId,
      );
      const existingMember = orderMembers.find(
        (om) => om.memberId === newMemberId,
      );

      if (existingMember) {
        throw new HttpException('您已經是此課程的成員', HttpStatus.BAD_REQUEST);
      }

      // 更新邀請狀態
      await this.orderInvitationsRepo.update(
        { id: invitation.id },
        {
          status: OrderInvitationStatus.REDEEMED,
          redeemedByUserId: newMemberId,
          redeemedAt: new Date(),
          updatedUser: newMemberId,
        },
      );

      // 建立 order-member 關聯
      await this.orderMembersService.create({
        orderId: invitation.orderId,
        memberId: newMemberId,
        active: true,
      });

      return invitation;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 取得訂單的待接受邀請列表
   */
  async getPendingInvitationsByOrderId(
    orderId: string,
  ): Promise<OrderInvitationResponseDto[]> {
    try {
      const invitations = await this.orderInvitationsRepo.find({
        where: {
          orderId,
          status: OrderInvitationStatus.PENDING,
          expiresAt: MoreThan(new Date()),
        },
        relations: ['inviter'],
        order: {
          createdTime: 'DESC',
        },
      });

      return plainToInstance(OrderInvitationResponseDto, invitations, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 取消邀請
   */
  async cancelInvitation(
    invitationId: string,
    memberId: string,
  ): Promise<void> {
    try {
      const invitation = await this.orderInvitationsRepo.findOne({
        where: { id: invitationId },
        relations: ['order'],
      });

      if (!invitation) {
        throw new HttpException('邀請不存在', HttpStatus.NOT_FOUND);
      }

      // 驗證權限：只有邀請人或訂單所有者可以取消
      if (
        invitation.inviterUserId !== memberId &&
        invitation.order.orderer !== memberId
      ) {
        throw new HttpException('您沒有權限取消此邀請', HttpStatus.FORBIDDEN);
      }

      // 只能取消待接受的邀請
      if (invitation.status !== OrderInvitationStatus.PENDING) {
        throw new HttpException('只能取消待接受的邀請', HttpStatus.BAD_REQUEST);
      }

      await this.orderInvitationsRepo.update(
        { id: invitationId },
        {
          status: OrderInvitationStatus.CANCELLED,
          updatedUser: memberId,
        },
      );
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 清理過期的邀請（可定期執行）
   */
  async expireOldInvitations(): Promise<number> {
    try {
      const result = await this.orderInvitationsRepo.update(
        {
          status: OrderInvitationStatus.PENDING,
          expiresAt: LessThan(new Date()),
        },
        {
          status: OrderInvitationStatus.EXPIRED,
        },
      );

      return result.affected || 0;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
