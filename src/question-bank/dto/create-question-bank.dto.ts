import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export class CreateQuestionBankDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel = DifficultyLevel.MEDIUM;

  @IsString()
  @IsOptional()
  subjectId?: string;
}
