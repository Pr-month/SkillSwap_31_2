import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto, @Res() res) {
    const user = await this.usersService.create(createAuthDto);
    return await this.authService.auth(user, res);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req, @Res() res) {
    return await this.authService.auth(req.user, res);
  }
}
