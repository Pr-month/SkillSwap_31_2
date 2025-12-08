import { IsString, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { RequestStatus } from '../../requests/requests.enums';

export class SendRequestDto {
  @IsString()
  @IsEnum(RequestStatus)
  type: RequestStatus;

  @IsString()
  @MaxLength(255)
  skillName: string;

  @IsNumber()
  fromUserId: number;
}
