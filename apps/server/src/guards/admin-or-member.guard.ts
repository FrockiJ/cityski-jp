import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Member } from 'src/members/entities/member.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminOrMemberGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      request['user'] = payload;

      const id = payload.sub;

      // Try to find as admin user first
      const user = await this.userRepo.findOne({
        where: { id },
        relations: [
          'userRolesDepartments',
          'userRolesDepartments.role',
          'userRolesDepartments.department',
        ],
      });

      if (user) {
        // Admin user found - set roles and departments
        request['roles'] = user.userRolesDepartments.map(
          (userRoleDep) => userRoleDep.role.name,
        );
        request['departments'] = user.userRolesDepartments.map(
          (userRoleDep) => userRoleDep.department.name,
        );
        request['userType'] = 'admin';
        return true;
      }

      // Try to find as member
      const member = await this.memberRepo.findOne({
        where: { id },
      });

      if (member) {
        // Member found - set roles as ['member']
        request['roles'] = ['member'];
        request['userType'] = 'member';
        return true;
      }

      // Neither admin nor member found
      throw new UnauthorizedException('User not found');
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      // JWT verification failed
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
