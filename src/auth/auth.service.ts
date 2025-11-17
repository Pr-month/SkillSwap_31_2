import {
  Inject,
  Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { configuration, IConfig } from 'src/config/app.config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(configuration.KEY)
    private readonly appConfig: IConfig
  ) { }

  async auth(user: User) {
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validatePassword(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const hash = await bcrypt.hash(password, this.appConfig.hashSalt);
    const matched = await bcrypt.compare(password, hash);
    if (matched) {
      return user;
    }
    return null;
  }
}
