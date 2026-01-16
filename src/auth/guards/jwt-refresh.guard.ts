import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { TAuthResponse, TJwtPayload } from '../type';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly usersService: UsersService) {
    super('jwt-refresh');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (typeof canActivate === 'boolean' && !canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest<TAuthResponse>();
    const authHeader = request.headers['authorization'] as string | undefined;

    if (typeof authHeader !== 'string') {
      return false;
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    const userData: TJwtPayload | undefined = request.user;

    if (!userData) {
      return false;
    }

    const user = await this.usersService.findOne(userData.sub);
    if (!user || user.refreshToken !== token) {
      return false;
    }

    return true;
  }
}
