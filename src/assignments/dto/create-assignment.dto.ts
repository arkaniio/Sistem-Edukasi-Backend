import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;

  @IsOptional()
  @IsString()
  classSubjectId?: string;

  @IsOptional()
  @IsString()
  classId?: string;
}
