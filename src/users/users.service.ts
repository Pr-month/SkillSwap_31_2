import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create() {
    return `This action adds a new user`;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (!users) {
      throw new NotFoundException('Список пользователей пуст');
    }
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    return user;
  }

  async updateUserPassword(userId: string, updatePassword: UpdatePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    const isOldPasswordValid = await bcrypt.compare(
      updatePassword.oldPassword,
      user.password
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }
    if (updatePassword.oldPassword === updatePassword.newPassword) {
      throw new BadRequestException('Новый пароль должен отличаться от старого');
    }
    const hashedNewPassword = await bcrypt.hash(updatePassword.newPassword, 10);

    await this.userRepository.updatePassword(userId, hashedNewPassword);
  }

  update(id: number) {
    return `This action updates a #${id} user `;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
