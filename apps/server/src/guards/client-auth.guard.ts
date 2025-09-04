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
import { Repository } from 'typeorm';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verify the token and extract the payload
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Find the member using the ID from the token payload (assuming it's in the 'sub' field)
      const member = await this.memberRepo.findOne({
        where: { id: payload.sub },
      });

      if (!member) {
        throw new UnauthorizedException('無此帳號');
      }

      request['user'] = payload;
    } catch (err) {
      console.log('err:', err);
      // Throw UnauthorizedException if JWT validation fails
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  // Extract token from the Authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
