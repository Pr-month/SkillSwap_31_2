import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Request as RequestEntity } from './entities/request.entity';
import { Role } from '../users/users.enums';
import { checkRequestPermissions } from '../utils/checkUserRole';
import { RequestStatus } from './requests.enums';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<RequestEntity>,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<RequestEntity> {
    const request = this.requestRepository.create(createRequestDto);
    await this.requestRepository.save(request);
    return request;
  }

  async findIncomming(userId: number): Promise<RequestEntity[]> {
    const requests = await this.requestRepository.find({
      where: {
        receiver: {
          id: userId,
        },
      },
    });
    return requests;
  }

  async findIncommingInProgress(userId: number): Promise<RequestEntity[]> {
    const requests = await this.requestRepository.find({
      where: {
        receiver: {
          id: userId,
        },
        status: RequestStatus.pending,
      },
    });
    return requests;
  }

  async findOutgoing(userId: number): Promise<RequestEntity[]> {
    const requests = await this.requestRepository.find({
      where: {
        sender: {
          id: userId,
        },
      },
    });
    return requests;
  }

  async findOutgoingInProgress(userId: number): Promise<RequestEntity[]> {
    const requests = await this.requestRepository.find({
      where: {
        sender: {
          id: userId,
        },
        status: RequestStatus.pending,
      },
    });
    return requests;
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
    userRole: Role,
  ): Promise<RequestEntity> {
    try {
      const request = await this.requestRepository.findOneOrFail({
        where: { id },
        relations: ['sender'],
      });

      checkRequestPermissions(request, userId, userRole, 'update');

      const updatedRequest = this.requestRepository.merge(
        request,
        updateRequestDto,
      );
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
    userRole: Role,
  ): Promise<RequestEntity> {
    try {
      const request = await this.requestRepository.findOneOrFail({
        where: { id },
        relations: ['sender'],
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
