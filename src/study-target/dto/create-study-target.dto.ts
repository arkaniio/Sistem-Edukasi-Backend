import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StudyTargetPeriod } from '@prisma/client';

export class CreateStudyTargetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(StudyTargetPeriod)
  period: StudyTargetPeriod;
}
