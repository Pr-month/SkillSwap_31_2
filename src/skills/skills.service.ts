import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindSkillsQueryDto } from './dto/find-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

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

  async findAll(query: FindSkillsQueryDto): Promise<{
    skills: Skill[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page, limit, search } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any = {};

    if (search) {
      whereConditions.name = Like(`%${search}%`);
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

  remove(id: number) {
    return id;
  }
}
