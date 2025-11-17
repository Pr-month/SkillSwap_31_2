import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  create(createSkillDto: CreateSkillDto) {
    return createSkillDto;
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
