import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async auth(user: User, @Res() res) {
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
    const hash = await bcrypt.hash(password);
    const matched = await bcrypt.compare(password, hash);
    if (matched) {
      return user;
    }
    return null;
  }
}
