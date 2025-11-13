import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderMembersService } from './order-members.service';
import { OrderMember } from './entities/order-member.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrderMemberSearchResponseDto, OrderMemberResponseDto, TransferOrderMemberRequestDto } from '@repo/shared';
import { plainToInstance } from 'class-transformer';

@Controller('/order-members')
export class OrderMembersController {
  constructor(private orderMembersService: OrderMembersService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  create(@Body() body: Partial<OrderMember>): Promise<OrderMember> {
    return this.orderMembersService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('/search')
  async searchWithCoursesLeft(
    @Query('keyword') keyword: string,
  ): Promise<OrderMemberSearchResponseDto[]> {
    return plainToInstance(
      OrderMemberSearchResponseDto,
      await this.orderMembersService.searchWithCoursesLeft(keyword || ''),
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
