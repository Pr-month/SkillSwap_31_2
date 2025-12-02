import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { IJwtConfig, jwtConfig } from 'src/config/jwt.config';

@Injectable()
export class WsJwtGuard {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: IJwtConfig,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token as string;

    if (!token) {
      throw new WsException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.jwtConfig.secretToken,
      });

      client.handshake.user = payload;
      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }
}
