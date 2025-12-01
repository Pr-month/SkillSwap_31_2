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
import { JwtRolesGuard } from '../auth/guards/jwt-roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as RequestEntity } from './entities/request.entity';
import { TAuthResponse } from '../auth/type';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    return await this.requestsService.create(createRequestDto);
  }

  @Get('incomming')
  @UseGuards(JwtAuthGuard)
  async getIncommingRequests(@Request() req: TAuthResponse) {
    return await this.requestsService.findIncomming(req.user.sub);
  }

  @Get('incomming/inProgress')
  @UseGuards(JwtAuthGuard)
  async getIncommingInProgressRequests(@Request() req: TAuthResponse) {
    return await this.requestsService.findIncommingInProgress(req.user.sub);
  }

  @Get('outgoing')
  @UseGuards(JwtAuthGuard)
  async getOutgoingRequests(@Request() req: TAuthResponse) {
    return await this.requestsService.findOutgoing(req.user.sub);
  }

  @Get('outgoing/inProgress')
  @UseGuards(JwtAuthGuard)
  async getOutgoingInProgressRequests(@Request() req: TAuthResponse) {
    return await this.requestsService.findOutgoingInProgress(req.user.sub);
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
