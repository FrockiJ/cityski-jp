import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderMembersService } from './order-members.service';
import { OrderMember } from './entities/order-member.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrderMemberSearchResponseDto, OrderMemberResponseDto, TransferOrderMemberRequestDto, CourseType, CourseSkiType } from '@repo/shared';
import { plainToInstance } from 'class-transformer';
import { AdminOrMemberGuard } from 'src/guards/admin-or-member.guard';
import { CustomRequest } from 'src/shared/interfaces/custom-request';

@Controller('/order-members')
export class OrderMembersController {
  constructor(private orderMembersService: OrderMembersService) {}

  @UseGuards(AdminOrMemberGuard)
  @Post('/')
  async create(
    @Body() body: Partial<OrderMember>,
    @Req() request: CustomRequest,
  ): Promise<OrderMember> {
    const userId = request['user'].sub;
    const userType = request['userType'];

    // Admin 可以跳过验证
    if (userType !== 'admin') {
      // Member 需要验证 orderId 所有权
      if (!body.orderId) {
        throw new HttpException(
          'orderId is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 验证 order 是否属于当前 member
      const hasAccess = await this.orderMembersService.validateOrderOwnership(
        body.orderId,
        userId,
      );

      if (!hasAccess) {
        throw new HttpException(
          'Order not found or access denied',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return this.orderMembersService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('/search')
  async searchWithCoursesLeft(
    @Query('keyword') keyword: string,
    @Query('orderType') orderType?: CourseType,
    @Query('skiType') skiType?: string,
    @Query('orderNo') orderNo?: string,
    @Query('coursePlanId') coursePlanId?: string,
  ): Promise<OrderMemberSearchResponseDto[]> {
    const skiTypeNum = skiType !== undefined ? parseInt(skiType) : undefined;
    return plainToInstance(
      OrderMemberSearchResponseDto,
      await this.orderMembersService.searchWithCoursesLeft(
        keyword || '',
        orderType,
        skiTypeNum as CourseSkiType,
        orderNo,
        coursePlanId
      ),
      { excludeExtraneousValues: true }
    );
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll(): Promise<OrderMemberResponseDto[]> {
    return plainToInstance(
      OrderMemberResponseDto,
      await this.orderMembersService.findAll(),
      { excludeExtraneousValues: true }
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<OrderMemberResponseDto> {
    return plainToInstance(
      OrderMemberResponseDto,
      await this.orderMembersService.findOne(id),
      { excludeExtraneousValues: true }
    );
  }

  @UseGuards(AuthGuard)
  @Get('/order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string): Promise<OrderMemberResponseDto[]> {
    return plainToInstance(
      OrderMemberResponseDto,
      await this.orderMembersService.findByOrderId(orderId),
      { excludeExtraneousValues: true }
    );
  }

  @UseGuards(AuthGuard)
  @Get('/member/:memberId')
  findByMemberId(@Param('memberId') memberId: string): Promise<OrderMember[]> {
    return this.orderMembersService.findByMemberId(memberId);
  }

  @UseGuards(AuthGuard)
  @Post('/transfer')
  async transfer(
    @Body() body: TransferOrderMemberRequestDto,
  ): Promise<OrderMemberResponseDto> {
    return plainToInstance(
      OrderMemberResponseDto,
      await this.orderMembersService.transfer(body),
      { excludeExtraneousValues: true }
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<OrderMember>,
  ): Promise<OrderMemberResponseDto> {
    return plainToInstance(
      OrderMemberResponseDto,
      await this.orderMembersService.update(id, body),
      { excludeExtraneousValues: true }
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderMembersService.remove(id);
  }
}
