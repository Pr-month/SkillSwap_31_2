export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  about: string;
  birthday: Date;
  city: string;
  avatar: string;
  categoryId: number;
  wantToLearnCategories?: string[];
}
