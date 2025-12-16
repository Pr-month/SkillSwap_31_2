import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Skill } from '../skills/entities/skill.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateUserDto) {
    const { categoryId, ...userData } = dto;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    const user = this.userRepository.create({
      ...userData,
      wantToLearn: [category],
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (!users) {
      throw new NotFoundException('Список пользователей пуст');
    }
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.findOne(userId);
    return user;
  }

  async updateUserPassword(
    userId: number,
    updatePassword: UpdatePasswordDto,
  ): Promise<void> {
    const user = (await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    })) as Pick<User, 'id' | 'password'> | null;
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    const isOldPasswordValid = await bcrypt.compare(
      updatePassword.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }
    if (updatePassword.oldPassword === updatePassword.newPassword) {
      throw new BadRequestException(
        'Новый пароль должен отличаться от старого',
      );
    }
    const hashedNewPassword = await bcrypt.hash(updatePassword.newPassword, 10);

    await this.userRepository.update(
      { id: userId },
      { password: hashedNewPassword },
    );
  }

  async updateMe(userId: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);

    Object.assign(user, dto);

    return await this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUsersBySkill(skillId: number): Promise<User[]> {
    const skill = await this.skillsRepository.findOne({
      where: { id: skillId },
    });
    if (!skill) throw new NotFoundException(`Навык с id ${skillId} не найден`);

    const categoryId = skill.category.id;

    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.wantToLearn', 'skill')
      .where('skill.categoryId = :categoryId', { categoryId })
      .distinct(true) // Убирает дублирование пользователей
      .take(10)
      .getMany();

    return users;
  }
}
