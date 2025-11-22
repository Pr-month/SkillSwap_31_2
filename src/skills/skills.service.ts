import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindSkillsQueryDto } from './dto/find-skill.dto';


@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) { }

  create(createSkillDto: CreateSkillDto) {
    return createSkillDto;
  }

  async findAll(query: FindSkillsQueryDto): Promise<{ skills: Skill[]; total: number; page: number; totalPages: number }> {
    const { page, limit, search } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any = {};

    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    const total = await this.skillsRepository.count({ where: whereConditions });

    const totalPages = Math.ceil(total / limit);
    if (page > totalPages && total > 0) {
      throw new NotFoundException(`Страница ${page} не найдена. Всего страниц: ${totalPages}`);
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

  findOne(id: number) {
    return id;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return updateSkillDto;
  }

  remove(id: number) {
    return id;
  }
}
