import { User } from 'src/users/entities/user.entity';
import { RequestStatus } from '../requests.enums';
import { Skill } from 'src/skills/entities/skill.entity';

export class CreateRequestDto {
  sender: User;
  receiver: User;
  status: RequestStatus;
  offeredSkill: Skill;
  requestedSkill: Skill;
  isread: boolean;
}
