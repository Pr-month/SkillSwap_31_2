import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TAuthResponse } from '../auth/type';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-user.dto';
import { JwtRolesGuard } from '../auth/guards/jwt-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/users.enums';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: FindUsersQueryDto) {
    return this.usersService.findAll(query);
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
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id);
  }
}
