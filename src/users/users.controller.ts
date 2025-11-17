import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TAuthResponse } from '../auth/type';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-user-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create() {
    return this.usersService.create();
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.usersService.getCurrentUser(userId);
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

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
