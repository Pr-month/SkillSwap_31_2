import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
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
  async create(
    @Request() req: TAuthResponse,
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    const userId = req.user.sub;
    return await this.skillsService.create(userId, createSkillDto);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(
    @Request() req: TAuthResponse,
    @Param('id') id: string,
  ): Promise<Skill> {
    const userId = req.user.sub;
    return await this.skillsService.addToFavorites(+id, userId);
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: TAuthResponse) {
    const userId = req.user.sub;
    return this.skillsService.remove(+id, userId);
  }
}
