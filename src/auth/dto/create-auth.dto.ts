import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender } from 'src/users/users.enums';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(4096)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(512)
  about: string;

  @IsDateString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  birthday: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(512)
  city: string;

  @IsEnum(UserGender)
  @IsNotEmpty()
  gender: UserGender;

  @IsUrl()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1024)
  avatar: string;

  @IsInt()
  @IsPositive()
  categoryId: number;
  /*
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @ArrayMaxSize(255)
  @MaxLength(128, { each: true })
  skills: string[];
*/
  /*
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @ArrayMaxSize(255)
  @MaxLength(128, { each: true })
  wantToLearn: string[];
*/
  /*
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @ArrayMaxSize(255)
  @MaxLength(128, { each: true })
  favoriteSkills: string[];
*/
}
