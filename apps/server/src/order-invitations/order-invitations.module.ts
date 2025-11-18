import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrderInvitationsController } from './order-invitations.controller';
import { OrderInvitationsService } from './order-invitations.service';
import { OrderInvitation } from './entities/order-invitation.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Member } from 'src/members/entities/member.entity';
import { OrderMembersModule } from 'src/order-members/order-members.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderInvitation, Order, Member, User]),
    forwardRef(() => OrderMembersModule),
    forwardRef(() => UsersModule),
    JwtModule,
  ],
  controllers: [OrderInvitationsController],
  providers: [OrderInvitationsService],
  exports: [OrderInvitationsService],
})
export class OrderInvitationsModule {}
