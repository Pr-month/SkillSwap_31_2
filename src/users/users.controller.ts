import { Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { };

  @Post()
  create() {
    return this.usersService.create();
  }

  @Get()
  async findAll(): Promise<{ total: number; users: UserResponseDto[] }> {
    const users = await this.usersService.findAll();
    return {
      total: users.length,
      users: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  @Get('me')
  async getCurrentUser(@Request() req): Promise<UserResponseDto> {
    const userId = req.user.id
    return this.usersService.getCurrentUser(userId);
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

