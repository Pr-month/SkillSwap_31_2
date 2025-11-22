import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Skill } from './entities/skill.entity';
import { TAuthResponse } from '../auth/type';
import { FindSkillsQueryDto } from './dto/find-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: TAuthResponse, @Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    const userId = req.user.sub;
    return await this.skillsService.create(userId, createSkillDto);
  }

  @Get()
  async findAll(@Query() query: FindSkillsQueryDto) {
    return await this.skillsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
