import { IsNotEmpty, IsString, IsDateString, IsIn } from 'class-validator';

export class CreateAttendanceDto {
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsIn(['PRESENT', 'ABSENT', 'LATE'])
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsString()
  @IsNotEmpty()
  classId!: string;
}
