import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @Request() req: TAuthResponse,
  ): Promise<UserResponseDto> {
    const userId = req.user.sub;
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
