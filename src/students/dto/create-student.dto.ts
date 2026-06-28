import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
