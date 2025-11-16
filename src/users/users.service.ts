import { Injectable, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: any) {}

  create() {
    return `This action adds a new user`;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();

    if (!users) {
      throw new NotFoundException('Список пользователей пуст');
    }
    return users;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.findOne(userId);
    return user;
  }

  update(id: number) {
    return `This action updates a #${id} user `;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
