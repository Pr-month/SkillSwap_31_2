import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { configuration, IConfig } from 'src/config/app.config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import {
  IJwtConfig,
  jwtConfig as JwtConfigInjection,
} from 'src/config/jwt.config';
import { TJwtPayload } from './type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(configuration.KEY)
    private readonly appConfig: IConfig,
    @Inject(JwtConfigInjection.KEY)
    private readonly jwtConfig: IJwtConfig,
  ) {}

  async auth(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload: TJwtPayload = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.secretToken,
      expiresIn: this.jwtConfig.secretExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.refreshToken,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return Promise.resolve({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  generateTokens(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    return this.auth(user);
  }

  async validatePassword(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null; // Пользователь не найден
    }
    // Сравниваем введённый пароль с хешем из базы данных
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    return null;
  }
}
