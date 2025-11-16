import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configuration, IConfig } from 'src/config/app.config';
import { TJwtPayload } from '../type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(configuration.KEY)
    private readonly configService: IConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.secretToken,
    });
  }

  async validate(payload: TJwtPayload) {
    return payload;
  }
}
