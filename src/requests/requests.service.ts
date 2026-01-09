import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Role } from '../users/users.enums';
import { checkRequestPermissions } from '../utils/checkUserRole';
import { RequestStatus } from './requests.enums';
import { RequestEntity } from './entities/request.entity';
import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    senderId: number,
    dto: CreateRequestDto,
  ): Promise<RequestEntity> {
    const offeredSkill = await this.skillRepository.findOne({
      where: { id: dto.offeredSkill },
      relations: ['owner'],
    });

    if (!offeredSkill) {
      throw new NotFoundException('Offered skill не найден');
    }

    const requestedSkill = await this.skillRepository.findOne({
      where: { id: dto.requestedSkill },
      relations: ['owner'],
    });

    if (!requestedSkill) {
      throw new NotFoundException('Requested skill не найден');
    }

    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundException('Отправитель не найден');
    }

    const receiver = requestedSkill.owner;

    const request = this.requestRepository.create({
      sender,
      receiver,
      offeredSkill,
      requestedSkill,
      status: RequestStatus.pending,
      isread: false,
    });
 this.RequestGateway.notifyUser(createRequestDto.receiver.id, {
      type: createRequestDto.status,
      skillName: createRequestDto.requestedSkill.title,
      fromUserId: createRequestDto.sender.id,
    });
    return await this.requestRepository.save(request);
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
