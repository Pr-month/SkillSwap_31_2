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

// перенести в  SkillDto или удалить
class SkillResponseDto {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  owner: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
