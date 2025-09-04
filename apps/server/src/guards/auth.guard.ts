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
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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

      // assigning payload of verified token to request object
      request['user'] = payload;

      // find user and their allowed roles
      const id = payload.sub; // user's id is stored in jwt token's sub
      const user = await this.userRepo.findOne({
        where: { id },
        // inner join all other tables via the UserRolesDepartment table
        relations: [
          'userRolesDepartments',
          'userRolesDepartments.role',
          'userRolesDepartments.department',
        ],
      });

      // attaching roles and departments to request

      request['roles'] = user.userRolesDepartments.map(
        (userRoleDep) => userRoleDep.role.name,
      );

      request['departments'] = user.userRolesDepartments.map(
        (userRoleDep) => userRoleDep.department.name,
      );
    } catch {
      // jwt decryption failed, so throw an unauthorized exception
      throw new UnauthorizedException();
    }
    return true;
  }

  // get token from authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
