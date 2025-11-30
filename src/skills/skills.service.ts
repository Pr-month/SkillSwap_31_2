import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindSkillsQueryDto } from './dto/find-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(userId: number, createSkillDto: CreateSkillDto): Promise<Skill> {
    const existingSkill = await this.skillsRepository.findOne({
      where: { title: createSkillDto.title },
    });

    if (existingSkill) {
      throw new ConflictException('Навык с таким названием уже существует');
    }

    const skill = this.skillsRepository.create({
      ...createSkillDto,
      owner: { id: userId },
    });
    return await this.skillsRepository.save(skill);
  }

  async addToFavorites(skillId: number, userId: number,): Promise<Skill> {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId },
      relations: ['favoriteSkills'],
    });

    const skill = await this.skillsRepository.findOneOrFail({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundException('Навык не найден');
    }

    const isAlreadyFavorite = user.favoriteSkills?.some(
      (favSkill) => favSkill.id === skillId,
    );

    if (isAlreadyFavorite) {
      throw new ConflictException('Навык уже в избранном');
    }

    if (!user.favoriteSkills) {
      user.favoriteSkills = [];
    }

    user.favoriteSkills.push(skill);

    await this.usersRepository.save(user);

    return skill;
  }

  async findAll(query: FindSkillsQueryDto): Promise<{
    skills: Skill[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page, limit, search } = query;
    const offset = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Skill> = {};

    if (search) {
      whereConditions.title = Like(`%${search}%`);
    }

    const total = await this.skillsRepository.count({ where: whereConditions });

    const totalPages = Math.ceil(total / limit);
    if (page > totalPages && total > 0) {
      throw new NotFoundException(
        `Страница ${page} не найдена. Всего страниц: ${totalPages}`,
      );
    }

    const skills = await this.skillsRepository.find({
      where: whereConditions,
      order: { id: 'DESC' },
      skip: offset,
      take: limit,
    });

    if (skills.length === 0) {
      throw new NotFoundException('Навыки не найдены');
    }

    return {
      skills,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: number) {
    const skill = await this.skillsRepository.findOne({ where: { id } });

    if (!skill) {
      throw new NotFoundException(`Навык с ID ${id} не найден`);
    }

    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);

    Object.assign(skill, updateSkillDto);

    return await this.skillsRepository.save(skill);
  }

  async remove(id: number, userId: number) {
    const skill = await this.skillsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!skill) {
      throw new NotFoundException(`Навык с ID ${id} не найден`);
    }

    if (skill.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалить чужой навык');
    }

    return await this.skillsRepository.remove(skill);
  }

  async removeToFavorites(skillId: number, userId: number): Promise<Skill> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favoriteSkills'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const skill = await this.skillsRepository.findOne({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundException('Навык не найден');
    }

    const skillInFavorites = user.favoriteSkills.some(
      (favSkill) => favSkill.id === skillId,
    );

    if (!skillInFavorites) {
      throw new NotFoundException('Навыка нет в избранном');
    }

    user.favoriteSkills = user.favoriteSkills.filter(
      (favSkill) => favSkill.id !== skillId,
    );

    await this.usersRepository.save(user);

    return skill;
  }
}
