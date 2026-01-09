import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RequestStatus } from '../requests.enums';

export class UpdateRequestDto {
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsBoolean()
  isread?: boolean;
}
