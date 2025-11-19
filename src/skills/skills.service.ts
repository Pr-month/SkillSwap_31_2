import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) { }

  async create(userId: number, createSkillDto: CreateSkillDto): Promise<Skill> {

    const existingSkill = await this.skillsRepository.findOne({
      where: { title: createSkillDto.title }
    });

    if (existingSkill) {
      throw new ConflictException('Навык с таким названием уже существует');
    }

    const skill = this.skillsRepository.create({
      ...createSkillDto,
      owner: { id: userId }
    });
    return await this.skillsRepository.save(skill);
  }

  findAll() {
    return `This action returns all skills`;
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
