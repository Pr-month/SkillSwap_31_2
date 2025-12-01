import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/users.enums';
import { JwtRolesGuard } from '../auth/guards/jwt-roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestEntity } from './entities/request.entity';
import { TAuthResponse } from '../auth/type';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtRolesGuard, JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Request() req: TAuthResponse,
  ): Promise<RequestEntity> {
    const userId = req.user.sub;
    const userRole = req.user.role;

    return this.requestsService.update(+id, updateRequestDto, userId, userRole);
  }

  @Delete(':id')
  @UseGuards(JwtRolesGuard, JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @Request() req: TAuthResponse,
  ): Promise<RequestEntity> {
    const userId = req.user.sub;
    const userRole = req.user.role;

    return this.requestsService.remove(+id, userId, userRole);
  }
}
