import { UserResponseDto } from '../../users/dto/get-user.dto';

export class SkillResponseDto {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  owner: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
