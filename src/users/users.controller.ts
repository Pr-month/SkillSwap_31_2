import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TAuthResponse } from '../auth/type';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.usersService.getCurrentUser(userId);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Get('by-skill/:id')
  async findUsersBySkill(@Param('id') id: number) {
    return await this.usersService.findUsersBySkill(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Request() req: TAuthResponse, @Body() dto: UpdateUserDto) {
    const userId = req.user.sub;
    return this.usersService.updateMe(userId, dto);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  async updateUserPassword(
    @Request() req: TAuthResponse,
    @Body() updatePassword: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user.sub;
    await this.usersService.updateUserPassword(userId, updatePassword);
    return { message: 'Пароль успешно изменен' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
