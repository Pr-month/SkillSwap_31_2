import { SkillResponseDto } from '../../skills/dto/get-skill.dto';
import { UserGender } from '../users.enums';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  about: string;
  birthdate: Date;
  city: string;
  gender: UserGender;
  avatar: string;
  skills: SkillResponseDto[];
  wantToLearn: string[];
  favoriteSkills: SkillResponseDto[];
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
