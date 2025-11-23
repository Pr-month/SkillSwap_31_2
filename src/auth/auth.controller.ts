import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.usersService.create(createAuthDto);
    return await this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user as User;
    return await this.authService.auth(user);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: Request) {
    const user = req.user as User;
    return await this.authService.auth(user);
  }
}
