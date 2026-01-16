import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Skill } from '../skills/entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { FindUsersQueryDto } from './dto/find-user.dto';

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

  async findAll(query: FindUsersQueryDto): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;

    const total = await this.userRepository.count();

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw new NotFoundException(
        `Страница ${page} не найдена. Всего страниц: ${totalPages}`,
      );
    }

    const users = await this.userRepository.find({
      order: { id: 'DESC' },
      skip: offset,
      take: limit,
      relations: ['wantToLearn'],
    });

    if (users.length === 0) {
      throw new NotFoundException('Пользователи не найдены');
    }

    return {
      users,
      total,
      page,
      totalPages,
    };
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

    if (dto.wantToLearnCategories) {
      if (dto.wantToLearnCategories.length > 0) {
        const categories = await this.categoryRepository.findBy({
          id: In(dto.wantToLearnCategories),
        });
        if (categories.length !== dto.wantToLearnCategories.length) {
          throw new NotFoundException('Ошибка задания id категорий');
        }
        user.wantToLearn = categories;
      } else user.wantToLearn = [];
    } else Object.assign(user, dto);

    return await this.userRepository.save(user);
  }

  async updateToken(userId: number, token: string): Promise<void> {
    const user = await this.findOne(userId);
    if (user) {
      this.userRepository.update(userId, {
        refreshToken: token,
      });
    }
  }

  async remove(id: number): Promise<void> {
    if (!id || Number.isNaN(id)) {
      throw new BadRequestException('Некорректный id пользователя');
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    await this.userRepository.remove(user);
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

  async clearToken(userId: number): Promise<void> {
    const user = await this.findOne(userId);
    if (user) {
      await this.userRepository.update(userId, {
        refreshToken: '',
      });
    }
  }
}
