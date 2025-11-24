import { SkillResponseDto } from '../../skills/dto/get-skill.dto';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  about: string;
  birthdate: Date;
  city: string;
  gender: string;
  avatar: string;
  skills: SkillResponseDto[];
  wantToLearn: string[];
  favoriteSkills: SkillResponseDto[];
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
