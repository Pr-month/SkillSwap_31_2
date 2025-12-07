import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

import { IJwtConfig, jwtConfig } from '../../config/jwt.config';
import { ExtendedSocket, TJwtPayload } from '../../auth/type';

@Injectable()
export class WsJwtGuard {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: IJwtConfig,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: ExtendedSocket = context.switchToWs().getClient();
    const token = client.handshake.query.token as string;

    if (!token) {
      throw new WsException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<TJwtPayload>(token, {
        secret: this.jwtConfig.secretToken,
      });

      client.data.user = payload;
      return true;
    } catch (error: unknown) {
      //   throw new WsException('Invalid token');
      throw new WsException((error as Error).message);
    }
  }
}
