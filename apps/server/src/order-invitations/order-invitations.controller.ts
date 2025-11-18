import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderInvitationsService } from './order-invitations.service';
import { ClientAuthGuard } from 'src/guards/client-auth.guard';
import { AdminOrMemberGuard } from 'src/guards/admin-or-member.guard';
import {
  CreateOrderInvitationRequestDto,
  OrderInvitationResponseDto,
  RedeemInvitationResponseDto,
  ValidateInvitationResponseDto,
} from '@repo/shared';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

@Controller('/order-invitations')
export class OrderInvitationsController {
  constructor(
    private readonly orderInvitationsService: OrderInvitationsService,
  ) {}

  /**
   * 建立邀請
   */
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async create(
    @Body() createDto: CreateOrderInvitationRequestDto,
    @Req() request: CustomRequest,
  ): Promise<OrderInvitationResponseDto> {
    const memberId = request['user'].sub;
    return this.orderInvitationsService.create(createDto, memberId);
  }

  /**
   * 驗證邀請 token (public endpoint)
   */
  @Get('/validate/:token')
  async validate(
    @Param('token') token: string,
  ): Promise<ValidateInvitationResponseDto> {
    return this.orderInvitationsService.validateToken(token);
  }

  /**
   * 兌換邀請（已登入用戶）
   */
  @UseGuards(ClientAuthGuard)
  @Post('/redeem/:token')
  async redeem(
    @Param('token') token: string,
    @Req() request: CustomRequest,
  ): Promise<RedeemInvitationResponseDto> {
    const memberId = request['user'].sub;
    const invitation =
      await this.orderInvitationsService.redeemInvitation(token, memberId);
    return {
      message: '成功加入課程',
      order: invitation.order as any,
    };
  }

  /**
   * 取得訂單的待接受邀請列表
   */
  @UseGuards(AdminOrMemberGuard)
  @Get('/order/:orderId')
  async getOrderInvitations(
    @Param('orderId') orderId: string,
  ): Promise<OrderInvitationResponseDto[]> {
    return this.orderInvitationsService.getPendingInvitationsByOrderId(orderId);
  }

  /**
   * 取消邀請
   */
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async cancel(
    @Param('id') id: string,
    @Req() request: CustomRequest,
  ): Promise<{ message: string }> {
    const memberId = request['user'].sub;
    await this.orderInvitationsService.cancelInvitation(id, memberId);
    return { message: '邀請已取消' };
  }
}
