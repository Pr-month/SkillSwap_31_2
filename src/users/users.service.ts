import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private userRepository: any) { }

  create() {
    return `This action adds a new user`;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
