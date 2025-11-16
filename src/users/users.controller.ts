import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { TJwtPayload } from '../auth/type';

export type TAuthResponse = Request & {
  user: TJwtPayload;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create() {
    return this.usersService.create();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  async updateUserPassword(
    @Request() req: TAuthResponse,
    @Body() updatePassword: UpdatePasswordDto
  ): Promise<{ message: string }> {
    const userId = req.user.sub;
    if (!userId) {
      throw new NotFoundException('ID пользователя не указан');
    }
    if (!updatePassword) {
      throw new NotFoundException('Указаны не все данные для обновленя пароля');
    }
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
