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
  searchWithCoursesLeft(
    @Query('keyword') keyword: string,
  ): Promise<OrderMember[]> {
    return this.orderMembersService.searchWithCoursesLeft(keyword || '');
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(): Promise<OrderMember[]> {
    return this.orderMembersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<OrderMember> {
    return this.orderMembersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get('/order/:orderId')
  findByOrderId(@Param('orderId') orderId: string): Promise<OrderMember[]> {
    return this.orderMembersService.findByOrderId(orderId);
  }

  @UseGuards(AuthGuard)
  @Get('/member/:memberId')
  findByMemberId(@Param('memberId') memberId: string): Promise<OrderMember[]> {
    return this.orderMembersService.findByMemberId(memberId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<OrderMember>,
  ): Promise<OrderMember> {
    return this.orderMembersService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderMembersService.remove(id);
  }
}
