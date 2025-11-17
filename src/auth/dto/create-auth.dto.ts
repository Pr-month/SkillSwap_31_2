import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsDateString,
  IsEnum,
  IsArray,
  IsFQDN,
  ArrayUnique,
  ArrayMaxSize,
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

  @IsEnum(['male', 'female', 'not specified'])
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(16)
  gender: UserGender;

  @IsFQDN()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1024)
  avatar: string;
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
