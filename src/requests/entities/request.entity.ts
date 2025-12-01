import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequestStatus } from '../requests.enums';
import { Skill } from 'src/skills/entities/skill.entity';

@Entity('request')
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  receiver: User;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.pending,
  })
  status: RequestStatus;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Skill, { nullable: false, onDelete: 'CASCADE' })
  offeredSkill: Skill;

  @ManyToOne(() => Skill, { nullable: false, onDelete: 'CASCADE' })
  requestedSkill: Skill;

  @Column({
    default: false,
  })
  isread: boolean;
}
