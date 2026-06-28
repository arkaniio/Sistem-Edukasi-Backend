import { IsIn, IsOptional } from 'class-validator';

export class MarkAttendanceDto {
  @IsOptional()
  @IsIn(['PRESENT', 'ABSENT', 'LATE'])
  status?: string;
}
