import { IsInt, IsPositive } from 'class-validator';

export class CreateRequestDto {
  @IsInt()
  @IsPositive()
  offeredSkill: number;

  @IsInt()
  @IsPositive()
  requestedSkill: number;
}
