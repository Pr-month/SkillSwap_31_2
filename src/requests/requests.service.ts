import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { RequestEntity } from './entities/request.entity';
import { Role } from '../users/users.enums';
import { checkRequestPermissions } from '../utils/checkUserRole';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
  ) { }

  create(createRequestDto: CreateRequestDto) {
    return createRequestDto;
  }

  findAll() {
    return `This action returns all requests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  async update(
    id: number,
    updateRequestDto: UpdateRequestDto,
    userId: number,
    userRole: Role
  ): Promise<RequestEntity> {
    try {
      const request = await this.requestRepository.findOneOrFail({
        where: { id },
        relations: ['sender']
      });

      checkRequestPermissions(request, userId, userRole, 'update');

      const updatedRequest = this.requestRepository.merge(request, updateRequestDto);
      return await this.requestRepository.save(updatedRequest);

    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Заявка с id ${id} не найдена`);
      }
      throw error;
    }
  }

  async remove(
    id: number,
    userId: number,
    userRole: Role): Promise<RequestEntity> {
    try {
      const request = await this.requestRepository.findOneOrFail({
        where: { id },
        relations: ['sender']
      });

      checkRequestPermissions(request, userId, userRole, 'delete');

      return await this.requestRepository.remove(request);

    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Заявка с id ${id} не найдена`);
      }
      throw error;
    }
  }
}
